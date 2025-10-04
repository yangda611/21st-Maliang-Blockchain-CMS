export function publicImage(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) {
    // Fallback to avoid runtime crash; caller should pass full URL if needed
    return path;
  }
  // path example: cms-files/codexia/image/qr-macro.png
  return `${base}/storage/v1/object/public/${path}`;
}
