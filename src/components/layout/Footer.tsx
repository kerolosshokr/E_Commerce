import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', padding: '3rem 0 1.5rem', marginTop: '4rem' }}>
    <div className="container">
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.75rem' }}>
            Shop<span style={{ color: 'var(--text-primary)' }}>Wave</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            A modern e-commerce experience built with React, Redux Toolkit, and TypeScript.
          </p>
        </div>
        <div className="col-6 col-md-2">
          <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>Shop</div>
          {['Products', 'Categories', 'New Arrivals', 'Sale'].map(l => (
            <Link key={l} to="/products" style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '0.5rem' }}>{l}</Link>
          ))}
        </div>
        <div className="col-6 col-md-2">
          <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>Account</div>
          {['Sign In', 'Register', 'Orders', 'Wishlist'].map(l => (
            <Link key={l} to="/login" style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '0.5rem' }}>{l}</Link>
          ))}
        </div>
        <div className="col-md-4">
          <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>Stay Updated</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input className="sw-input" placeholder="your@email.com" style={{ flex: 1 }} />
            <button className="btn-accent">Subscribe</button>
          </div>
        </div>
      </div>
      <div className="divider" />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>© 2025 ShopWave. Built for portfolio demonstration.</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {['bi-twitter-x', 'bi-instagram', 'bi-github'].map(icon => (
            <a key={icon} href="#" style={{ color: 'var(--text-muted)', fontSize: '1rem', transition: 'color 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseOut={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
              <i className={`bi ${icon}`} />
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
