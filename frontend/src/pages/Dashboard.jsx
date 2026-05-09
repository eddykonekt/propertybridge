import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { maintenanceApi, messagesApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status.replace('_', ' ')}</span>;
}

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [threads, setThreads] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      messagesApi.threads(),
      maintenanceApi.list(),
      isAdmin ? maintenanceApi.stats() : Promise.resolve(null),
    ])
      .then(([t, r, s]) => {
        setThreads(t.slice(0, 5));
        setRequests(r.slice(0, 5));
        setStats(s);
      })
      .finally(() => setLoading(false));
  }, [isAdmin]);

  if (loading) return <div className="loading-center"><span className="spinner" /></div>;

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  };

  return (
    <>
      <div className="page-header">
        <h2>{greeting()}, {user?.fullName?.split(' ')[0]}</h2>
        <p>Here's what's happening across your properties today.</p>
      </div>
      <div className="page-body">
        {isAdmin && stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Requests</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--rust)' }}>{stats.open}</div>
              <div className="stat-label">Open</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--sky)' }}>{stats.inProgress}</div>
              <div className="stat-label">In Progress</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--sage)' }}>{stats.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Recent messages */}
          <div className="card">
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1rem' }}>Recent Messages</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/messages')}>View all</button>
            </div>
            {threads.length === 0 ? (
              <div className="empty-state" style={{ padding: 40 }}>
                <div className="empty-state-icon">💬</div>
                <p>No messages yet</p>
              </div>
            ) : (
              threads.map((msg) => (
                <div key={msg.id} className="thread-item" onClick={() => navigate(`/messages/${msg.threadId}`)}>
                  <div className={`avatar ${msg.sender?.role !== 'tenant' ? 'admin' : ''}`}>
                    {(msg.sender?.fullName || 'U').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                  </div>
                  <div className="thread-meta">
                    <div className="thread-from">{msg.sender?.fullName || 'Unknown'}</div>
                    <div className="thread-preview">{msg.body}</div>
                  </div>
                  <div className="thread-time">{formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}</div>
                </div>
              ))
            )}
          </div>

          {/* Recent maintenance */}
          <div className="card">
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1rem' }}>Maintenance Requests</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/maintenance')}>View all</button>
            </div>
            {requests.length === 0 ? (
              <div className="empty-state" style={{ padding: 40 }}>
                <div className="empty-state-icon">🔧</div>
                <p>No requests yet</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <tbody>
                    {requests.map((r) => (
                      <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/maintenance/${r.id}`)}>
                        <td>
                          <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{r.title}</div>
                          {isAdmin && <div style={{ fontSize: '0.75rem', color: 'var(--ink-60)' }}>{r.tenant?.fullName}</div>}
                        </td>
                        <td><StatusBadge status={r.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
