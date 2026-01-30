import sharp from 'sharp';
import { saveImageFile } from './fileStorage';

/**
 * Validate image format
 */
export function validateImageFormat(mimeType: string): boolean {
  const allowedFormats = [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'image/webp',
    'image/bmp',
    'image/tiff'
  ];
  return allowedFormats.includes(mimeType);
}

/**
 * Process image into three sizes - saves as original format first
 */
export async function processAndSaveImages(
  imageBuffer: Buffer,
  markerId: string,
  timestamp: string
): Promise<{
  thumbnailPath: string;
  mediumPath: string;
  largePath: string;
}> {
  const basePath = `markers/${markerId}/${timestamp}`;
  const extension = 'webp'; // Convert all images to WebP
  
  // Detect original image format for logging
  const metadata = await sharp(imageBuffer).metadata();
  const originalFormat = metadata.format || 'unknown';
  
  console.log(`🔍 Converting ${originalFormat} to WebP: ${basePath}`);
  
  // Process each size - convert all to WebP
  const [thumbnail, medium, large] = await Promise.all([
    sharp(imageBuffer)
      .resize(150, 150, { 
        fit: 'cover', 
        position: 'center',
        withoutEnlargement: true 
      })
      .webp({ quality: 85 })
      .toBuffer(),
    
    sharp(imageBuffer)
      .resize(800, 600, { 
        fit: 'cover', 
        position: 'center',
        withoutEnlargement: true 
      })
      .webp({ quality: 85 })
      .toBuffer(),
    
    sharp(imageBuffer)
      .resize(1920, 1080, { 
        fit: 'cover', 
        position: 'center',
        withoutEnlargement: true 
      })
      .webp({ quality: 85 })
      .toBuffer()
  ]);

  // Save all files in parallel
  await Promise.all([
    saveImageFile(thumbnail, `${basePath}-thumb.${extension}`),
    saveImageFile(medium, `${basePath}-medium.${extension}`),
    saveImageFile(large, `${basePath}-large.${extension}`)
  ]);

  return {
    thumbnailPath: `${basePath}-thumb.${extension}`,
    mediumPath: `${basePath}-medium.${extension}`,
    largePath: `${basePath}-large.${extension}`
  };
}

/**
 * Get image metadata
 */
export async function getImageMetadata(imageBuffer: Buffer): Promise<{
  width: number;
  height: number;
  format: string;
}> {
  const metadata = await sharp(imageBuffer).metadata();
  return {
    width: metadata.width || 0,
    height: metadata.height || 0,
    format: metadata.format || 'unknown'
  };
}