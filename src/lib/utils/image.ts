import { ApiError } from '@/lib/api/apiError';

export const MAX_IMAGE_MB = 2;
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export type ImageInput = File | '' | null | undefined;

export const imageFileError = (file: File): string | null => {
  if (!ALLOWED_TYPES.includes(file.type)) return 'Choose a JPG, PNG, WEBP or GIF image.';
  if (file.size > MAX_IMAGE_BYTES) return `Image must be ${MAX_IMAGE_MB} MB or smaller.`;
  return null;
};

export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read the selected image.'));
    reader.readAsDataURL(file);
  });

export const withBase64Image = async <T extends object>(payload: T, field: string): Promise<Record<string, unknown>> => {
  const body = { ...payload } as Record<string, unknown>;
  const value = body[field];
  if (value instanceof File) {
    const error = imageFileError(value);
    if (error) throw new ApiError(error, 400, { [field]: [error] });
    body[field] = await fileToBase64(value);
  } else if (value !== '') {
    delete body[field];
  }
  return body;
};