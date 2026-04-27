import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchProducts, fetchCategories } from '../redux/slices/productSlice';
import { setCategory } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import { SkeletonGrid } from '../components/product/ProductSkeleton';

const FEATURES = [
  { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $50' },
  { icon: '🔒', title: 'Secure Payment', desc: '100% protected transactions' },
  { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy' },
  { icon: '💬', title: '24/7 Support', desc: 'Always here to help' },
];

const HomePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { products, categories, loading, error } = useAppSelector((s) => s.products);
  const featured = products.slice(0, 4);

  useEffect(() => {
    if (products.length === 0) dispatch(fetchProducts());
    if (categories.length === 0) dispatch(fetchCategories());
  }, []);

  return (
    <div className="page-container">
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 animate-up">
              <p className="hero-eyebrow">New Collection 2025</p>
              <h1>Discover Products<br />You'll <em>Love</em></h1>
              <p className="mb-4">
                Explore thousands of curated products across every category — delivered straight to your door.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/products" className="btn-accent" style={{ padding: '0.8rem 2rem', fontSize: '0.95rem' }}>
                  <i className="bi bi-bag" /> Shop Now
                </Link>
                <button className="btn-outline-accent" style={{ padding: '0.8rem 2rem', fontSize: '0.95rem' }}
                  onClick={() => { dispatch(setCategory('sale')); navigate('/products'); }}>
                  View Sale
                </button>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: '2.5rem', marginTop: '2.5rem' }}>
                {[['10K+', 'Products'], ['50K+', 'Customers'], ['4.9★', 'Rating']].map(([val, label]) => (
                  <div key={label}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{val}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.5px' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-flex justify-content-end">
              <div style={{ position: 'relative', width: 420, height: 380 }}>
                <div style={{ position: 'absolute', width: 280, height: 280, background: 'var(--accent-light)', borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%', top: 0, right: 0 }} />
                <div style={{ position: 'absolute', bottom: 20, left: 20, background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Today's Best Deal</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700 }}>Up to 40% Off 🎉</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '2.5rem 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="row g-3">
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="col-6 col-md-3">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', padding: '1rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="section-gap">
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
              <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Shop by Category</h2>
              <Link to="/products" style={{ color: 'var(--accent)', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600 }}>
                View all <i className="bi bi-arrow-right" />
              </Link>
            </div>
            <div className="row g-3">
              {categories.map((cat) => (
                <div key={cat} className="col-6 col-md-3">
                  <button
                    className="w-100"
                    onClick={() => { dispatch(setCategory(cat)); navigate('/products'); }}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.5rem 1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'center',
                    }}
                    onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.background = 'var(--accent-light)'; }}
                    onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)'; }}
                  >
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--accent)' }}>{cat}</div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="section-gap" style={{ background: 'var(--bg-secondary)', padding: '3rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Featured Products</h2>
            <Link to="/products" style={{ color: 'var(--accent)', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600 }}>
              Browse all <i className="bi bi-arrow-right" />
            </Link>
          </div>

          {loading ? (
            <SkeletonGrid count={4} />
          ) : error ? (
            <div className="empty-state">
              <div className="empty-state-icon">⚠️</div>
              <p style={{ color: 'var(--text-muted)' }}>{error}</p>
            </div>
          ) : (
            <div className="row g-3">
              {featured.map((product) => (
                <div key={product.id} className="col-6 col-md-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '1rem' }}>
            Ready to Start Shopping?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.05rem' }}>
            Join thousands of happy customers and find your perfect products today.
          </p>
          <Link to="/products" className="btn-accent" style={{ padding: '0.9rem 2.5rem', fontSize: '1rem' }}>
            <i className="bi bi-bag-heart" /> Shop the Collection
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
