import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', fullName: '', role: 'tenant', phone: '' });
  const [error, setError] = useState('');
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">
          <h1>Property<span>bridge</span></h1>
          <p>Tenant Communication & Maintenance Portal</p>
        </div>

        <div className="tabs" style={{ marginBottom: 24 }}>
          <button className={`tab ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>Sign In</button>
          <button className={`tab ${mode === 'register' ? 'active' : ''}`} onClick={() => setMode('register')}>Create Account</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={submit} className="form-grid">
          {mode === 'register' && (
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input className="input" placeholder="John Ade" value={form.fullName} onChange={set('fullName')} required />
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Email</label>
            <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required minLength={6} />
          </div>

          {mode === 'register' && (
            <>
              <div className="input-group">
                <label className="input-label">Role</label>
                <select className="input" value={form.role} onChange={set('role')}>
                  <option value="tenant">Tenant</option>
                  <option value="property_manager">Property Manager</option>
                  <option value="landlord">Landlord</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Phone (optional)</label>
                <input className="input" placeholder="+234 800 000 0000" value={form.phone} onChange={set('phone')} />
              </div>
            </>
          )}

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: 4 }}>
            {loading ? <span className="spinner" /> : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {mode === 'login' && (
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--ink-60)', marginTop: 20 }}>
            Don't have an account? Register an account to get started
          </p>
        )}
      </div>
    </div>
  );
}
