import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <div className="animate-scale">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(5rem, 15vw, 10rem)', fontWeight: 700, color: 'var(--border)', lineHeight: 1, marginBottom: '1rem' }}>404</div>
        <h2 style={{ marginBottom: '0.75rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: 400, margin: '0 auto 2rem' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-accent" onClick={() => navigate('/')}>
            <i className="bi bi-house" /> Go Home
          </button>
          <button className="btn-ghost" onClick={() => navigate('/products')}>
            <i className="bi bi-bag" /> Browse Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
