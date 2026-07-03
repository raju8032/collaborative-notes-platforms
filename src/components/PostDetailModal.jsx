import React, { useState, useRef, useEffect } from 'react';

export default function PostDetailModal({
  post,
  comments,
  currentUser,
  onClose,
  onAddComment,
  onToggleVerifyComment,
  onLikePost
}) {
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); // { commentId, username }
  const rightPaneRef = useRef(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (replyingTo) {
      // Add a reply
      onAddComment(post.id, commentText.trim(), replyingTo.commentId);
      setReplyingTo(null);
    } else {
      // Add a root comment
      onAddComment(post.id, commentText.trim());
    }
    setCommentText('');
  };

  const handleStartReply = (comment) => {
    setReplyingTo({
      commentId: comment.id,
      username: comment.authorUsername
    });
    // Put cursor in comment text input
    const input = document.getElementById('modal-comment-input');
    if (input) {
      input.focus();
    }
  };

  const isPostAuthor = currentUser.id === post.authorId;

  // Format content for codeblocks
  const formatContent = (text) => {
    if (!text) return '';
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        let language = '';
        let code = lines.join('\n');
        if (lines.length > 0 && /^[a-zA-Z0-9+#-]+$/.test(lines[0])) {
          language = lines[0];
          code = lines.slice(1).join('\n');
        }
        return (
          <pre key={index} style={{ position: 'relative' }}>
            {language && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '8px',
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                fontWeight: 'bold'
              }}>
                {language}
              </span>
            )}
            <code>{code}</code>
          </pre>
        );
      }
      
      const subParts = part.split(/(`[^`\n]+`)/g);
      return (
        <React.Fragment key={index}>
          {subParts.map((subPart, subIndex) => {
            if (subPart.startsWith('`') && subPart.endsWith('`')) {
              return <code key={subIndex}>{subPart.slice(1, -1)}</code>;
            }
            return subPart;
          })}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="post-detail-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Left Side: Post details */}
        <div className="modal-content-left">
          <div className="post-card-header" style={{ border: 'none', padding: 0, marginBottom: '20px' }}>
            <div className="post-author">
              <div className="avatar">{post.authorName[0]}</div>
              <div className="post-meta-details">
                <span className="post-author-name">{post.authorName}</span>
                <span className="post-classroom-tag">@{post.authorUsername} • {post.classroomName}</span>
              </div>
            </div>
            <button className="logout-btn" onClick={onClose} style={{ fontSize: '1.5rem', padding: 0 }}>
              &times;
            </button>
          </div>

          <div className="post-body" style={{ border: 'none', padding: 0, flexGrow: 1, overflowY: 'auto' }}>
            {formatContent(post.content)}
          </div>

          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px', marginTop: '16px' }}>
            <div className="post-actions-bar" style={{ padding: 0, marginBottom: '8px' }}>
              <button
                className={`post-action-btn ${post.likes.includes(currentUser.id) ? 'liked' : ''}`}
                onClick={() => onLikePost(post.id)}
                style={{ padding: 0 }}
              >
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <span style={{ fontWeight: '600' }}>{post.likes.length} Likes</span>
              </button>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Posted on {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Right Side: Doubts & Comments feed */}
        <div className="modal-content-right" ref={rightPaneRef}>
          <div className="comments-header">
            🤔 Doubts & Discussions ({comments.length})
          </div>

          <div className="comments-scroller">
            {comments.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
                <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>No doubts raised yet.</p>
                <p style={{ fontSize: '0.8rem' }}>Have a question? Type it below to ask the class.</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment-container">
                  {/* Root Comment */}
                  <div className="comment-card">
                    <div className="avatar" style={{ width: '28px', height: '28px', fontSize: '0.8rem' }}>
                      {comment.authorName[0]}
                    </div>
                    <div className="comment-main">
                      <div className="comment-author-bar">
                        <span className="comment-author">
                          {comment.authorName} <span style={{ color: 'var(--text-muted)', fontWeight: 'normal', fontSize: '0.75rem' }}>@{comment.authorUsername}</span>
                        </span>
                        
                        {comment.verified && (
                          <span className="verified-badge" title="Verified Answer by Teacher/Post Author">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Verified
                          </span>
                        )}
                      </div>
                      
                      <div className="comment-text">
                        {comment.content}
                      </div>

                      <div className="comment-actions">
                        <span>{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        
                        <button className="comment-action-btn" onClick={() => handleStartReply(comment)}>
                          Reply
                        </button>
                        
                        {/* Post Author verification control */}
                        {isPostAuthor && (
                          <button 
                            className="comment-action-btn" 
                            onClick={() => onToggleVerifyComment(comment.id)}
                            style={{ color: comment.verified ? 'var(--accent-pink)' : 'var(--accent-green)' }}
                          >
                            {comment.verified ? 'Unverify' : 'Verify Answer'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Comment Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="replies-list">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="reply-card">
                          <div className="avatar" style={{ width: '20px', height: '20px', fontSize: '0.7rem' }}>
                            {reply.authorName[0]}
                          </div>
                          <div className="comment-main">
                            <span className="comment-author" style={{ fontSize: '0.8rem' }}>
                              {reply.authorName} <span style={{ color: 'var(--text-muted)', fontWeight: 'normal', fontSize: '0.7rem' }}>@{reply.authorUsername}</span>
                            </span>
                            <div className="comment-text" style={{ fontSize: '0.85rem', marginTop: '2px' }}>
                              {reply.content}
                            </div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              ))
            )}
          </div>

          {/* Form to submit new comment/reply */}
          <div className="comments-input-area">
            {replyingTo && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '6px 12px',
                borderRadius: '8px',
                marginBottom: '8px',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)'
              }}>
                <span>Replying to <strong>@{replyingTo.username}</strong></span>
                <button className="logout-btn" onClick={() => setReplyingTo(null)}>&times;</button>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="comment-form">
              <input
                id="modal-comment-input"
                type="text"
                className="comment-input"
                placeholder={replyingTo ? "Write a reply..." : "Ask a doubt or reply to discussion..."}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                autoFocus
              />
              <button type="submit" className="comment-submit-btn">
                {replyingTo ? 'Reply' : 'Post'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
