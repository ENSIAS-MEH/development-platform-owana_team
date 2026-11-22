/**
 * extractApiError
 *
 * The axios interceptor in axios.ts rejects with error.response.data directly,
 * so the thrown value is the backend JSON body, e.g.:
 *   { message: "Invalid email or password", status: 401, timestamp: "..." }
 *   { message: "Email already in use: x@y.com", status: 409, ... }
 *   { errors: { field: "msg" }, status: 400, ... }   ← validation errors
 *
 * This helper always returns a human-readable string from that object.
 * It never falls back to a generic message — it surfaces exactly what the
 * backend said so the user always gets specific, actionable feedback.
 */
export function extractApiError(error: any): string {
  if (!error) return 'An unexpected error occurred.';

  // Plain string (rare — only if interceptor falls through)
  if (typeof error === 'string') return error;

  // Validation error: { errors: { field: "msg", ... } }
  if (error.errors && typeof error.errors === 'object') {
    const messages = Object.values(error.errors) as string[];
    if (messages.length > 0) return messages.join(' ');
  }

  // Standard error body: { message: "..." }
  if (error.message && typeof error.message === 'string' && error.message.trim()) {
    return error.message.trim();
  }

  // Axios Error object that wasn't intercepted (e.g. network failure)
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.errors) {
    const messages = Object.values(error.response.data.errors) as string[];
    if (messages.length > 0) return messages.join(' ');
  }

  // Error instance (JS Error)
  if (error instanceof Error) return error.message;

  return 'An unexpected error occurred.';
}
