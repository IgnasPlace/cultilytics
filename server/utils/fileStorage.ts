import { promises as fs } from 'fs';
import * as path from 'path';

/**
 * Save image file to the uploads directory
 */
export async function saveImageFile(
  buffer: Buffer, 
  filePath: string
): Promise<void> {
  const fullPath = path.join('public/uploads', filePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, buffer);
}

/**
 * Delete marker folder and all its contents
 */
export async function deleteMarkerFolder(markerId: string): Promise<void> {
  const folderPath = path.join('public/uploads/markers', markerId);
  try {
    await fs.rmdir(folderPath, { recursive: true });
  } catch (error) {
    // Folder doesn't exist or already removed
  }
}

/**
 * Check if file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    const fullPath = path.join('public/uploads', filePath);
    await fs.access(fullPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Delete a specific file
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    const fullPath = path.join('public/uploads', filePath);
    await fs.unlink(fullPath);
  } catch (error) {
    // File doesn't exist or already removed
  }
}