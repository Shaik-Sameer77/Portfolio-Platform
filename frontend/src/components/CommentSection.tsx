'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchComments,
  postComment,
  editComment,
  deleteComment,
  type Comment,
  type AuthUser,
} from '@/services/comment-service';
import { useAuthStore } from '@/store/useAuthStore';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string | null | undefined, email: string): string {
  if (name && name.trim()) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  return email.slice(0, 2).toUpperCase();
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Authentication keys managed by global auth store

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ user }: { user: { name: string | null; email: string; role: string } }) {
  const initials = getInitials(user.name, user.email);
  const isAdmin = user.role === 'ADMIN';
  return (
    <div
      className={`h-9 w-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white ${
        isAdmin
          ? 'bg-gradient-to-br from-violet-500 to-purple-700 shadow-lg shadow-purple-500/30'
          : 'bg-gradient-to-br from-zinc-600 to-zinc-800'
      }`}
    >
      {initials}
    </div>
  );
}

function CommentInput({
  onSubmit,
  placeholder = 'Write a comment…',
  initialValue = '',
  submitLabel = 'Post',
  onCancel,
}: {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
  initialValue?: string;
  submitLabel?: string;
  onCancel?: () => void;
}) {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    setLoading(true);
    try {
      await onSubmit(value.trim());
      setValue('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="w-full resize-none rounded-xl border border-border bg-surface-2/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all min-h-[72px]"
      />
      <div className="flex items-center gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90 disabled:opacity-40 transition-all duration-150 shadow-sm shadow-primary/20"
        >
          {loading ? 'Posting…' : submitLabel}
        </button>
      </div>
    </form>
  );
}

function CommentNode({
  comment,
  depth,
  currentUser,
  token,
  onReply,
  onEdit,
  onDelete,
}: {
  comment: Comment;
  depth: number;
  currentUser: AuthUser | null;
  token: string | null;
  onReply: (parentId: number, content: string) => Promise<void>;
  onEdit: (commentId: number, content: string) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
}) {
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = currentUser?.userId === comment.userId;
  const isAdmin = currentUser?.role === 'ADMIN';
  const canModify = isOwner || isAdmin;
  const isAdminComment = comment.user.role === 'ADMIN';

  return (
    <div className={`flex gap-3 ${depth > 0 ? 'mt-3' : 'mt-5'}`}>
      <div className="flex flex-col items-center gap-0">
        <Avatar user={comment.user} />
        {comment.replies?.length > 0 && (
          <div className="mt-2 w-px flex-1 bg-border/50" style={{ minHeight: 16 }} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-foreground">
            {comment.user.name || comment.user.email.split('@')[0]}
          </span>
          {isAdminComment && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
              ✦ Admin
            </span>
          )}
          <span className="text-xs text-muted-foreground">{timeAgo(comment.createdAt)}</span>
        </div>

        {/* Body */}
        {editing ? (
          <div className="mt-2">
            <CommentInput
              initialValue={comment.content}
              submitLabel="Save"
              onCancel={() => setEditing(false)}
              onSubmit={async (content) => {
                await onEdit(comment.id, content);
                setEditing(false);
              }}
            />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground/90 leading-relaxed">{comment.content}</p>
        )}

        {/* Actions */}
        {!editing && (
          <div className="mt-1.5 flex items-center gap-3">
            {token && (
              <button
                onClick={() => setReplying(!replying)}
                className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                {replying ? 'Cancel' : '↩ Reply'}
              </button>
            )}
            {canModify && (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (deleting) return;
                    if (!confirm('Delete this comment?')) return;
                    setDeleting(true);
                    await onDelete(comment.id);
                  }}
                  disabled={deleting}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors font-medium disabled:opacity-50"
                >
                  {deleting ? '…' : 'Delete'}
                </button>
              </>
            )}
          </div>
        )}

        {/* Reply box */}
        {replying && (
          <div className="mt-3">
            <CommentInput
              placeholder="Write a reply…"
              submitLabel="Reply"
              onCancel={() => setReplying(false)}
              onSubmit={async (content) => {
                await onReply(comment.id, content);
                setReplying(false);
              }}
            />
          </div>
        )}

        {/* Nested replies */}
        {comment.replies?.length > 0 && (
          <div className={`mt-2 ${depth < 4 ? 'pl-1' : ''}`}>
            {comment.replies.map((reply) => (
              <CommentNode
                key={reply.id}
                comment={reply}
                depth={depth + 1}
                currentUser={currentUser}
                token={token}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main CommentSection ──────────────────────────────────────────────────────

export default function CommentSection({ blogId }: { blogId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { token, user: currentUser, openModal } = useAuthStore();

  const loadComments = useCallback(async () => {
    try {
      const data = await fetchComments(blogId);
      setComments(Array.isArray(data) ? data : []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [blogId]);

  useEffect(() => { loadComments(); }, [loadComments]);

  const handlePost = async (content: string) => {
    if (!token) return;
    const newComment = await postComment(blogId, token, content);
    setComments((prev) => [{ ...newComment, replies: [] }, ...prev]);
  };

  const handleReply = async (parentId: number, content: string) => {
    if (!token) return;
    await postComment(blogId, token, content, parentId);
    await loadComments(); // re-fetch to rebuild tree
  };

  const handleEdit = async (commentId: number, content: string) => {
    if (!token) return;
    await editComment(commentId, token, content);
    await loadComments();
  };

  const handleDelete = async (commentId: number) => {
    if (!token) return;
    await deleteComment(commentId, token);
    await loadComments();
  };

  const totalCount = (list: Comment[]): number =>
    list.reduce((acc, c) => acc + 1 + totalCount(c.replies ?? []), 0);

  const count = totalCount(comments);

  return (
    <section className="mt-16 border-t border-border pt-12">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Discussion
          {count > 0 && (
            <span className="ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary/10 border border-primary/20 px-2 text-xs font-bold text-primary">
              {count}
            </span>
          )}
        </h2>
        {currentUser && (
          <div className="flex items-center gap-2">
            <Avatar user={currentUser} />
            <span className="text-sm text-muted-foreground hidden sm:block">
              {currentUser.name || currentUser.email.split('@')[0]}
            </span>
          </div>
        )}
      </div>

      {/* New comment input (authenticated) */}
      {currentUser && token && (
        <div className="rounded-2xl border border-border bg-surface/40 p-4 mb-8">
          <CommentInput
            placeholder="Share your thoughts…"
            onSubmit={handlePost}
          />
        </div>
      )}

      {/* Comment list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="h-9 w-9 rounded-full bg-surface-2 flex-shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 w-24 rounded bg-surface-2" />
                <div className="h-3 w-full rounded bg-surface-2" />
                <div className="h-3 w-3/4 rounded bg-surface-2" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface/20 py-12 text-center">
          <div className="text-3xl mb-3">💬</div>
          <p className="text-sm font-medium text-muted-foreground">No comments yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Be the first to start the discussion!</p>
        </div>
      ) : (
        <div className="divide-y divide-border/40">
          {comments.map((c) => (
            <CommentNode
              key={c.id}
              comment={c}
              depth={0}
              currentUser={currentUser}
              token={token}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Auth CTA for guests */}
      {!currentUser && (
        <div className="rounded-2xl border border-border bg-surface/30 backdrop-blur-sm p-6 text-center mt-8 animate-[fade-in_0.3s_ease-out]">
          <div className="text-3xl mb-3">💬</div>
          <h3 className="font-display text-base font-bold mb-1 text-foreground">
            Join the discussion
          </h3>
          <p className="text-xs text-muted-foreground mb-5 max-w-sm mx-auto">
            Share your thoughts and ideas on this post. Sign in or register to post comments.
          </p>
          <button
            onClick={() => openModal("login")}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-xs font-semibold text-white hover:bg-primary/95 transition-all duration-150 shadow-sm shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] cursor-pointer"
          >
            Sign In / Create Account
          </button>
        </div>
      )}
    </section>
  );
}
