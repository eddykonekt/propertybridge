import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { maintenanceApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const STATUS_OPTIONS = ['open', 'pending', 'in_progress', 'completed'];
const PRIORITY_OPTIONS = ['low', 'medium', 'high', 'urgent'];

function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status.replace('_', ' ')}</span>;
}

function PriorityBadge({ priority }) {
  const colors = { low: 'badge-completed', medium: 'badge-pending', high: 'badge-in_progress', urgent: 'badge-open' };
  return <span className={`badge ${colors[priority] || ''}`}>{priority}</span>;
}

// ── List ─────────────────────────────────────────────────────────────────────
function MaintenanceList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    maintenanceApi.list().then(setRequests).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><span className="spinner" /></div>;

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>{isAdmin ? 'All Maintenance Requests' : 'My Maintenance Requests'}</h2>
          <p>{requests.length} request{requests.length !== 1 ? 's' : ''} total</p>
        </div>
        {!isAdmin && (
          <button className="btn btn-primary" onClick={() => navigate('/maintenance/new')}>+ New Request</button>
        )}
      </div>
      <div className="page-body">
        <div className="card">
          {requests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔧</div>
              <h3>No maintenance requests</h3>
              <p>{isAdmin ? 'No requests have been submitted yet.' : 'Submit a request when something needs fixing.'}</p>
              {!isAdmin && (
                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/maintenance/new')}>
                  Submit a Request
                </button>
              )}
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    {isAdmin && <th>Tenant</th>}
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{r.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--ink-60)', marginTop: 2 }}>
                          {r.description.length > 60 ? r.description.slice(0, 60) + '…' : r.description}
                        </div>
                      </td>
                      {isAdmin && <td style={{ fontSize: '0.85rem' }}>{r.tenant?.fullName}</td>}
                      <td><PriorityBadge priority={r.priority} /></td>
                      <td><StatusBadge status={r.status} /></td>
                      <td style={{ color: 'var(--ink-60)', fontSize: '0.8rem' }}>
                        {format(new Date(r.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/maintenance/${r.id}`)}>
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Detail ────────────────────────────────────────────────────────────────────
function MaintenanceDetail() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateForm, setUpdateForm] = useState({ status: '', adminNote: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  const load = () => maintenanceApi.get(id).then((r) => {
    setRequest(r);
    setUpdateForm({ status: r.status, adminNote: r.adminNote || '' });
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await maintenanceApi.update(id, updateForm);
      setSuccess('Request updated successfully');
      await load();
      setTimeout(() => setSuccess(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-center"><span className="spinner" /></div>;
  if (!request) return <div className="page-body">Request not found.</div>;

  return (
    <>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/maintenance')}>← Back</button>
        <div>
          <h2 style={{ fontSize: '1.25rem' }}>{request.title}</h2>
          <p>Submitted {format(new Date(request.createdAt), 'MMMM d, yyyy')}</p>
        </div>
      </div>
      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1fr 340px' : '1fr', gap: 24 }}>
          {/* Main info */}
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <StatusBadge status={request.status} />
              <PriorityBadge priority={request.priority} />
            </div>

            <div className="input-group" style={{ marginBottom: 20 }}>
              <div className="input-label">Description</div>
              <div style={{ background: 'var(--cream)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {request.description}
              </div>
            </div>

            {isAdmin && request.tenant && (
              <div className="input-group" style={{ marginBottom: 20 }}>
                <div className="input-label">Submitted By</div>
                <div style={{ fontSize: '0.9rem' }}>
                  {request.tenant.fullName} — {request.tenant.email}
                </div>
              </div>
            )}

            {request.adminNote && (
              <div className="input-group">
                <div className="input-label">Admin Note</div>
                <div style={{ background: 'var(--amber-light)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', fontSize: '0.85rem', color: 'var(--amber)' }}>
                  {request.adminNote}
                </div>
              </div>
            )}

            {request.imageUrl && (
              <div style={{ marginTop: 20 }}>
                <div className="input-label" style={{ marginBottom: 8 }}>Attached Image</div>
                <img src={request.imageUrl} alt="Maintenance" style={{ maxWidth: '100%', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }} />
              </div>
            )}
          </div>

          {/* Admin update panel */}
          {isAdmin && (
            <div className="card" style={{ padding: 24, alignSelf: 'flex-start' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: 20 }}>Update Request</h3>
              {success && <div className="alert alert-success">{success}</div>}
              <form onSubmit={handleUpdate} className="form-grid">
                <div className="input-group">
                  <label className="input-label">Status</label>
                  <select
                    className="input"
                    value={updateForm.status}
                    onChange={(e) => setUpdateForm(f => ({ ...f, status: e.target.value }))}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Internal Note</label>
                  <textarea
                    className="input"
                    placeholder="Add a note for this request…"
                    value={updateForm.adminNote}
                    onChange={(e) => setUpdateForm(f => ({ ...f, adminNote: e.target.value }))}
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner" /> : 'Save Changes'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── New Request ───────────────────────────────────────────────────────────────
function NewMaintenanceRequest() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', imageUrl: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!payload.imageUrl) delete payload.imageUrl;
      await maintenanceApi.create(payload);
      navigate('/maintenance');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <h2>Submit Maintenance Request</h2>
        <p>Describe the issue and we'll get it sorted as soon as possible.</p>
      </div>
      <div className="page-body">
        <div className="card" style={{ maxWidth: 600, padding: 28 }}>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={submit} className="form-grid">
            <div className="input-group">
              <label className="input-label">Title *</label>
              <input className="input" placeholder="e.g. Broken kitchen tap" value={form.title} onChange={set('title')} required />
            </div>
            <div className="input-group">
              <label className="input-label">Description *</label>
              <textarea
                className="input"
                style={{ minHeight: 120 }}
                placeholder="Describe the problem in detail — when it started, how severe it is, etc."
                value={form.description}
                onChange={set('description')}
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">Priority</label>
              <select className="input" value={form.priority} onChange={set('priority')}>
                {PRIORITY_OPTIONS.map(p => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Image URL (optional)</label>
              <input className="input" placeholder="https://example.com/photo.jpg" value={form.imageUrl} onChange={set('imageUrl')} />
              <div style={{ fontSize: '0.75rem', color: 'var(--ink-60)', marginTop: 3 }}>
                Paste a direct link to a photo of the issue
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/maintenance')}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? <span className="spinner" /> : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export { MaintenanceList, MaintenanceDetail, NewMaintenanceRequest };
