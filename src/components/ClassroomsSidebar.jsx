import React, { useState } from 'react';

export default function ClassroomsSidebar({
  classrooms,
  activeClassroomId,
  setActiveClassroomId,
  onCreateClassroom,
  onJoinClassroom
}) {
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [className, setClassName] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  const handleJoin = (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    const success = onJoinClassroom(joinCode.trim().toUpperCase());
    if (success) {
      setJoinCode('');
      setShowJoinInput(false);
    } else {
      alert('Invalid class code or you are already in this classroom!');
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!className.trim()) return;
    onCreateClassroom(className.trim());
    setClassName('');
    setShowCreateInput(false);
  };

  const copyToClipboard = (code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="classrooms-panel">
      <div className="classrooms-header">
        <span>Classrooms</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="logout-btn" 
            title="Join Class"
            onClick={() => { setShowJoinInput(!showJoinInput); setShowCreateInput(false); }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5v14"/>
            </svg>
          </button>
        </div>
      </div>

      {showJoinInput && (
        <form onSubmit={handleJoin} className="username-setup" style={{ gap: '10px' }}>
          <input
            type="text"
            className="input-styled"
            placeholder="Enter Class Code (e.g. WEB301)"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            style={{ padding: '10px', fontSize: '0.85rem' }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn-primary" style={{ padding: '8px', fontSize: '0.8rem', flex: 1 }}>Join</button>
            <button type="button" className="classroom-btn-secondary" style={{ flex: 1 }} onClick={() => setShowJoinInput(false)}>Cancel</button>
          </div>
        </form>
      )}

      {showCreateInput || (
        <button 
          className="classroom-btn-secondary" 
          onClick={() => { setShowCreateInput(true); setShowJoinInput(false); }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Create Classroom
        </button>
      )}

      {showCreateInput && (
        <form onSubmit={handleCreate} className="username-setup" style={{ gap: '10px' }}>
          <input
            type="text"
            className="input-styled"
            placeholder="Classroom Name"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            style={{ padding: '10px', fontSize: '0.85rem' }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn-primary" style={{ padding: '8px', fontSize: '0.8rem', flex: 1 }}>Create</button>
            <button type="button" className="classroom-btn-secondary" style={{ flex: 1 }} onClick={() => setShowCreateInput(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="classrooms-list">
        <div 
          className={`classroom-card ${activeClassroomId === null ? 'active' : ''}`}
          onClick={() => setActiveClassroomId(null)}
        >
          <div className="classroom-name">🌎 All Classrooms</div>
        </div>

        {classrooms.map((cls) => (
          <div 
            key={cls.id}
            className={`classroom-card ${activeClassroomId === cls.id ? 'active' : ''}`}
            onClick={() => setActiveClassroomId(cls.id)}
          >
            <div>
              <div className="classroom-name">📚 {cls.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <span className="classroom-code-display">{cls.code}</span>
                <button 
                  className="logout-btn" 
                  onClick={(e) => copyToClipboard(cls.code, e)}
                  title="Copy Class Code"
                  style={{ padding: 0 }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                </button>
                {copiedCode === cls.code && <span style={{ fontSize: '0.65rem', color: 'var(--accent-green)' }}>Copied!</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
