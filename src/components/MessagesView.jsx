import React, { useState, useEffect, useRef } from 'react';

export default function MessagesView({
  messages,
  users,
  currentUser,
  onSendMessage,
  defaultPartnerUsername
}) {
  const [activePartnerUsername, setActivePartnerUsername] = useState(defaultPartnerUsername || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessageText, setChatMessageText] = useState('');
  const messagesEndRef = useRef(null);

  // Sync state if defaultPartnerUsername changes
  useEffect(() => {
    if (defaultPartnerUsername) {
      setActivePartnerUsername(defaultPartnerUsername);
    }
  }, [defaultPartnerUsername]);

  // Auto scroll to bottom of chat when messages change or partner changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activePartnerUsername]);


  const handleSend = (e) => {
    e.preventDefault();
    if (!chatMessageText.trim() || !activePartnerUsername) return;

    onSendMessage(activePartnerUsername, chatMessageText.trim());
    setChatMessageText('');
  };

  // Get list of users we have chatted with
  const getChattedPartners = () => {
    const partners = new Set();
    messages.forEach(msg => {
      if (msg.senderUsername === currentUser.username) {
        partners.add(msg.receiverUsername);
      } else if (msg.receiverUsername === currentUser.username) {
        partners.add(msg.senderUsername);
      }
    });

    return Array.from(partners).map(username => {
      const user = users.find(u => u.username === username);
      if (user) return user;
      // Fallback if user object not fully found
      return { username, name: username };
    });
  };

  // Filter users by search query
  const searchResults = searchQuery.trim() 
    ? users.filter(u => 
        u.id !== currentUser.id && 
        (u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
         u.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const chattedPartners = getChattedPartners();

  // Get active conversation messages
  const activeChatMessages = messages.filter(msg => 
    (msg.senderUsername === currentUser.username && msg.receiverUsername === activePartnerUsername) ||
    (msg.senderUsername === activePartnerUsername && msg.receiverUsername === currentUser.username)
  ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const activePartner = users.find(u => u.username === activePartnerUsername);

  // Helper to get last message for side panel preview
  const getLastMessage = (partnerUsername) => {
    const convo = messages.filter(msg => 
      (msg.senderUsername === currentUser.username && msg.receiverUsername === partnerUsername) ||
      (msg.senderUsername === partnerUsername && msg.receiverUsername === currentUser.username)
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (convo.length === 0) return null;
    const last = convo[0];
    const prefix = last.senderUsername === currentUser.username ? 'You: ' : '';
    return `${prefix}${last.content}`;
  };

  const handleSelectPartner = (username) => {
    setActivePartnerUsername(username);
    setSearchQuery('');
  };

  return (
    <div className="messages-page">
      {/* Sidebar - Chat List & Search */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h2>Direct Messages</h2>
          <div className="chat-search-container">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" style={{ marginRight: '8px' }}>
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              className="chat-search-input"
              placeholder="Search classmates by username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="chat-list">
          {/* Search Results Dropdown */}
          {searchQuery.trim() !== '' && (
            <div style={{ background: 'var(--bg-tertiary)', borderBottom: '2px solid var(--border-glass)' }}>
              <div style={{ padding: '8px 16px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                SEARCH RESULTS
              </div>
              {searchResults.length === 0 ? (
                <div style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  No users found matching "{searchQuery}"
                </div>
              ) : (
                searchResults.map(user => (
                  <div
                    key={user.id}
                    className="chat-list-item"
                    onClick={() => handleSelectPartner(user.username)}
                    style={{ background: 'rgba(139, 92, 246, 0.08)' }}
                  >
                    <div className="avatar" style={{ background: 'var(--gradient-purple)' }}>{user.name[0]}</div>
                    <div className="chat-list-meta">
                      <span className="chat-list-title">{user.name}</span>
                      <span className="chat-list-subtitle">@{user.username}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Active Chats History */}
          <div style={{ padding: '12px 24px 6px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
            CONVERSATIONS
          </div>
          
          {chattedPartners.length === 0 ? (
            <div style={{ padding: '24px', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.4' }}>
              No active chats.<br/>Search a classmate above to start messaging!
            </div>
          ) : (
            chattedPartners.map(partner => (
              <div
                key={partner.username}
                className={`chat-list-item ${activePartnerUsername === partner.username ? 'active' : ''}`}
                onClick={() => handleSelectPartner(partner.username)}
              >
                <div className="avatar">{partner.name ? partner.name[0] : partner.username[0]}</div>
                <div className="chat-list-meta">
                  <span className="chat-list-title">{partner.name || partner.username}</span>
                  <span className="chat-list-subtitle">
                    {getLastMessage(partner.username) || `@${partner.username}`}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right side - Message Thread View */}
      {activePartnerUsername ? (
        <div className="chat-pane">
          {/* Header */}
          <div className="chat-pane-header">
            <div className="avatar">{activePartner ? activePartner.name[0] : activePartnerUsername[0]}</div>
            <div className="user-info">
              <span className="user-name" style={{ fontSize: '1rem' }}>
                {activePartner ? activePartner.name : activePartnerUsername}
              </span>
              <span className="user-username">@{activePartnerUsername}</span>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="chat-messages-scroller">
            {activeChatMessages.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto' }}>
                <p>This is the start of your message history with @{activePartnerUsername}.</p>
                <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>Say hello!</p>
              </div>
            )}
            
            {activeChatMessages.map((msg) => {
              const isSentByMe = msg.senderUsername === currentUser.username;
              return (
                <div 
                  key={msg.id} 
                  className={`message-bubble-wrapper ${isSentByMe ? 'sent' : 'received'}`}
                >
                  <div className="message-bubble">
                    <div>{msg.content}</div>
                    <div className="message-time">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="chat-input-area">
            <form onSubmit={handleSend} className="chat-form">
              <input
                type="text"
                className="chat-input"
                placeholder={`Message @${activePartnerUsername}...`}
                value={chatMessageText}
                onChange={(e) => setChatMessageText(e.target.value)}
                autoFocus
              />
              <button type="submit" className="chat-send-btn">Send</button>
            </form>
          </div>
        </div>
      ) : (
        <div className="chat-pane-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
          <h3>Your Messages</h3>
          <p>Send private messages, doubts, or notes directly to classmate.</p>
        </div>
      )}
    </div>
  );
}
