/*Inline Use: You can also 
Data Tracking & Calculations
Profile views increased this week.
Track user clicks on buttons.
Chart renders data in real-time.
Dashboard displays profile completion rate.
Analytics show high mobile traffic.
Monitor total profile unique visitors.
JavaScript counts total active sessions.
CSS grid aligns analytics cards.
User retention rate dropped slightly.
Data logs update every minute.
Hover effects reveal specific metrics.
Track demographic data of visitors.
Export analytics data to CSV.
JavaScript filters data by date.
Bounce rate decreased by five percent.
CSS variables manage theme colors.
Display peak activity hours clearly.
Chart tooltips show precise values.
Monitor feature usage frequency details.
Track average session duration accurately.
Analytics dashboard loads very fast.
JavaScript calculates growth percentage automatically.
Flexbox centres the metric numbers.
Visualise profile growth trends easily.
Dark mode toggle works instantly.
Charts & Visual Display
JavaScript captures scroll depth metrics.
CSS transitions smooth out charts.
Render line charts using canvas.
Pie charts show device breakdown.
Track link clicks on profiles.
Bar charts compare monthly views.
JavaScript arrays store visitor counts.
Animate loading spinners with CSS.
Fetch analytics data from APIs.
Display total counts using counters.
Filter metrics by geographic region.
Responsive design fits all screens.
JavaScript handles dropdown filter changes.
Hide empty data states elegantly.
Track search queries leading here.
Highlight top performing profile posts.
CSS glow effects show updates.
Parse JSON data for metrics.
Update progress bars via JavaScript.
Style data tables using CSS.
Track social media referral traffic.
Identify most active user cohorts.
Map visitor locations on charts.
JavaScript sets dynamic element widths.
Skeleton loaders improve perceived speed.
User Interaction & Styling
Log custom events using JavaScript.
Style positive metrics in green.
Negative trends display in red.
Track profile edit button clicks.
Calculate conversion rates using scripts.
CSS masking highlights active data.
Store local view history safely.
Optimise database queries for speed.
JavaScript listens for window resizing.
Resize charts dynamically on desktop.
Animate metric milestones with CSS.
Show tooltips on icon hover.
Track outbound clicks from profile.
Sort visitor tables by date.
JavaScript checks authentication status first.
Style error states with borders.
Render smooth SVG path graphics.
Toggle dashboard layouts with CSS.
Track profile picture click counts.
Aggregate weekly data summaries cleanly.
JavaScript intervals refresh dashboard data.
Align metrics using typography scales.
Track follow button click triggers.
Display percentage changes with arrows.
CSS filters dim old data.
Performance & Dashboard UI
Compare current and past metrics.
JavaScript object holds profile data.
Format timestamps into readable dates.
Use sticky headers for tables.
Track form submission drop-off rates.
Highlight active navigation tabs visually.
JavaScript validates date range selections.
CSS clipping creates donut charts.
Track banner ad click metrics.
Measure API endpoint response times.
Render heatmaps of user clicks.
Truncate long names with CSS.
JavaScript loops through metric arrays.
Animate chart bars growing upward.
Track bio link click events.
Style metric cards with shadows.
Count total profile shares today.
JavaScript classes manage chart state.
Ensure high contrast for accessibility.
Track user scroll behavior accurately.
Display loading text during fetch.
CSS grids build modular dashboards.
Handle empty search results gracefully.
JavaScript triggers alert on milestones.
Clean analytics UI drives insight.
Would you like to extract a few of these concepts*/

import React, { useState } from 'react';

export default function FeedView({
  posts,
  classrooms,
  currentUser,
  onLikePost,
  onCreatePost,
  onOpenPostDetail,
  onAddComment
}) {
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedClassroomId, setSelectedClassroomId] = useState('');
  const [quickComments, setQuickComments] = useState({});

  // Formats text to support standard markdown code blocks and inline code
  const formatContent = (text) => {
    if (!text) return '';
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        // Check if there is a language label on the first line
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

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    
    // Default to first classroom if none selected
    const classroomId = selectedClassroomId || (classrooms[0] ? classrooms[0].id : '');
    if (!classroomId) {
      alert('Please join or create a classroom first!');
      return;
    }

    onCreatePost(newPostContent, classroomId);
    setNewPostContent('');
  };

  const handleQuickCommentSubmit = (e, postId) => {
    e.preventDefault();
    const text = quickComments[postId];
    if (!text || !text.trim()) return;

    onAddComment(postId, text.trim());
    setQuickComments(prev => ({ ...prev, [postId]: '' }));
  };

  const handleQuickCommentChange = (postId, value) => {
    setQuickComments(prev => ({ ...prev, [postId]: value }));
  };

  // Helper to format timestamps nicely like Instagram
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // ==========================================
// Note Analytics Helper Functions
// ==========================================

// Count total words in a note
const getWordCount = (text) => {
  if (!text) return 0;

  return text
    .replace(/```[\s\S]*?```/g, "")
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0).length;
};

// Count total characters
const getCharacterCount = (text) => {
  if (!text) return 0;

  return text.length;
};

// Estimate reading time
const getReadingTime = (text) => {
  const words = getWordCount(text);

  const minutes = Math.max(
    1,
    Math.ceil(words / 200)
  );

  return `${minutes} min read`;
};

// Count markdown code blocks
const getCodeBlockCount = (text) => {
  if (!text) return 0;

  const matches = text.match(/```/g);

  if (!matches) return 0;

  return matches.length / 2;
};

// Count inline code snippets
const getInlineCodeCount = (text) => {
  if (!text) return 0;

  const matches = text.match(/`[^`\n]+`/g);

  return matches ? matches.length : 0;
};

// Popular note badge
const isPopularPost = (post) => {
  return post.likes.length >= 5;
};

// Trending note badge
const isTrendingPost = (post) => {
  return (
    post.likes.length >= 3 &&
    (post.commentsCount || 0) >= 2
  );
};

// Long note detector
const isLongPost = (text) => {
  return getWordCount(text) > 120;
};

// Download note
const downloadNote = (post) => {

  const element = document.createElement("a");

  const file = new Blob(
    [post.content],
    { type: "text/plain" }
  );

  element.href = URL.createObjectURL(file);

  element.download =
    `${post.classroomName}_${post.id}.txt`;

  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);

};

// Copy note
const copyNote = (post) => {

  navigator.clipboard.writeText(post.content);

  alert("Note copied successfully!");

};

  return (
    <div className="feed-content">
      {/* Create Post Section */}
      {classrooms.length > 0 && (
        <div className="create-post-card">
          <form onSubmit={handleCreatePost}>
            <div className="create-post-header">
              <div className="avatar">{currentUser.name[0]}</div>
              <textarea
                className="create-post-input"
                placeholder="Share study notes, tips or links... (Supports code markup with ```code```)"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
            </div>
            <div className="create-post-footer">
              <select
                className="classroom-select"
                value={selectedClassroomId}
                onChange={(e) => setSelectedClassroomId(e.target.value)}
              >
                {classrooms.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    📚 {cls.name}
                  </option>
                ))}
              </select>
              <button type="submit" className="post-btn">Share Note</button>
            </div>
          </form>
        </div>
      )}

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="chat-pane-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          <h3>No Notes Shared Yet</h3>
          <p>Be the first to share notes or study guides in this classroom!</p>
        </div>
      ) : (
        posts.map((post) => {
          const isLiked = post.likes.includes(currentUser.id);
          const commentsCount = post.commentsCount || 0;
          return (
            <article key={post.id} className="post-card">
              {/* Header */}
              <div className="post-card-header">
                <div className="post-author">
                  <div className="avatar" style={{ textTransform: 'uppercase' }}>
                    {post.authorName[0]}
                  </div>
                  <div className="post-meta-details">
                    <span className="post-author-name">{post.authorName}</span>
                    <span className="post-classroom-tag">@{post.authorUsername} • {post.classroomName}</span>
                  </div>
                </div>
                <span className="post-time">{formatTimeAgo(post.createdAt)}</span>
              </div>

              {/* Body */}
              <div className="post-body">
                {formatContent(post.content)}
              </div>

              {/* Action Bar */}
              <div className="post-actions-bar">
                <button
                  className={`post-action-btn ${isLiked ? 'liked' : ''}`}
                  onClick={() => onLikePost(post.id)}
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  <span>{post.likes.length} Likes</span>
                </button>

                <button
                  className="post-action-btn"
                  onClick={() => onOpenPostDetail(post.id)}
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <span>{commentsCount} Doubts</span>
                </button>
              </div>

              {/* Info panel */}
              <div className="post-info-panel">
                {commentsCount > 0 ? (
                  <div 
                    className="doubts-preview-trigger"
                    onClick={() => onOpenPostDetail(post.id)}
                  >
                    View all {commentsCount} doubt{commentsCount > 1 ? 's' : ''}...
                  </div>
                ) : (
                  <div className="doubts-preview-trigger" style={{ cursor: 'default' }}>
                    No doubts raised yet.
                  </div>
                )}
              </div>

              {/* Quick Doubt/Comment Form */}
              <div className="comments-input-area" style={{ borderTop: '1px solid var(--border-glass)', padding: '10px 16px' }}>
                <form 
                  onSubmit={(e) => handleQuickCommentSubmit(e, post.id)} 
                  className="comment-form"
                >
                  <input
                    type="text"
                    className="comment-input"
                    placeholder="Ask a doubt or comment..."
                    value={quickComments[post.id] || ''}
                    onChange={(e) => handleQuickCommentChange(post.id, e.target.value)}
                  />
                  <button type="submit" className="comment-submit-btn">Post</button>
                </form>
              </div>
            </article>
          );
        })
      )}
    </div>
  );
}
