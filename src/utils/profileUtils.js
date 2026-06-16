/** Normalize /api/users/my-profile (and similar) payloads to a single user object. */
export function normalizeProfileResponse(body) {
  if (!body) return null;
  if (body.user && (body.user.name || body.user.email)) return body.user;
  if (body.data && (body.data.name || body.data.email)) return body.data;
  if (body.name || body.email || body.role) return body;
  return null;
}
