export const CMS_REVALIDATE = Number(process.env.CMS_REVALIDATE ?? 60);

export function getCmsApiUrl(): string {
  return (
    process.env.CMS_API_URL ??
    process.env.NEXT_PUBLIC_CMS_API_URL ??
    'http://localhost:4000/api'
  );
}

export function useStaticDataOnly(): boolean {
  return process.env.USE_STATIC_DATA === 'true' || process.env.USE_STATIC_DATA === '1';
}
