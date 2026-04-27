import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { loginUser, clearError } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { isValidEmail } from '../utils';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, token } = useAppSelector((s) => s.auth);

  const from = (location.state as any)?.from?.pathname || '/';

  const [form, setForm] = useState({ username: 'mor_2314', password: '83r5^_' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (token) navigate(from, { replace: true });
  }, [token]);

  useEffect(() => {
    if (error) toast.error(error);
    return () => { dispatch(clearError()); };
  }, [error]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.username.trim()) e.username = 'Username is required';
    if (!form.password) e.password = 'Password is required';
    if (form.password && form.password.length < 4) e.password = 'Password must be at least 4 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(loginUser({ username: form.username, password: form.password }))
      .unwrap()
      .then(() => { toast.success('Welcome back! 👋'); navigate(from, { replace: true }); })
      .catch(() => {});
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-scale">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.5rem' }}>
            Shop<span style={{ color: 'var(--text-primary)' }}>Wave</span>
          </div>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '0.35rem' }}>Welcome Back</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Sign in to your account</p>
        </div>

        {/* Demo Hint */}
        <div style={{ background: 'var(--accent-light)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <i className="bi bi-info-circle" style={{ color: 'var(--accent)', marginRight: '0.4rem' }} />
          Demo credentials are pre-filled. Just click Sign In!
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label className="sw-label">Username</label>
            <input
              className={`sw-input ${errors.username ? 'error' : ''}`}
              value={form.username}
              onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
              placeholder="Enter username"
              autoComplete="username"
            />
            {errors.username && <p className="form-error">{errors.username}</p>}
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="sw-label">Password</label>
              <Link to="#" style={{ fontSize: '0.78rem', color: 'var(--accent)', textDecoration: 'none' }}>Forgot password?</Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                className={`sw-input ${errors.password ? 'error' : ''}`}
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Enter password"
                autoComplete="current-password"
                style={{ paddingRight: '2.8rem' }}
              />
              <button type="button" onClick={() => setShowPass(s => !s)}
                style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1rem' }}>
                <i className={`bi bi-eye${showPass ? '-slash' : ''}`} />
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <button type="submit" className="btn-accent w-100 justify-content-center" style={{ padding: '0.8rem', fontSize: '0.95rem' }} disabled={loading}>
            {loading ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</> : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
