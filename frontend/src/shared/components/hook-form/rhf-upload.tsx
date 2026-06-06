import { Controller, useFormContext } from 'react-hook-form';

import FormHelperText from '@mui/material/FormHelperText';

import { CustomUpload } from '../upload/upload-custom';
import { Upload, UploadBox, UploadAvatar } from '../upload';

import type { UploadProps } from '../upload';

// ----------------------------------------------------------------------

type Props = UploadProps & {
  name: string;
};

// ----------------------------------------------------------------------

export function RHFUploadAvatar({ name, ...other }: Props) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const onDrop = (acceptedFiles: File[]) => {
          const value = acceptedFiles[0];

          setValue(name, value, { shouldValidate: true });
        };

        return (
          <div>
            <UploadAvatar value={field.value} error={!!error} onDrop={onDrop} {...other} />

            {!!error && (
              <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                {error.message}
              </FormHelperText>
            )}
          </div>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUploadBox({ name, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <UploadBox value={field.value} error={!!error} {...other} />
      )}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUpload({ name, multiple, helperText, ...other }: Props) {
  const { control, setValue, getValues } = useFormContext();

  const handleDrop = (acceptedFiles: File[]) => {
    const currentFiles = getValues(name) || [];
    const updatedFiles = multiple ? [...currentFiles, ...acceptedFiles] : acceptedFiles.slice(0, 1);
    setValue(name, updatedFiles, { shouldValidate: true });
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const uploadProps = {
          multiple,
          accept: { 'image/*': [] },
          error: !!error,
          helperText: error?.message ?? helperText,
          onDrop: handleDrop,
        };

        return (
          <div>
            <Upload {...uploadProps} value={field.value} {...other} />

            {!!error && (
              <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                {error.message}
              </FormHelperText>
            )}
          </div>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFCustomUpload({ name, multiple, helperText, ...other }: Props) {
  const { control, setValue, getValues } = useFormContext();

  const handleDrop = (acceptedFiles: File[]) => {
    const currentFiles = getValues(name) || [];
    const updatedFiles = multiple ? [...currentFiles, ...acceptedFiles] : acceptedFiles.slice(0, 1);
    setValue(name, updatedFiles, { shouldValidate: true });
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const uploadProps = {
          multiple,
          accept: { 'image/*': [] },
          error: !!error,
          helperText: error?.message ?? helperText,
          onDrop: handleDrop,
        };

        return (
          <div>
            {field.value ? (
              <CustomUpload {...uploadProps} value={field.value} {...other} />
            ) : (
              <div className="placeholder">Please upload a file</div>
            )}
            {!!error && (
              <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                {error.message}
              </FormHelperText>
            )}
          </div>
        );
      }}
    />
  );
}
