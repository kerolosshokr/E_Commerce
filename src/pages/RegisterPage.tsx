import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { registerUser, clearError } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { isValidEmail } from '../utils';

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useAppSelector((s) => s.auth);

  const [form, setForm] = useState({ firstname: '', lastname: '', email: '', username: '', password: '', confirm: '', phone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPass, setShowPass] = useState(false);

  useEffect(() => { if (token) navigate('/'); }, [token]);
  useEffect(() => {
    if (error) toast.error(error);
    return () => { dispatch(clearError()); };
  }, [error]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstname.trim()) e.firstname = 'First name required';
    if (!form.lastname.trim()) e.lastname = 'Last name required';
    if (!isValidEmail(form.email)) e.email = 'Valid email required';
    if (!form.username.trim() || form.username.length < 3) e.username = 'Username must be at least 3 characters';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(registerUser({
      email: form.email,
      username: form.username,
      password: form.password,
      name: { firstname: form.firstname, lastname: form.lastname },
      phone: form.phone,
    }))
      .unwrap()
      .then(() => { toast.success('Account created! Welcome to ShopWave 🎉'); navigate('/'); })
      .catch(() => {});
  };

  const Field = ({ id, label, type = 'text', placeholder, autoComplete }: { id: keyof typeof form; label: string; type?: string; placeholder: string; autoComplete?: string }) => (
    <div style={{ marginBottom: '1rem' }}>
      <label className="sw-label">{label}</label>
      {id === 'password' ? (
        <div style={{ position: 'relative' }}>
          <input className={`sw-input ${errors[id] ? 'error' : ''}`} type={showPass ? 'text' : 'password'}
            value={form[id]} onChange={(e) => setForm(f => ({ ...f, [id]: e.target.value }))}
            placeholder={placeholder} autoComplete={autoComplete} style={{ paddingRight: '2.8rem' }} />
          <button type="button" onClick={() => setShowPass(s => !s)}
            style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <i className={`bi bi-eye${showPass ? '-slash' : ''}`} />
          </button>
        </div>
      ) : (
        <input className={`sw-input ${errors[id] ? 'error' : ''}`} type={type}
          value={form[id]} onChange={(e) => setForm(f => ({ ...f, [id]: e.target.value }))}
          placeholder={placeholder} autoComplete={autoComplete} />
      )}
      {errors[id] && <p className="form-error">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: '2rem' }}>
      <div className="auth-card animate-scale" style={{ maxWidth: 520 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.5rem' }}>
            Shop<span style={{ color: 'var(--text-primary)' }}>Wave</span>
          </div>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '0.35rem' }}>Create Account</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Join thousands of happy shoppers</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3" style={{ marginBottom: 0 }}>
            <div className="col-6"><Field id="firstname" label="First Name" placeholder="John" /></div>
            <div className="col-6"><Field id="lastname" label="Last Name" placeholder="Doe" /></div>
          </div>
          <Field id="email" label="Email Address" type="email" placeholder="john@example.com" autoComplete="email" />
          <Field id="username" label="Username" placeholder="johndoe" autoComplete="username" />
          <Field id="phone" label="Phone (optional)" type="tel" placeholder="+1 234 567 8900" autoComplete="tel" />
          <Field id="password" label="Password" type="password" placeholder="Min. 6 characters" autoComplete="new-password" />
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="sw-label">Confirm Password</label>
            <input className={`sw-input ${errors.confirm ? 'error' : ''}`} type="password"
              value={form.confirm} onChange={(e) => setForm(f => ({ ...f, confirm: e.target.value }))}
              placeholder="Repeat password" autoComplete="new-password" />
            {errors.confirm && <p className="form-error">{errors.confirm}</p>}
          </div>

          <button type="submit" className="btn-accent w-100 justify-content-center" style={{ padding: '0.8rem', fontSize: '0.95rem' }} disabled={loading}>
            {loading ? <><span className="spinner-border spinner-border-sm me-2" />Creating account...</> : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
