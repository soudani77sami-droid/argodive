import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export function getCloudinaryUrl(publicId: string, options?: { width?: number; height?: number; quality?: number }) {
  const base = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo'}/image/upload`;
  const transformations: string[] = [];

  if (options?.width) transformations.push(`w_${options.width}`);
  if (options?.height) transformations.push(`h_${options.height}`);
  if (options?.quality) transformations.push(`q_${options.quality}`);
  transformations.push('f_auto');

  const transformStr = transformations.length > 0 ? `${transformations.join(',')}/` : '';
  return `${base}/${transformStr}${publicId}`;
}

export function getCloudinaryThumbnail(publicId: string) {
  return getCloudinaryUrl(publicId, { width: 400, height: 300, quality: 60 });
}
