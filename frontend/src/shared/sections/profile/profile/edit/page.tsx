'use client';

import axios from 'axios';
import * as zod from 'zod';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm, FormProvider } from 'react-hook-form';
import {
  faUser,
  faArrowLeft,
  faEnvelope,
  faBriefcase,
  faMapMarkerAlt,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Grid,
  Paper,
  Button,
  Divider,
  Container,
  Typography,
  InputAdornment,
} from '@mui/material';

import { GATEWAY_API_URL } from 'src/config-global';
import { endpoints } from 'src/utils/axios';
import { extractApiError } from 'src/utils/api-error';

import { toast } from 'src/shared/components/snackbar';
import { Field } from 'src/shared/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { STORAGE_KEY } from 'src/auth/context/jwt';
import { useAuth } from 'src/auth/context/jwt/use-auth';

// ----------------------------------------------------------------------
// Schema matches UpdateProfileRequest from user-service
// ----------------------------------------------------------------------

const profileSchema = zod.object({
  firstName: zod.string().max(50, 'Max 50 characters').optional(),
  lastName: zod.string().max(50, 'Max 50 characters').optional(),
  username: zod.string().max(30, 'Max 30 characters').optional(),
  bio: zod.string().max(300, 'Max 300 characters').optional(),
  job: zod.string().optional(),
  phoneNumber: zod.string().optional(),
  location: zod.string().optional(),
});

type ProfileFormData = zod.infer<typeof profileSchema>;

// ----------------------------------------------------------------------

export default function EditProfileView() {
  const router = useRouter();
  const PROFILE_PAGE = '/dashboard/profile/profile';

  const { user } = useAuth();
  const { checkUserSession } = useAuthContext();

  const [saving, setSaving] = useState(false);

  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      username: user?.username ?? '',
      bio: user?.bio ?? '',
      job: user?.job ?? '',
      phoneNumber: user?.phoneNumber ?? '',
      location: user?.location ?? '',
    },
    mode: 'onChange',
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true);
    try {
      const token = sessionStorage.getItem(STORAGE_KEY);
      await axios.put(`${GATEWAY_API_URL}${endpoints.users.updateMe}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh user in context so the profile page reflects the changes
      await checkUserSession?.();

      toast.success('Profile updated successfully!');
      router.push(PROFILE_PAGE);
    } catch (error: any) {
      toast.error(extractApiError(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" align="center" fontWeight="bold" sx={{ mb: 4 }}>
        Edit Profile
      </Typography>

      <Grid container spacing={4}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, boxShadow: 3 }}>
            <Button
              onClick={() => router.push(PROFILE_PAGE)}
              startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
              fullWidth
              size="large"
              sx={{ mb: 2, justifyContent: 'flex-start' }}
              color="primary"
              variant="text"
            >
              Back to profile
            </Button>
            <Divider sx={{ my: 2 }} />

            <Typography variant="caption" color="text.secondary">
              Changes will be saved to FoundersSync and reflected immediately.
            </Typography>
          </Paper>
        </Grid>

        {/* Form */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 4, boxShadow: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 1 }}>
              Personal information
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Update your name, username, bio and contact details.
            </Typography>

            <FormProvider {...methods}>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
              >
                <Grid container spacing={3}>
                  {/* Name */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                      Name
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field.Text
                      name="firstName"
                      label="First name"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FontAwesomeIcon icon={faUser} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field.Text
                      name="lastName"
                      label="Last name"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FontAwesomeIcon icon={faUser} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Username */}
                  <Grid item xs={12} sm={6}>
                    <Field.Text
                      name="username"
                      label="Username"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">@</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Job */}
                  <Grid item xs={12} sm={6}>
                    <Field.Text
                      name="job"
                      label="Job / Role"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FontAwesomeIcon icon={faBriefcase} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Bio */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, mt: 1 }}>
                      About
                    </Typography>
                    <Field.Text
                      name="bio"
                      label="Bio"
                      multiline
                      rows={3}
                      placeholder="Tell the community a bit about yourself…"
                    />
                  </Grid>

                  {/* Contact */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, mt: 1 }}>
                      Contact
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field.Text
                      name="phoneNumber"
                      label="Phone number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FontAwesomeIcon icon={faPhone} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field.Text
                      name="location"
                      label="Location"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Read-only email notice */}
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <FontAwesomeIcon icon={faEnvelope} />
                      Email: <strong>{user?.email}</strong>&nbsp;— to change your email contact
                      support.
                    </Typography>
                  </Grid>
                </Grid>

                {/* Actions */}
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => router.push(PROFILE_PAGE)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    type="submit"
                    disabled={saving}
                  >
                    {saving ? 'Saving…' : 'Save changes'}
                  </Button>
                </Box>
              </Box>
            </FormProvider>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
