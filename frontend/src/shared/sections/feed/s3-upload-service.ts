import axiosInstance from 'src/utils/axios';

import { feedEndpoints } from 'src/shared/api/endpoints/feed';

// ----------------------------------------------------------------------

// Allowed MIME types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
// Max file size: 5 MB
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5,242,880 bytes

// ----------------------------------------------------------------------

export async function uploadImageToS3(
  file: File,
  onUploadProgress?: (progress: number) => void
): Promise<string> {
  // 1. Validate MIME type BEFORE any network call
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(`Type de fichier non autorisé. Formats acceptés : JPEG, PNG, WebP.`);
  }

  // 2. Validate file size BEFORE any network call
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Fichier trop volumineux. Taille maximale : 5 Mo.`);
  }

  // 3. Upload the file via multipart POST /api/posts/upload
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await axiosInstance.post<{ imageUrl: string }>(
    feedEndpoints.posts.upload,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(percent);
        }
      },
    }
  );

  // 4. Return the public URL
  return data.imageUrl;
}
