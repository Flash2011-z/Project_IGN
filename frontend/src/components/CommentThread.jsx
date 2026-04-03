import { useMemo, useState } from "react";
import { getAvatarUrl } from "../utils/avatar";

function formatCommentDate(value) {
  if (!value) return "Just now";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isEdited(comment) {
  if (!comment?.updatedAt || !comment?.date) return false;

  const updatedAt = new Date(comment.updatedAt).getTime();
  const createdAt = new Date(comment.date).getTime();

  return Number.isFinite(updatedAt) && Number.isFinite(createdAt) && updatedAt - createdAt > 1500;
}

function statusToneClass(tone) {
  if (tone === "success") return "comment-thread__status comment-thread__status--success";
  if (tone === "error") return "comment-thread__status comment-thread__status--error";
  return "comment-thread__status";
}

function renderCommentAdminBadge(comment) {
  if (!comment?.isAdmin) return null;

  return (
    <span
      title="GameZone Admin"
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 8px 3px 5px",
        borderRadius: 999,
        overflow: "hidden",
        whiteSpace: "nowrap",
        fontSize: 8,
        fontWeight: 900,
        letterSpacing: "0.32px",
        textTransform: "uppercase",
        lineHeight: 1,
        color: "#ffe9c7",
        background:
          "linear-gradient(135deg, rgba(30,10,16,0.95), rgba(72,22,34,0.92) 44%, rgba(122,82,28,0.80) 100%)",
        border: "1px solid rgba(228,181,91,0.30)",
        boxShadow:
          "0 6px 14px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.07)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <span
        style={{
          width: 14,
          height: 14,
          minWidth: 14,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          fontSize: 7,
          fontWeight: 900,
          color: "#2b1403",
          background:
            "radial-gradient(circle at 30% 30%, #fff4d8, #efc878 46%, #c68b2e 74%, #74460f 100%)",
          border: "1px solid rgba(255,255,255,0.16)",
        }}
      >
        ♛
      </span>

      <span>Admin</span>
    </span>
  );
}

export default function CommentThread({
  review,
  comments = [],
  currentUser,
  loading = false,
  onCreateComment,
  onReplyComment,
  onEditComment,
  onDeleteComment,
  onLoveComment,
}) {
  const [draft, setDraft] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editingDraft, setEditingDraft] = useState("");
  const [busyKey, setBusyKey] = useState("");
  const [status, setStatus] = useState({ tone: "", text: "" });

  const currentUserId = Number(currentUser?.id || null);

  const thread = useMemo(() => {
    const topLevel = [];
    const repliesByParent = new Map();
    const items = Array.isArray(comments) ? comments.slice() : [];

    items.sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")));

    for (const comment of items) {
      const parentId = Number(comment.parentCommentId || 0);

      if (parentId > 0) {
        if (!repliesByParent.has(parentId)) {
          repliesByParent.set(parentId, []);
        }

        repliesByParent.get(parentId).push(comment);
        continue;
      }

      topLevel.push(comment);
    }

    topLevel.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));

    for (const replyList of repliesByParent.values()) {
      replyList.sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")));
    }

    return { topLevel, repliesByParent };
  }, [comments]);

  async function submitNewComment(event) {
    event.preventDefault();

    const trimmed = String(draft || "").trim();

    if (!currentUserId) {
      setStatus({ tone: "error", text: "Login to join the discussion." });
      return;
    }

    if (trimmed.length < 3) {
      setStatus({ tone: "error", text: "Write at least 3 characters." });
      return;
    }

    try {
      setBusyKey("create");
      setStatus({ tone: "", text: "" });
      await onCreateComment(review.id, trimmed);
      setDraft("");
      setStatus({ tone: "success", text: "Comment posted." });
    } catch (err) {
      setStatus({ tone: "error", text: err.message || "Failed to post comment." });
    } finally {
      setBusyKey("");
    }
  }

  async function submitReply(parentComment) {
    const replyText = String(replyDrafts[parentComment.id] || "").trim();

    if (!currentUserId) {
      setStatus({ tone: "error", text: "Login to reply." });
      return;
    }

    if (replyText.length < 3) {
      setStatus({ tone: "error", text: "Write at least 3 characters." });
      return;
    }

    try {
      setBusyKey(`reply-${parentComment.id}`);
      setStatus({ tone: "", text: "" });
      await onReplyComment(parentComment.id, replyText);
      setReplyDrafts((prev) => ({ ...prev, [parentComment.id]: "" }));
      setReplyingTo(null);
      setStatus({ tone: "success", text: "Reply posted." });
    } catch (err) {
      setStatus({ tone: "error", text: err.message || "Failed to post reply." });
    } finally {
      setBusyKey("");
    }
  }

  function beginEdit(comment) {
    setEditingId(comment.id);
    setEditingDraft(String(comment.text || ""));
    setStatus({ tone: "", text: "" });
  }

  async function saveEdit(comment) {
    const trimmed = String(editingDraft || "").trim();

    if (trimmed.length < 3) {
      setStatus({ tone: "error", text: "Write at least 3 characters." });
      return;
    }

    try {
      setBusyKey(`edit-${comment.id}`);
      setStatus({ tone: "", text: "" });
      await onEditComment(comment.id, trimmed);
      setEditingId(null);
      setEditingDraft("");
      setStatus({ tone: "success", text: "Comment updated." });
    } catch (err) {
      setStatus({ tone: "error", text: err.message || "Failed to update comment." });
    } finally {
      setBusyKey("");
    }
  }

  async function toggleLove(comment) {
    if (!currentUserId) {
      setStatus({ tone: "error", text: "Login to love comments." });
      return;
    }

    try {
      setBusyKey(`love-${comment.id}`);
      setStatus({ tone: "", text: "" });
      await onLoveComment(comment.id);
    } catch (err) {
      setStatus({ tone: "error", text: err.message || "Failed to update love." });
    } finally {
      setBusyKey("");
    }
  }

  async function deleteComment(comment) {
    const ok = window.confirm("Delete this comment? This cannot be undone.");

    if (!ok) return;

    try {
      setBusyKey(`delete-${comment.id}`);
      setStatus({ tone: "", text: "" });
      await onDeleteComment(comment.id);
      if (editingId === comment.id) {
        setEditingId(null);
        setEditingDraft("");
      }
      setStatus({ tone: "success", text: "Comment deleted." });
    } catch (err) {
      setStatus({ tone: "error", text: err.message || "Failed to delete comment." });
    } finally {
      setBusyKey("");
    }
  }

  function renderComment(comment, isReply = false) {
    const replies = thread.repliesByParent.get(comment.id) || [];
    const editing = editingId === comment.id;
    const loved = Boolean(comment.lovedByMe);
    const loveCount = Number(comment.loveCount || 0);
    const canEdit = currentUserId && Number(comment.userId) === currentUserId;
    const canReply = !isReply && currentUserId;
    const replyText = replyDrafts[comment.id] || "";

    return (
      <article key={comment.id} className={`comment-thread__item ${isReply ? "comment-thread__item--reply" : ""}`}>
        <div className="comment-thread__avatarShell">
          <img
            src={comment.avatar || getAvatarUrl(comment)}
            alt={comment.user}
            className="comment-thread__avatar"
          />
        </div>

        <div className="comment-thread__body">
          <div className="comment-thread__metaRow">
            <div>
              <div className="comment-thread__authorRow">
                <strong>{comment.user}</strong>
                {renderCommentAdminBadge(comment)}
                {isEdited(comment) ? <span className="comment-thread__edited">Edited</span> : null}
              </div>
              <div className="comment-thread__meta">{formatCommentDate(comment.date)}</div>
            </div>

            <div className="comment-thread__actions">
              <button
                type="button"
                className={`comment-thread__pill ${loved ? "comment-thread__pill--active" : ""}`}
                onClick={() => toggleLove(comment)}
                disabled={!currentUserId || busyKey === `love-${comment.id}`}
              >
                <span>{loved ? "♥" : "♡"}</span>
                <span>{loveCount}</span>
              </button>

              {canReply ? (
                <button
                  type="button"
                  className="comment-thread__link"
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  disabled={busyKey === `reply-${comment.id}`}
                >
                  Reply
                </button>
              ) : null}

              {canEdit ? (
                <>
                  <button
                    type="button"
                    className="comment-thread__link"
                    onClick={() => beginEdit(comment)}
                    disabled={busyKey === `edit-${comment.id}` || busyKey === `delete-${comment.id}`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="comment-thread__link comment-thread__link--danger"
                    onClick={() => deleteComment(comment)}
                    disabled={busyKey === `delete-${comment.id}`}
                  >
                    Delete
                  </button>
                </>
              ) : null}
            </div>
          </div>

          {editing ? (
            <div className="comment-thread__editor">
              <textarea
                className="input comment-thread__textarea"
                rows={3}
                value={editingDraft}
                onChange={(e) => setEditingDraft(e.target.value)}
                maxLength={500}
              />

              <div className="comment-thread__editorActions">
                <button
                  type="button"
                  className="btn primary sm"
                  onClick={() => saveEdit(comment)}
                  disabled={busyKey === `edit-${comment.id}`}
                >
                  Save
                </button>

                <button
                  type="button"
                  className="btn ghost sm"
                  onClick={() => {
                    setEditingId(null);
                    setEditingDraft("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="comment-thread__content">{comment.text}</p>
          )}

          {canReply && replyingTo === comment.id ? (
            <div className="comment-thread__replyBox">
              <textarea
                className="input comment-thread__textarea"
                rows={3}
                placeholder={`Reply to ${comment.user}`}
                value={replyText}
                onChange={(e) =>
                  setReplyDrafts((prev) => ({
                    ...prev,
                    [comment.id]: e.target.value,
                  }))
                }
                maxLength={500}
              />

              <div className="comment-thread__editorActions">
                <button
                  type="button"
                  className="btn primary sm"
                  onClick={() => submitReply(comment)}
                  disabled={busyKey === `reply-${comment.id}`}
                >
                  Send reply
                </button>

                <button
                  type="button"
                  className="btn ghost sm"
                  onClick={() => setReplyingTo(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}

          {replies.length > 0 ? (
            <div className="comment-thread__replies">
              {replies.map((reply) => renderComment(reply, true))}
            </div>
          ) : null}
        </div>
      </article>
    );
  }

  return (
    <section className="comment-thread glass">
      <div className="comment-thread__header">
        <div>
          <div className="comment-thread__eyebrow">Discussion</div>
          <h3 style={{ margin: "4px 0 0", fontWeight: 950 }}>Comments</h3>
        </div>

        <div className="comment-thread__count">{comments.length} comments</div>
      </div>

      {status.text ? <div className={statusToneClass(status.tone)}>{status.text}</div> : null}

      {loading && comments.length === 0 ? (
        <div className="comment-thread__empty comment-thread__empty--loading">
          <div className="comment-thread__skeleton" />
          <div className="comment-thread__skeleton comment-thread__skeleton--short" />
          <div className="comment-thread__skeleton" />
        </div>
      ) : thread.topLevel.length === 0 ? (
        <div className="comment-thread__empty">
          <div className="comment-thread__emptyTitle">No comments yet</div>
          <div className="comment-thread__emptyText">
            Start the discussion with a thoughtful take on this review.
          </div>
        </div>
      ) : (
        <div className="comment-thread__list">{thread.topLevel.map((comment) => renderComment(comment, false))}</div>
      )}

      <form className="comment-thread__composer" onSubmit={submitNewComment}>
        <div className="comment-thread__composerHeader">
          <div>
            <div className="comment-thread__eyebrow">Your take</div>
            <div style={{ fontWeight: 900, marginTop: 4 }}>Write a comment</div>
          </div>

          <div className="comment-thread__composerHint">
            {currentUserId ? "Press post to publish" : "Login required"}
          </div>
        </div>

        <textarea
          className="input comment-thread__textarea comment-thread__textarea--composer"
          rows={3}
          placeholder={currentUserId ? "Share a premium, constructive response..." : "Login to join the discussion"}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={!currentUserId}
          maxLength={500}
        />

        <div className="comment-thread__composerFooter">
          <div className="comment-thread__composerHint">
            Keep it respectful and specific. Replies stay inside this review.
          </div>

          <button type="submit" className="btn primary" disabled={!currentUserId || busyKey === "create"}>
            {busyKey === "create" ? "Posting..." : "Post comment"}
          </button>
        </div>
      </form>
    </section>
  );
}