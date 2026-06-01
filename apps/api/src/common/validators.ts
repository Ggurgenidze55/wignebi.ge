import { registerDecorator, ValidationOptions } from 'class-validator';

export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function IsSlug(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSlug',
      target: object.constructor,
      propertyName,
      options: { message: 'Invalid slug format', ...validationOptions },
      validator: {
        validate(value: unknown) {
          return typeof value === 'string' && SLUG_REGEX.test(value) && value.length <= 120;
        },
      },
    });
  };
}

export function IsSafeUrl(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSafeUrl',
      target: object.constructor,
      propertyName,
      options: { message: 'Invalid URL', ...validationOptions },
      validator: {
        validate(value: unknown) {
          if (value === undefined || value === null || value === '') return true;
          if (typeof value !== 'string') return false;
          try {
            const u = new URL(value);
            return u.protocol === 'https:' || u.protocol === 'http:';
          } catch {
            return false;
          }
        },
      },
    });
  };
}

export function sanitizeText(input: string, maxLen: number): string {
  return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').trim().slice(0, maxLen);
}
