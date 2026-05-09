import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { messagesApi, usersApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow, format } from 'date-fns';

function initials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

// ── Inbox ────────────────────────────────────────────────────────────────────
function Inbox() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    messagesApi.threads().then(setThreads).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><span className="spinner" /></div>;

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Messages</h2>
          <p>Your conversations with {user.role === 'tenant' ? 'the property team' : 'tenants'}</p>
        </div>
        {user.role === 'tenant' && (
          <button className="btn btn-primary" onClick={() => navigate('/messages/new')}>+ New Message</button>
        )}
      </div>
      <div className="page-body">
        <div className="card">
          {threads.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">💬</div>
              <h3>No conversations yet</h3>
              <p>Messages will appear here once you start a conversation.</p>
            </div>
          ) : (
            <div className="thread-list">
              {threads.map((msg) => (
                <div
                  key={msg.id}
                  className={`thread-item ${!msg.isRead && msg.senderId !== user.id ? 'unread' : ''}`}
                  onClick={() => navigate(`/messages/${msg.threadId}`)}
                >
                  <div className={`avatar ${msg.sender?.role !== 'tenant' ? 'admin' : ''}`}>
                    {initials(msg.sender?.fullName)}
                  </div>
                  <div className="thread-meta">
                    <div className="thread-from">{msg.sender?.fullName}</div>
                    <div className="thread-preview">{msg.body}</div>
                  </div>
                  <div className="thread-time">
                    {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Thread view ──────────────────────────────────────────────────────────────
function ThreadView() {
  const { threadId } = useParams();
  const { user, isAdmin } = useAuth();
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  const load = () =>
    messagesApi.thread(threadId).then(setMessages).finally(() => setLoading(false));

  useEffect(() => { load(); }, [threadId]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      const first = messages[0];
      const recipientId = user.id === first?.senderId ? first?.recipientId : first?.senderId;
      await messagesApi.send({ body: reply, threadId, recipientId: recipientId || undefined });
      setReply('');
      await load();
    } finally {
      setSending(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(); } };

  if (loading) return <div className="loading-center"><span className="spinner" /></div>;

  const other = messages.find(m => m.senderId !== user.id)?.sender;

  return (
    <>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/messages')}>← Back</button>
        <div>
          <h2 style={{ fontSize: '1.25rem' }}>
            {other ? `Conversation with ${other.fullName}` : 'Conversation'}
          </h2>
          <p>{messages.length} message{messages.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
      <div className="page-body">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)' }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            {messages.map((msg) => {
              const mine = msg.senderId === user.id;
              return (
                <div key={msg.id} className={`message-bubble-wrap ${mine ? 'mine' : ''}`}>
                  <div>
                    {!mine && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--ink-60)', marginBottom: 4, paddingLeft: 2 }}>
                        {msg.sender?.fullName}
                      </div>
                    )}
                    <div className={`bubble ${mine ? 'mine' : 'theirs'}`}>{msg.body}</div>
                    <div className="bubble-meta" style={{ textAlign: mine ? 'right' : 'left' }}>
                      {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Reply box — tenants always reply, admins (PM) reply, landlords view only */}
          {(user.role !== 'landlord') && (
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 12 }}>
              <textarea
                className="input"
                style={{ flex: 1, minHeight: 44, maxHeight: 120, resize: 'vertical' }}
                placeholder="Type a reply… (Enter to send)"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={handleKey}
              />
              <button className="btn btn-primary" onClick={sendReply} disabled={sending || !reply.trim()}>
                {sending ? <span className="spinner" /> : 'Send'}
              </button>
            </div>
          )}
          {user.role === 'landlord' && (
            <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--ink-60)', fontSize: '0.8rem' }}>
              Landlords can view messages but cannot reply.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── New message ──────────────────────────────────────────────────────────────
function NewMessage() {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [form, setForm] = useState({ body: '', recipientId: '' });
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!isAdmin) usersApi.admins().then(setAdmins);
    else usersApi.tenants().then(setTenants);
  }, [isAdmin]);

  const recipients = isAdmin ? tenants : admins;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      const msg = await messagesApi.send({
        body: form.body,
        recipientId: form.recipientId || undefined,
      });
      navigate(`/messages/${msg.threadId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <h2>New Message</h2>
        <p>Start a conversation with your {isAdmin ? 'tenants' : 'property team'}</p>
      </div>
      <div className="page-body">
        <div className="card" style={{ maxWidth: 600, padding: 28 }}>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={submit} className="form-grid">
            <div className="input-group">
              <label className="input-label">To</label>
              <select className="input" value={form.recipientId} onChange={(e) => setForm(f => ({ ...f, recipientId: e.target.value }))}>
                <option value="">— {isAdmin ? 'Select a tenant' : 'Any property manager (broadcast)'} —</option>
                {recipients.map(r => (
                  <option key={r.id} value={r.id}>{r.fullName} ({r.email})</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Message</label>
              <textarea
                className="input"
                style={{ minHeight: 120 }}
                placeholder="Write your message…"
                value={form.body}
                onChange={(e) => setForm(f => ({ ...f, body: e.target.value }))}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/messages')}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={sending}>
                {sending ? <span className="spinner" /> : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export { Inbox, ThreadView, NewMessage };
