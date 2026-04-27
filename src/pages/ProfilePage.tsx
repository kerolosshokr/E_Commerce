import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    dispatch(logout());
    toast.info('Signed out successfully');
    navigate('/login');
  };

  const initials = `${user.name?.firstname?.[0] || ''}${user.name?.lastname?.[0] || ''}`.toUpperCase();

  return (
    <div className="page-container">
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem', maxWidth: 700 }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>My Account</h1>

        {/* Avatar Card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
            {initials || '?'}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.3rem' }}>{user.name?.firstname} {user.name?.lastname}</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>@{user.username}</p>
            <span style={{ fontSize: '0.75rem', background: 'var(--accent-light)', color: 'var(--accent)', padding: '0.2rem 0.75rem', borderRadius: '99px', fontWeight: 600, marginTop: '0.5rem', display: 'inline-block' }}>
              Verified Customer
            </span>
          </div>
        </div>

        {/* Info */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h5 style={{ marginBottom: '1.25rem', fontWeight: 700 }}>Account Details</h5>
          {[
            ['Email', user.email, 'bi-envelope'],
            ['Phone', user.phone || 'Not set', 'bi-telephone'],
            ['Username', user.username, 'bi-person'],
          ].map(([label, value, icon]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
              <i className={`bi ${icon}`} style={{ color: 'var(--accent)', fontSize: '1rem', width: 20, textAlign: 'center' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn-ghost" onClick={() => navigate('/products')}>
            <i className="bi bi-bag" /> Browse Products
          </button>
          <button className="btn-ghost" onClick={() => navigate('/wishlist')}>
            <i className="bi bi-heart" /> My Wishlist
          </button>
          <button
            onClick={handleLogout}
            style={{ background: 'none', border: '1px solid #fee2e2', color: '#e74c3c', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s' }}
          >
            <i className="bi bi-box-arrow-right" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
