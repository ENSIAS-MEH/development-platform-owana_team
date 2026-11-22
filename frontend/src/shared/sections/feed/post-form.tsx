'use client';

import { z as zod } from 'zod';
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { Form, RHFTextField } from 'src/shared/components/hook-form';
import { Upload } from 'src/shared/components/upload';

import { useFeedStore } from 'src/shared/api/stores/feedStore';

import type { Post } from 'src/contexts/types/feed';

import { uploadImageToS3 } from './s3-upload-service';

// ---------------------------------------------------------------------------
// Schema & Types
// ---------------------------------------------------------------------------

const PostSchema = zod.object({
  content: zod
    .string()
    .min(1, { message: 'Le contenu est requis.' })
    .refine((val) => val.trim().length > 0, {
      message: 'Le contenu ne peut pas être vide.',
    }),
});

type PostSchemaType = zod.infer<typeof PostSchema>;

type PostFormProps = {
  editPost?: Post;
  currentUserId: string;
  onSuccess?: () => void;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PostForm({ editPost, currentUserId, onSuccess }: PostFormProps) {
  const isEditMode = !!editPost;

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewURL, setImagePreviewURL] = useState<string | null>(
    editPost?.imageURL ?? null
  );
  const [uploadProgress, setUploadProgress] = useState(0);

  const createPost = useFeedStore((state) => state.createPost);
  const updatePost = useFeedStore((state) => state.updatePost);

  const methods = useForm<PostSchemaType>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      content: editPost?.content ?? '',
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  // -------------------------------------------------------------------------
  // Image handling
  // -------------------------------------------------------------------------

  const handleDropFile = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Revoke previous object URL to avoid memory leaks
      if (imagePreviewURL && imagePreviewURL.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewURL);
      }

      setImageFile(file);
      setImagePreviewURL(URL.createObjectURL(file));
    },
    [imagePreviewURL]
  );

  const handleRemoveImage = () => {
    if (imagePreviewURL && imagePreviewURL.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewURL);
    }
    setImageFile(null);
    setImagePreviewURL(null);
    setUploadProgress(0);
  };

  // -------------------------------------------------------------------------
  // Submit
  // -------------------------------------------------------------------------

  const onSubmit = handleSubmit(async (data) => {
    try {
      let finalImageURL: string | undefined = editPost?.imageURL;

      // Upload new image if a file has been selected
      if (imageFile) {
        setUploadProgress(0);
        finalImageURL = await uploadImageToS3(imageFile, (progress) => {
          setUploadProgress(progress);
        });
        setUploadProgress(100);
      } else if (!imagePreviewURL) {
        // Image was removed in edit mode
        finalImageURL = undefined;
      }

      if (isEditMode && editPost) {
        await updatePost(editPost.id, {
          content: data.content.trim(),
          imageURL: finalImageURL,
        });
      } else {
        await createPost({
          content: data.content.trim(),
          imageURL: finalImageURL,
          userId: currentUserId,
        });
      }

      // Reset state on success
      reset();
      handleRemoveImage();
      setUploadProgress(0);
      onSuccess?.();
    } catch (error: any) {
      toast.error(
        isEditMode
          ? 'Unable to update the post.'
          : 'Unable to create the post.'
      );
    }
  });

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  const isUploading = uploadProgress > 0 && uploadProgress < 100;

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2}>
        {/* Content field */}
        <RHFTextField
          name="content"
          label={isEditMode ? 'Edit post' : 'What\'s new?'}
          placeholder="Share something with your network..."
          multiline
          minRows={3}
          disabled={isSubmitting}
        />

        {/* Image upload zone — only shown when no image is selected */}
        {!imagePreviewURL && (
          <Upload
            accept={{ 'image/jpeg': [], 'image/png': [], 'image/webp': [] }}
            maxSize={5 * 1024 * 1024}
            onDrop={handleDropFile}
            disabled={isSubmitting}
            placeholder={
              <Stack direction="row" alignItems="center" spacing={1} sx={{ color: 'text.disabled', py: 1 }}>
                <FontAwesomeIcon icon={faImage} fontSize={18} />
                <Typography variant="body2">
                  Drop an image here or click to browse
                </Typography>
              </Stack>
            }
          />
        )}

        {/* Image preview */}
        {imagePreviewURL && (
          <Box sx={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
            <Box
              component="img"
              src={imagePreviewURL}
              alt="Prévisualisation de l'image"
              sx={{
                width: '100%',
                maxHeight: 300,
                objectFit: 'cover',
                borderRadius: 1,
                display: 'block',
              }}
            />
            <IconButton
              onClick={handleRemoveImage}
              disabled={isSubmitting}
              aria-label="Remove selected image"
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0,0,0,0.55)',
                color: 'common.white',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' },
              }}
            >
              <FontAwesomeIcon icon={faTimes} fontSize={14} />
            </IconButton>
          </Box>
        )}

        {/* Upload progress bar */}
        {isUploading && (
          <Box>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Upload en cours… {uploadProgress}%
            </Typography>
          </Box>
        )}

        {/* Submit button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            aria-label={isEditMode ? 'Save changes' : 'Publish post'}
            startIcon={
              isSubmitting ? <CircularProgress size={16} color="inherit" /> : undefined
            }
          >
            {isEditMode ? 'Save' : 'Publish'}
          </Button>
        </Box>
      </Stack>
    </Form>
  );
}
