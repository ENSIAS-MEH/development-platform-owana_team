'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faLock, faCamera, faUpload, faTrash } from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Grid,
  Card,
  List,
  Paper,
  Avatar,
  Alert,
  Button,
  Divider,
  ListItem,
  Container,
  Typography,
  CardContent,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material';

import { GATEWAY_API_URL } from 'src/config-global';
import { endpoints } from 'src/utils/axios';
import { extractApiError } from 'src/utils/api-error';

import { useAuthContext } from 'src/auth/hooks';
import { useAuth } from 'src/auth/context/jwt/use-auth';
import { STORAGE_KEY } from 'src/auth/context/jwt';

// ----------------------------------------------------------------------

export default function ProfilePhotoView() {
  const router = useRouter();
  const DASHBOARD_ROOT = '/dashboard';
  const PROFILE_ROOT = '/dashboard/profile/profile';

  const { user } = useAuth();
  const { checkUserSession } = useAuthContext();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(user?.profilePictureURL || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const initials =
    ((user?.firstName?.[0] ?? '') + (user?.lastName?.[0] ?? '')).toUpperCase() ||
    (user?.email?.[0] ?? 'U').toUpperCase();

  const menuItems = [
    { id: 1, label: 'Personal information', description: 'Manage your personal data', icon: faUser, path: PROFILE_ROOT, active: false },
    { id: 2, label: 'Profile picture', description: 'Customise your avatar', icon: faCamera, path: `${PROFILE_ROOT}/photo`, active: true },
    { id: 3, label: 'Security', description: 'Protect your account', icon: faLock, path: `${PROFILE_ROOT}/security`, active: false },
  ];

  // --- Pick file locally (just preview, no upload yet) ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type & size
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select an image file (JPG, PNG, etc.)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File is too large. Maximum size is 5 MB.');
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setErrorMsg('');
    setSuccessMsg('');
  };

  // --- Upload to backend ---
  const handleSave = async () => {
    if (!selectedFile) {
      setErrorMsg('Please select a photo first.');
      return;
    }

    setUploading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const token = sessionStorage.getItem(STORAGE_KEY);
      const formData = new FormData();
      formData.append('file', selectedFile);

      await axios.post(
        `${GATEWAY_API_URL}${endpoints.users.uploadPicture}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Refresh user context so avatar updates everywhere
      await checkUserSession?.();

      setSuccessMsg('Profile picture updated successfully!');
      setSelectedFile(null);

      // Go back to profile after short delay
      setTimeout(() => router.push(PROFILE_ROOT), 1500);
    } catch (err: any) {
      setErrorMsg(extractApiError(err));
    } finally {
      setUploading(false);
    }
  };

  // --- Delete (remove from preview, save null to backend via profile update) ---
  const handleDelete = async () => {
    setPreview('');
    setSelectedFile(null);
    setSuccessMsg('Photo removed. Save to apply.');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Button
          onClick={() => router.push(DASHBOARD_ROOT)}
          startIcon={<FontAwesomeIcon icon={faHome} />}
          color="primary"
          variant="contained"
          sx={{ fontWeight: 'bold' }}
        >
          Back to dashboard
        </Button>
        <Typography variant="h4" fontWeight="bold">
          Profile Management
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, minHeight: 500, boxShadow: 3, position: 'sticky', top: 70 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Profile Settings
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <List component="nav" disablePadding>
              {menuItems.map((item) => (
                <ListItem
                  key={item.id}
                  button
                  selected={item.active}
                  onClick={() => router.push(item.path)}
                  sx={{
                    borderRadius: 2,
                    mb: 2,
                    p: 2,
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    '&.Mui-selected': { bgcolor: 'action.selected', color: 'primary.main' },
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <FontAwesomeIcon icon={item.icon} />
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography variant="subtitle1" fontWeight="bold">{item.label}</Typography>}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ pl: 5 }}>
                    {item.description}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Main */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, minHeight: 500, boxShadow: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 1 }}>
              Profile picture
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Upload a new photo. Supported formats: JPG, PNG, WEBP — max 5 MB.
            </Typography>

            {successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}
            {errorMsg && <Alert severity="error" sx={{ mb: 3 }}>{errorMsg}</Alert>}

            <Card sx={{ boxShadow: 2 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 4 }}>
                  {/* Avatar preview */}
                  <Avatar
                    src={preview || ''}
                    sx={{ width: 150, height: 150, fontSize: '3rem', fontWeight: 'bold', boxShadow: 2 }}
                  >
                    {!preview && initials}
                  </Avatar>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<FontAwesomeIcon icon={faUpload} />}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change photo
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileSelect}
                    />

                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<FontAwesomeIcon icon={faTrash} />}
                      onClick={handleDelete}
                      disabled={!preview}
                    >
                      Remove photo
                    </Button>
                  </Box>
                </Box>

                {selectedFile && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Selected: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(0)} KB)
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Save button */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSave}
                disabled={uploading || !selectedFile}
              >
                {uploading ? <CircularProgress size={22} color="inherit" /> : 'Save changes'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
