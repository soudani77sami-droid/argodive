'use server';

import { cloudinary } from '@/lib/cloudinary';

type UploadResult = {
  success: boolean;
  publicId?: string;
  url?: string;
  secureUrl?: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  error?: string;
};

export async function uploadInspectionImage(formData: FormData): Promise<UploadResult> {
  const file = formData.get('image') as File | null;
  if (!file) return { success: false, error: 'No image file provided' };

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'argodive/inspections',
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        },
      );
      uploadStream.end(buffer);
    });

    return {
      success: true,
      publicId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Upload failed' };
  }
}

export async function deleteInspectionImage(publicId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Delete failed' };
  }
}

export async function getUploadSignature() {
  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: 'argodive/inspections', upload_preset: 'argodive_unsigned' },
    process.env.CLOUDINARY_API_SECRET!,
  );

  return {
    timestamp,
    signature,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo',
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder: 'argodive/inspections',
  };
}
