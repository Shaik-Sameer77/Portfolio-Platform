/**
 * Extracts a user-friendly error message from API response errors.
 * Handles NestJS validation error arrays, string messages, and fallback defaults.
 */
export function getErrorMessage(err: any, fallback = "An unexpected error occurred."): string {
  if (!err) return fallback;

  const serverMsg = err.response?.data?.message ?? err.message;

  if (Array.isArray(serverMsg)) {
    return serverMsg.filter(Boolean).join(" • ");
  }

  if (typeof serverMsg === "string" && serverMsg.trim()) {
    return serverMsg;
  }

  if (typeof err.response?.data === "string" && err.response.data.trim()) {
    return err.response.data;
  }

  return fallback;
}
