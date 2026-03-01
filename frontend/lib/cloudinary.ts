/**
 * Cloudinary ile görsel yükleme — yüklenen dosya canlı URL olarak döner
 * (örn. https://res.cloudinary.com/.../image/upload/.../xxx.jpg)
 *
 * Gerekli env: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
 * Upload preset: Cloudinary Dashboard > Settings > Upload > Upload presets > Unsigned olarak oluşturun.
 */

const CLOUD_NAME = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME : '';
const UPLOAD_PRESET = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET : '';

export function isCloudinaryConfigured(): boolean {
  return Boolean(CLOUD_NAME && UPLOAD_PRESET);
}

export async function uploadImageToCloudinary(file: File): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary ayarlı değil. NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ve NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ortam değişkenlerini tanımlayın.'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Yükleme başarısız (${res.status})`);
  }

  const data = (await res.json()) as { secure_url?: string };
  if (!data?.secure_url) {
    throw new Error('Cloudinary yanıtında URL yok.');
  }
  return data.secure_url;
}
