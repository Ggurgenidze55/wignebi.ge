import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction, MediaType } from '@prisma/client';
import { PutObjectCommand, DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { createHash } from 'crypto';
import { extname } from 'path';
import { AuditService } from '../common/audit.service';
import { PrismaService } from '../prisma/prisma.service';

const ALLOWED: Record<string, MediaType> = {
  '.jpg': MediaType.IMAGE,
  '.jpeg': MediaType.IMAGE,
  '.png': MediaType.IMAGE,
  '.webp': MediaType.IMAGE,
  '.mp3': MediaType.AUDIO,
  '.pdf': MediaType.DOCUMENT,
  '.epub': MediaType.DOCUMENT,
};

const MAX_BYTES: Record<MediaType, number> = {
  [MediaType.IMAGE]: 10 * 1024 * 1024,
  [MediaType.AUDIO]: 100 * 1024 * 1024,
  [MediaType.DOCUMENT]: 50 * 1024 * 1024,
};

@Injectable()
export class MediaService {
  private client: S3Client | null = null;

  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  private getClient() {
    if (this.client) return this.client;
    const endpoint = process.env.R2_ENDPOINT;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    if (!endpoint || !accessKeyId || !secretAccessKey) {
      throw new BadRequestException('R2 storage not configured');
    }
    this.client = new S3Client({
      region: 'auto',
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
    });
    return this.client;
  }

  private publicUrl(key: string) {
    const base = process.env.R2_PUBLIC_URL?.replace(/\/$/, '');
    return base ? `${base}/${key}` : key;
  }

  validateFile(originalName: string, size: number, mimeType: string) {
    const ext = extname(originalName).toLowerCase();
    const mediaType = ALLOWED[ext];
    if (!mediaType) throw new BadRequestException(`File type not allowed: ${ext}`);
    if (size > MAX_BYTES[mediaType]) {
      throw new BadRequestException(`File exceeds size limit for ${mediaType}`);
    }
    return { ext, mediaType };
  }

  async upload(
    file: Express.Multer.File,
    userId: string,
    userEmail: string,
    ip?: string,
  ) {
    const { mediaType, ext } = this.validateFile(file.originalname, file.size, file.mimetype);
    const checksum = createHash('sha256').update(file.buffer).digest('hex');

    const duplicate = await this.prisma.mediaFile.findFirst({
      where: { checksum, deletedAt: null },
    });
    if (duplicate) return { ...duplicate, duplicate: true };

    const key = `media/${mediaType.toLowerCase()}/${Date.now()}-${checksum.slice(0, 12)}${ext}`;
    const bucket = process.env.R2_BUCKET;
    if (!bucket) throw new BadRequestException('R2_BUCKET not configured');

    await this.getClient().send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const url = this.publicUrl(key);
    const row = await this.prisma.mediaFile.create({
      data: {
        key,
        url,
        originalName: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        mediaType,
        checksum,
        uploadedById: userId,
      },
    });

    await this.audit.log({
      userId,
      userEmail,
      action: AuditAction.MEDIA_UPLOADED,
      entityType: 'media',
      entityId: row.id,
      entityLabel: row.originalName,
      ipAddress: ip,
    });

    return row;
  }

  async findAll(q?: string) {
    return this.prisma.mediaFile.findMany({
      where: {
        deletedAt: null,
        ...(q
          ? {
              OR: [
                { originalName: { contains: q, mode: 'insensitive' } },
                { key: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async softDelete(id: string, userId: string, userEmail: string, ip?: string) {
    const row = await this.prisma.mediaFile.findUnique({ where: { id } });
    if (!row || row.deletedAt) throw new NotFoundException();
    await this.prisma.mediaFile.update({ where: { id }, data: { deletedAt: new Date() } });
    await this.audit.log({
      userId,
      userEmail,
      action: AuditAction.MEDIA_DELETED,
      entityType: 'media',
      entityId: id,
      entityLabel: row.originalName,
      ipAddress: ip,
    });
    return { ok: true };
  }

  async replace(id: string, file: Express.Multer.File, userId: string, userEmail: string, ip?: string) {
    const existing = await this.prisma.mediaFile.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) throw new NotFoundException();
    const bucket = process.env.R2_BUCKET!;
    await this.getClient().send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: existing.key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
    const checksum = createHash('sha256').update(file.buffer).digest('hex');
    const row = await this.prisma.mediaFile.update({
      where: { id },
      data: {
        originalName: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        checksum,
      },
    });
    await this.audit.log({
      userId,
      userEmail,
      action: AuditAction.MEDIA_UPLOADED,
      entityType: 'media',
      entityId: id,
      entityLabel: `replaced: ${file.originalname}`,
      ipAddress: ip,
    });
    return row;
  }
}
