import React, { useState, useEffect } from 'react';
import ClassroomsSidebar from './components/ClassroomsSidebar';
import FeedView from './components/FeedView';
import PostDetailModal from './components/PostDetailModal';
import MessagesView from './components/MessagesView';

// Pre-seeded database initializers
const DEFAULT_USERS = [
  { id: 'usr_smith', name: 'Professor Smith', username: 'prof_smith', email: 'smith@gmail.com', avatarColor: '#8b5cf6' },
  { id: 'usr_sarah', name: 'Sarah Miller', username: 'sarah_dev', email: 'sarah@gmail.com', avatarColor: '#ec4899' },
  { id: 'usr_alex', name: 'Alex Rivera', username: 'alex_coder', email: 'alex@gmail.com', avatarColor: '#3b82f6' }
];

const DEFAULT_CLASSROOMS = [
  { id: 'cls_web', name: 'Advanced Web Development', code: 'WEB301', createdBy: 'usr_smith' },
  { id: 'cls_dsa', name: 'Algorithms & Data Structures', code: 'DSA101', createdBy: 'usr_smith' }
];

const DEFAULT_POSTS = [
  {
    id: 'post_1',
    classroomId: 'cls_web',
    classroomName: 'Advanced Web Development',
    content: `💡 **Understanding CSS Grid vs Flexbox**

Flexbox is designed for one-dimensional layouts (a row OR a column).
CSS Grid is designed for two-dimensional layouts (rows AND columns).

Here is a quick CSS Grid layout block for a responsive card layout:
\`\`\`css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
\`\`\`

Rule of thumb: Use CSS Grid for the general layout container, and Flexbox for aligning components inside cards or nav bars!`,
    authorId: 'usr_smith',
    authorName: 'Professor Smith',
    authorUsername: 'prof_smith',
    likes: ['usr_sarah', 'usr_alex'],
    commentsCount: 1,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString() // 3h ago
  },
  {
    id: 'post_2',
    classroomId: 'cls_dsa',
    classroomName: 'Algorithms & Data Structures',
    content: `⚡ **Binary Search Tree Time Complexities**

Here's a reference list for average vs worst-case operations in a Binary Search Tree (BST):

\`\`\`markdown
Operation   | Average Case | Worst Case (Skewed Tree)
------------|--------------|-------------------------
Search      | O(log n)     | O(n)
Insertion   | O(log n)     | O(n)
Deletion    | O(log n)     | O(n)
\`\`\`

Avoid worst-case scenarios by balancing your trees (e.g. self-balancing trees like AVL or Red-Black trees).`,
    authorId: 'usr_smith',
    authorName: 'Professor Smith',
    authorUsername: 'prof_smith',
    likes: ['usr_alex'],
    commentsCount: 1,
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString() // 6h ago
  }
];

const DEFAULT_COMMENTS = [
  {
    id: 'cmt_1',
    postId: 'post_1',
    content: 'When should we use auto-fit vs auto-fill in CSS grid? They seem very similar.',
    authorId: 'usr_sarah',
    authorName: 'Sarah Miller',
    authorUsername: 'sarah_dev',
    verified: true,
    createdAt: new Date(Date.now() - 3600000 * 2.5).toISOString(),
    replies: [
      {
        id: 'rep_1',
        content: 'Auto-fill leaves empty tracks if there is space available. Auto-fit will stretch the existing items to take up the space. Try resizing a grid container to see the difference!',
        authorId: 'usr_smith',
        authorName: 'Professor Smith',
        authorUsername: 'prof_smith',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ]
  },
  {
    id: 'cmt_2',
    postId: 'post_2',
    content: 'Wait, is deletion also O(log n) on average? How does successor selection affect height imbalance?',
    authorId: 'usr_alex',
    authorName: 'Alex Rivera',
    authorUsername: 'alex_coder',
    verified: false,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    replies: []
  }
];

const DEFAULT_MESSAGES = [];

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [messages, setMessages] = useState([]);
  
  // Navigation / UI states
  const [activeTab, setActiveTab] = useState('home'); // home, explore, messages, profile
  const [activeClassroomId, setActiveClassroomId] = useState(null);
  const [activePostId, setActivePostId] = useState(null);
  
  // Auth flow states
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [setupUser, setSetupUser] = useState(null); // { email, name } for new account setup
  const [setupUsername, setSetupUsername] = useState('');
  const [setupName, setSetupName] = useState('');
  
  // Explore page search states
  const [exploreSearchQuery, setExploreSearchQuery] = useState('');
  
  // Home Feed Search
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Initialize data on load
  useEffect(() => {
    if (!localStorage.getItem('instaclass_initialized')) {
      localStorage.setItem('instaclass_users', JSON.stringify(DEFAULT_USERS));
      localStorage.setItem('instaclass_classrooms', JSON.stringify(DEFAULT_CLASSROOMS));
      localStorage.setItem('instaclass_posts', JSON.stringify(DEFAULT_POSTS));
      localStorage.setItem('instaclass_comments', JSON.stringify(DEFAULT_COMMENTS));
      localStorage.setItem('instaclass_messages', JSON.stringify(DEFAULT_MESSAGES));
      localStorage.setItem('instaclass_initialized', 'true');
    }
    loadDataFromStorage();
  }, []);

  const loadDataFromStorage = () => {
    const storedUsers = JSON.parse(localStorage.getItem('instaclass_users') || '[]');
    const storedClassrooms = JSON.parse(localStorage.getItem('instaclass_classrooms') || '[]');
    const storedPosts = JSON.parse(localStorage.getItem('instaclass_posts') || '[]');
    const storedComments = JSON.parse(localStorage.getItem('instaclass_comments') || '[]');
    const storedMessages = JSON.parse(localStorage.getItem('instaclass_messages') || '[]');
    const storedCurrentUser = JSON.parse(localStorage.getItem('instaclass_current_user') || 'null');
    
    setUsers(storedUsers);
    setClassrooms(storedClassrooms);
    setPosts(storedPosts);
    setComments(storedComments);
    setMessages(storedMessages);
    if (storedCurrentUser) {
      setCurrentUser(storedCurrentUser);
    }
  };

  // 2. Synchronize tabs on external updates (DMs, comments, posts, joins)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key && e.key.startsWith('instaclass_')) {
        loadDataFromStorage();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Sync state modifications helper
  const updateStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
    // Trigger local state updates synchronously so current tab registers immediately
    loadDataFromStorage();
  };

  // Google sign in simulation flow
  const handleGoogleSignInClick = () => {
    setShowGoogleModal(true);
  };

  const selectMockGoogleAccount = (email, name) => {
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      // Existing user: log in immediately
      setCurrentUser(existingUser);
      localStorage.setItem('instaclass_current_user', JSON.stringify(existingUser));
      setShowGoogleModal(false);
      setCustomEmail('');
    } else {
      // New user: step into username setup screen
      setSetupUser({ email, name });
      setSetupName(name || '');
      setShowGoogleModal(false);
    }
  };

  const handleCustomEmailSubmit = (e) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    
    const email = customEmail.trim().toLowerCase();
    const mockName = email.split('@')[0].replace('.', ' ');
    // Capitalize name
    const capitalizeName = mockName.replace(/\b\w/g, c => c.toUpperCase());
    
    selectMockGoogleAccount(email, capitalizeName);
  };

  const handleSetupSubmit = (e) => {
    e.preventDefault();
    if (!setupUsername.trim() || !setupName.trim()) return;

    const cleanUsername = setupUsername.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (cleanUsername.length < 3) {
      alert('Username must be at least 3 alphanumeric characters or underscores!');
      return;
    }

    const usernameExists = users.some(u => u.username === cleanUsername);
    if (usernameExists) {
      alert('Username is already taken! Please choose another one.');
      return;
    }

    // Create user
    const newUser = {
      id: `usr_${Date.now()}`,
      name: setupName.trim(),
      username: cleanUsername,
      email: setupUser.email,
      avatarColor: ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'][Math.floor(Math.random() * 5)]
    };

    const updatedUsers = [...users, newUser];
    updateStorage('instaclass_users', updatedUsers);

    // Seed welcoming message from Professor Smith
    const welcomeMsg = {
      id: `msg_welcome_${Date.now()}`,
      senderUsername: 'prof_smith',
      receiverUsername: newUser.username,
      content: `Welcome to InstaClass, ${newUser.name}! 📚 This is your private inbox. You can search classmates' usernames to start private chats, share study notes in classrooms, and verify doubts. Have fun!`,
      createdAt: new Date().toISOString()
    };
    const updatedMessages = [...messages, welcomeMsg];
    updateStorage('instaclass_messages', updatedMessages);

    // Set logged-in user
    setCurrentUser(newUser);
    localStorage.setItem('instaclass_current_user', JSON.stringify(newUser));
    setSetupUser(null);
    setSetupUsername('');
    setSetupName('');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('instaclass_current_user');
    setActiveTab('home');
    setActiveClassroomId(null);
    setActivePostId(null);
  };

  // Classroom Management Actions
  const handleJoinClassroom = (code) => {
    const targetCode = code.toUpperCase();
    // Validate if code exists in general classrooms list
    const foundClass = classrooms.find(c => c.code === targetCode);
    if (!foundClass) return false;

    // Check if user has already joined (mocking active membership)
    // To make it persistent per-user, we could store classroom-user map.
    // For local prototype simplicity, the user instantly connects to all classes they create or join.
    // Let's create user-joined record mapping
    const joinedKey = `instaclass_joined_${currentUser.id}`;
    const joinedList = JSON.parse(localStorage.getItem(joinedKey) || '[]');
    if (joinedList.includes(foundClass.id)) return false;

    const newJoined = [...joinedList, foundClass.id];
    localStorage.setItem(joinedKey, JSON.stringify(newJoined));
    
    // Switch feed scope to the joined class
    setActiveClassroomId(foundClass.id);
    return true;
  };

  const handleCreateClassroom = (name) => {
    const uniqueId = `cls_${Date.now()}`;
    // Simple 6-char alphabetical code
    const randomCode = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X') + Math.floor(100 + Math.random() * 900);
    
    const newClass = {
      id: uniqueId,
      name,
      code: randomCode,
      createdBy: currentUser.id
    };

    const updatedClassrooms = [...classrooms, newClass];
    updateStorage('instaclass_classrooms', updatedClassrooms);

    // Join it automatically
    const joinedKey = `instaclass_joined_${currentUser.id}`;
    const joinedList = JSON.parse(localStorage.getItem(joinedKey) || '[]');
    localStorage.setItem(joinedKey, JSON.stringify([...joinedList, uniqueId]));
    
    setActiveClassroomId(uniqueId);
  };

  // Feed Actions
  const handleCreatePost = (content, classroomId) => {
    const cls = classrooms.find(c => c.id === classroomId);
    const newPost = {
      id: `post_${Date.now()}`,
      classroomId,
      classroomName: cls ? cls.name : 'Unknown Class',
      content,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorUsername: currentUser.username,
      likes: [],
      commentsCount: 0,
      createdAt: new Date().toISOString()
    };

    const updatedPosts = [newPost, ...posts];
    updateStorage('instaclass_posts', updatedPosts);
  };

  const handleLikePost = (postId) => {
    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        const hasLiked = p.likes.includes(currentUser.id);
        const newLikes = hasLiked
          ? p.likes.filter(id => id !== currentUser.id)
          : [...p.likes, currentUser.id];
        return { ...p, likes: newLikes };
      }
      return p;
    });
    updateStorage('instaclass_posts', updatedPosts);
  };

  // Doubts / Comments Actions
  const handleAddComment = (postId, text, parentCommentId = null) => {
    if (parentCommentId) {
      // Append reply to the nested comment replies array
      const updatedComments = comments.map(c => {
        if (c.id === parentCommentId) {
          const newReply = {
            id: `rep_${Date.now()}`,
            content: text,
            authorId: currentUser.id,
            authorName: currentUser.name,
            authorUsername: currentUser.username,
            createdAt: new Date().toISOString()
          };
          return { ...c, replies: [...(c.replies || []), newReply] };
        }
        return c;
      });
      updateStorage('instaclass_comments', updatedComments);
    } else {
      // Create new root comment/doubt
      const newComment = {
        id: `cmt_${Date.now()}`,
        postId,
        content: text,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorUsername: currentUser.username,
        verified: false,
        createdAt: new Date().toISOString(),
        replies: []
      };
      
      const updatedComments = [...comments, newComment];
      updateStorage('instaclass_comments', updatedComments);

      // Increment count on post
      const updatedPosts = posts.map(p => {
        if (p.id === postId) {
          return { ...p, commentsCount: (p.commentsCount || 0) + 1 };
        }
        return p;
      });
      updateStorage('instaclass_posts', updatedPosts);
    }
  };

  const handleToggleVerifyComment = (commentId) => {
    const updatedComments = comments.map(c => {
      if (c.id === commentId) {
        return { ...c, verified: !c.verified };
      }
      return c;
    });
    updateStorage('instaclass_comments', updatedComments);
  };

  // Direct Message Actions
  const handleSendMessage = (receiverUsername, content) => {
    const newMsg = {
      id: `msg_${Date.now()}`,
      senderUsername: currentUser.username,
      receiverUsername,
      content,
      createdAt: new Date().toISOString()
    };

    const updatedMessages = [...messages, newMsg];
    updateStorage('instaclass_messages', updatedMessages);
  };

  // Filters posts to only render either 'all joined/created' or the 'active classroom scope'
  /*const getFilteredPosts = () => {
    const joinedKey = `instaclass_joined_${currentUser?.id}`;
    const joinedList = JSON.parse(localStorage.getItem(joinedKey) || '[]');
    
    // Include IDs of classrooms the user created
    const createdClassIds = classrooms.filter(c => c.createdBy === currentUser?.id).map(c => c.id);
    const accessibleClassroomIds = Array.from(new Set([...joinedList, ...createdClassIds]));

    if (activeClassroomId) {
      return posts.filter(p => p.classroomId === activeClassroomId);
    }
    
    // Show posts belonging to classrooms joined/created or by Professor Smith (system defaults)
    return posts.filter(p => accessibleClassroomIds.includes(p.classroomId) || p.authorId === 'usr_smith');
  };*/
  const getFilteredPosts = () => {
  const joinedKey = `instaclass_joined_${currentUser?.id}`;
  const joinedList = JSON.parse(localStorage.getItem(joinedKey) || '[]');

  const createdClassIds = classrooms
    .filter(c => c.createdBy === currentUser?.id)
    .map(c => c.id);

  const accessibleClassroomIds = Array.from(
    new Set([...joinedList, ...createdClassIds])
  );

  let filtered = [];

  if (activeClassroomId) {
    filtered = posts.filter(
      p => p.classroomId === activeClassroomId
    );
  } else {
    filtered = posts.filter(
      p =>
        accessibleClassroomIds.includes(p.classroomId) ||
        p.authorId === 'usr_smith'
    );
  }

  // Search notes by content, classroom or author
  if (searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase();

    filtered = filtered.filter(post =>
      post.content.toLowerCase().includes(query) ||
      post.classroomName.toLowerCase().includes(query) ||
      post.authorName.toLowerCase().includes(query)
    );
  }

  return filtered;
};

  // Get active classrooms list of the user
  const getUserClassrooms = () => {
    const joinedKey = `instaclass_joined_${currentUser?.id}`;
    const joinedList = JSON.parse(localStorage.getItem(joinedKey) || '[]');
    return classrooms.filter(c => joinedList.includes(c.id) || c.createdBy === currentUser?.id || c.createdBy === 'usr_smith');
  };

  // Profile Stats
  const getUserOwnPosts = () => {
    return posts.filter(p => p.authorId === currentUser?.id);
  };

  // 3. Render Landing / Google Sign In Selection screen
  if (!currentUser) {
    if (setupUser) {
      return (
        <div className="auth-container">
          <div className="auth-card">
            <div className="logo-main">InstaClass</div>
            <p className="auth-subtitle">Finalize your profile details</p>
            <form onSubmit={handleSetupSubmit} className="username-setup">
              <div>
                <label>Full Name</label>
                <input
                  type="text"
                  required
                  className="input-styled"
                  style={{ width: '100%', marginTop: '6px' }}
                  placeholder="e.g. John Doe"
                  value={setupName}
                  onChange={(e) => setSetupName(e.target.value)}
                />
              </div>
              <div>
                <label>Choose a unique Username</label>
                <input
                  type="text"
                  required
                  className="input-styled"
                  style={{ width: '100%', marginTop: '6px' }}
                  placeholder="e.g. john_doe"
                  value={setupUsername}
                  onChange={(e) => setSetupUsername(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                Create Account
              </button>
              <button 
                type="button" 
                className="classroom-btn-secondary" 
                onClick={() => setSetupUser(null)}
              >
                Back to Sign In
              </button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="logo-main">InstaClass</div>
          <p className="auth-subtitle">Where Google Classroom meets Instagram</p>
          
          <button className="google-btn" onClick={handleGoogleSignInClick}>
            <svg className="google-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.86-4.53-5.84-4.53z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Sign in with Google
          </button>
          
          {showGoogleModal && (
            <div className="modal-overlay" onClick={() => setShowGoogleModal(false)}>
              <div className="auth-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '380px', padding: '30px' }}>
                <h3 style={{ marginBottom: '16px', fontFamily: 'var(--font-title)' }}>Choose a Google Account</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {DEFAULT_USERS.map(usr => (
                    <div 
                      key={usr.id} 
                      className="chat-list-item" 
                      onClick={() => selectMockGoogleAccount(usr.email, usr.name)}
                      style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '10px' }}
                    >
                      <div className="avatar" style={{ background: usr.avatarColor, width: '32px', height: '32px' }}>{usr.name[0]}</div>
                      <div className="chat-list-meta" style={{ textAlign: 'left' }}>
                        <span className="chat-list-title" style={{ fontSize: '0.85rem' }}>{usr.name}</span>
                        <span className="chat-list-subtitle" style={{ fontSize: '0.75rem' }}>{usr.email}</span>
                      </div>
                    </div>
                  ))}
                  
                  <div style={{ margin: '12px 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>OR SIGN IN WITH NEW EMAIL</div>
                  
                  <form onSubmit={handleCustomEmailSubmit} className="username-setup" style={{ gap: '8px' }}>
                    <input
                      type="email"
                      required
                      className="input-styled"
                      placeholder="name@gmail.com"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                    />
                    <button type="submit" className="btn-primary" style={{ padding: '8px' }}>Continue</button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 4. Render Main App once authenticated
  const filteredPosts = getFilteredPosts();
  const userClassrooms = getUserClassrooms();
  const activePost = posts.find(p => p.id === activePostId);
  const activePostComments = comments.filter(c => c.postId === activePostId);

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <nav className="navbar-sidebar">
        <div className="navbar-brand" onClick={() => { setActiveTab('home'); setActiveClassroomId(null); }}>
          InstaClass
        </div>
        
        <div className="nav-links">
          <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
            <svg viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Home Feed</span>
          </div>
          
          <div className={`nav-item ${activeTab === 'explore' ? 'active' : ''}`} onClick={() => setActiveTab('explore')}>
            <svg viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span>Class Directory</span>
          </div>
          
          <div className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>
            <svg viewBox="0 0 24 24">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            <span>Messages</span>
          </div>
          
          <div className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => { setActiveTab('profile'); setActiveClassroomId(null); }}>
            <svg viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Profile</span>
          </div>
        </div>

        {/* Navigation Footer containing User Profile detail */}
        <div className="nav-footer">
          <div className="user-badge" onClick={() => setActiveTab('profile')}>
            <div className="avatar" style={{ background: currentUser.avatarColor }}>
              {currentUser.name[0]}
            </div>
            <div className="user-info">
              <span className="user-name">{currentUser.name}</span>
              <span className="user-username">@{currentUser.username}</span>
            </div>
          </div>
          <button className="logout-btn" title="Log Out" onClick={handleLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Main Panel views */}
      <div className="main-wrapper">
        
        {activeTab === 'home' && (
          <>
            <div style={{ flexGrow: 1 }}>
              <div style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 16px 8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.6rem', fontWeight: 800 }}>
                  {activeClassroomId ? `📚 ${classrooms.find(c=>c.id===activeClassroomId)?.name}` : '🌎 My Note Stream'}
                </h2>
              </div>
              <FeedView
                posts={filteredPosts}
                classrooms={userClassrooms}
                currentUser={currentUser}
                onLikePost={handleLikePost}
                onCreatePost={handleCreatePost}
                onOpenPostDetail={setActivePostId}
                onAddComment={handleAddComment}
              />
            </div>
            <ClassroomsSidebar
              classrooms={userClassrooms}
              activeClassroomId={activeClassroomId}
              setActiveClassroomId={setActiveClassroomId}
              onCreateClassroom={handleCreateClassroom}
              onJoinClassroom={handleJoinClassroom}
            />
          </>
        )}

        {activeTab === 'explore' && (
          <div className="explore-page">
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>Classmates Directory</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>Search profiles or directly message any registered classmate below.</p>
            
            <div className="search-bar-wrapper">
              <div className="chat-search-container" style={{ padding: '10px 16px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" style={{ marginRight: '10px' }}>
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  className="chat-search-input"
                  placeholder="Search classmate by name or username..."
                  value={exploreSearchQuery}
                  onChange={(e) => setExploreSearchQuery(e.target.value)}
                  style={{ fontSize: '0.95rem' }}
                />
              </div>
            </div>

            <div className="results-grid">
              {users
                .filter(u => {
                  if (u.id === currentUser.id) return false;
                  if (!exploreSearchQuery.trim()) return true;
                  const query = exploreSearchQuery.toLowerCase();
                  return u.name.toLowerCase().includes(query) || u.username.toLowerCase().includes(query);
                })
                .map(user => (
                  <div key={user.id} className="user-search-card">
                    <div className="profile-avatar-large" style={{ background: user.avatarColor, width: '64px', height: '64px', fontSize: '1.6rem' }}>
                      {user.name[0]}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600' }}>{user.name}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>@{user.username}</p>
                    </div>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '0.85rem', width: '100%', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      onClick={() => {
                        setActiveTab('messages');
                        // Start conversation in DMs view
                        // MessagesView selects receiverUsername based on its internal state, we pass message hook
                        // To hook it up correctly, our child MessagesView uses activePartnerUsername.
                        // Let's pass query state, but to make it simple we start a chat by sending an empty/initial ping message.
                        // Let's open message tab and set active partner username using state
                        // We will trigger active partner set via simple localStorage trick or refactoring.
                        // Since we have messages state, we can write a quick message or we can pass partner selection.
                        // Let's make starting a chat super clean:
                        // We will store active DM partner username in localStorage and read it on tab switch!
                        localStorage.setItem('instaclass_active_dm_partner', user.username);
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      Message
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <MessagesView
            messages={messages}
            users={users}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            // Read clicked classmate if redirecting from Explore search directory
            defaultPartnerUsername={(() => {
              const p = localStorage.getItem('instaclass_active_dm_partner');
              if (p) {
                localStorage.removeItem('instaclass_active_dm_partner');
                return p;
              }
              return null;
            })()}
          />
        )}

        {activeTab === 'profile' && (
          <div className="profile-page">
            <div className="profile-header-card">
              <div className="profile-avatar-large" style={{ background: currentUser.avatarColor }}>
                {currentUser.name[0]}
              </div>
              <div style={{ flexGrow: 1 }}>
                <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.75rem', fontWeight: 800 }}>{currentUser.name}</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '2px', fontSize: '0.9rem' }}>@{currentUser.username}</p>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>📧 {currentUser.email}</div>
                
                <div className="profile-stats">
                  <div className="stat-item">
                    <span className="stat-num">{getUserOwnPosts().length}</span>
                    <span className="stat-label">Shared Notes</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-num">{userClassrooms.length}</span>
                    <span className="stat-label">Classrooms</span>
                  </div>
                </div>
              </div>
            </div>

            <h3 style={{ fontFamily: 'var(--font-title)', marginBottom: '20px', fontSize: '1.25rem' }}>My Note Contributions</h3>
            
            {getUserOwnPosts().length === 0 ? (
              <div className="chat-pane-empty" style={{ background: 'var(--bg-secondary)', borderRadius: '16px', padding: '32px' }}>
                <p>You haven't contributed any notes yet.</p>
                <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '8px', marginTop: '12px' }} onClick={() => setActiveTab('home')}>
                  Write A Note
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {getUserOwnPosts().map(post => (
                  <article key={post.id} className="post-card">
                    <div className="post-card-header">
                      <span className="post-classroom-tag">📚 {post.classroomName}</span>
                      <span className="post-time">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="post-body" style={{ maxHeight: '150px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}>
                      {post.content}
                    </div>
                    <div className="post-actions-bar" style={{ justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>❤️ {post.likes.length} Likes • 💬 {post.commentsCount || 0} Doubts</span>
                      <button className="classroom-btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => { setActivePostId(post.id); }}>
                        View Detail
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Lightbox / Post Detail Doubts overlay */}
      {activePostId && activePost && (
        <PostDetailModal
          post={activePost}
          comments={activePostComments}
          currentUser={currentUser}
          onClose={() => setActivePostId(null)}
          onAddComment={handleAddComment}
          onToggleVerifyComment={handleToggleVerifyComment}
          onLikePost={handleLikePost}
        />
      )}
    </div>
  );
}
