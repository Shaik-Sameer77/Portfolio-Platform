/**
 * comment-service.ts
 * Uses the shared `proxy` instance from proxy.ts which handles
 * AES encryption on requests and decryption on responses (ISENCRYPTED_PAYLOAD).
 * Auth is handled via HTTP-only cookies (withCredentials: true on proxy).
 */
import proxy from './proxy';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CommentUser {
  id: number;
  email: string;
  name: string | null;
  role: string;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  blogId: number;
  userId: number;
  parentId: number | null;
  user: CommentUser;
  replies: Comment[];
}

export interface AuthUser {
  userId: number;
  email: string;
  name: string | null;
  role: string;
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export async function registerUser(
  email: string,
  password: string,
  name: string,
): Promise<{ message: string }> {
  const res = await proxy.post('/auth/register', { email, password, name });
  return res.data;
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ access_token: string; user: AuthUser }> {
  const res = await proxy.post('/auth/login', { email, password });
  const raw = res.data;
  // Backend returns user.id — remap to AuthUser.userId
  return {
    access_token: raw.access_token,
    user: {
      userId: raw.user?.id ?? raw.user?.userId,
      email: raw.user?.email,
      name: raw.user?.name ?? null,
      role: raw.user?.role,
    },
  };
}

export async function logoutUser(): Promise<void> {
  await proxy.post('/auth/logout');
}

// ─── Comments API ─────────────────────────────────────────────────────────────

export async function fetchComments(blogId: number): Promise<Comment[]> {
  const res = await proxy.get(`/blog/${blogId}/comments`);
  return res.data;
}

export async function postComment(
  blogId: number,
  content: string,
  parentId?: number,
): Promise<Comment> {
  const res = await proxy.post(
    `/blog/${blogId}/comments`,
    { content, parentId: parentId ?? null },
  );
  return res.data;
}

export async function editComment(
  commentId: number,
  content: string,
): Promise<Comment> {
  const res = await proxy.patch(
    `/blog/comments/${commentId}`,
    { content },
  );
  return res.data;
}

export async function deleteComment(commentId: number): Promise<void> {
  await proxy.delete(`/blog/comments/${commentId}`);
}
