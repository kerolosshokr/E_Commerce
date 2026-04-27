import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchProductById, clearSelectedProduct } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import { formatPrice } from '../utils';
import { StarRating } from '../components/product/ProductCard';
import { toast } from 'react-toastify';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedProduct: product, loading, error } = useAppSelector((s) => s.products);
  const wishItems = useAppSelector((s) => s.wishlist.items);
  const isWished = product ? wishItems.some((i) => i.id === product.id) : false;
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (id) dispatch(fetchProductById(Number(id)));
    return () => { dispatch(clearSelectedProduct()); };
  }, [id]);

  if (loading) return (
    <div className="page-container">
      <div className="container" style={{ paddingTop: '3rem' }}>
        <div className="row g-5">
          <div className="col-md-5">
            <div className="skeleton" style={{ height: 420, borderRadius: 'var(--radius-lg)' }} />
          </div>
          <div className="col-md-7" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '1rem' }}>
            <div className="skeleton" style={{ height: 14, width: '30%' }} />
            <div className="skeleton" style={{ height: 28, width: '85%' }} />
            <div className="skeleton" style={{ height: 20, width: '40%' }} />
            <div className="skeleton" style={{ height: 80, width: '100%' }} />
          </div>
        </div>
      </div>
    </div>
  );

  if (error || !product) return (
    <div className="page-container">
      <div className="empty-state" style={{ paddingTop: '6rem' }}>
        <div className="empty-state-icon">😕</div>
        <h5>Product Not Found</h5>
        <button className="btn-accent mt-3" onClick={() => navigate('/products')}>Back to Products</button>
      </div>
    </div>
  );

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: qty }));
    toast.success(`${qty}x added to cart! 🛒`);
  };

  return (
    <div className="page-container">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '2rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <span style={{ cursor: 'pointer', color: 'var(--accent)' }} onClick={() => navigate('/')}>Home</span>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <span style={{ cursor: 'pointer', color: 'var(--accent)' }} onClick={() => navigate('/products')}>Products</span>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <span style={{ textTransform: 'capitalize' }}>{product.category}</span>
        </nav>

        <div className="row g-5 align-items-start animate-fade">
          {/* Image */}
          <div className="col-md-5">
            <div className="product-detail-img">
              <img src={product.image} alt={product.title} />
            </div>
          </div>

          {/* Info */}
          <div className="col-md-7">
            <span className="tag" style={{ marginBottom: '1rem', display: 'inline-flex' }}>{product.category}</span>
            <h1 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.9rem)', lineHeight: 1.3, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              {product.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <StarRating rate={product.rating.rate} />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {product.rating.count} verified reviews
              </span>
            </div>

            <div className="price-badge" style={{ marginBottom: '1.5rem' }}>
              {formatPrice(product.price)}
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '2rem' }}>
              {product.description}
            </p>

            {/* Quantity */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="sw-label">Quantity</label>
              <div className="qty-control" style={{ display: 'inline-flex', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 40, height: 44 }}>
                  <i className="bi bi-dash" />
                </button>
                <span style={{ width: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: 40, height: 44 }}>
                  <i className="bi bi-plus" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn-accent" style={{ flex: '1 1 200px', padding: '0.85rem', justifyContent: 'center', fontSize: '0.95rem' }} onClick={handleAddToCart}>
                <i className="bi bi-bag-plus" /> Add to Cart · {formatPrice(product.price * qty)}
              </button>
              <button
                className={`btn-ghost ${isWished ? 'active' : ''}`}
                style={{ color: isWished ? '#e74c3c' : undefined, borderColor: isWished ? '#e74c3c' : undefined }}
                onClick={() => { dispatch(toggleWishlist(product)); toast(isWished ? 'Removed from wishlist' : 'Added to wishlist ❤️', { autoClose: 1500 }); }}
              >
                <i className={`bi bi-heart${isWished ? '-fill' : ''}`} />
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
              {[['bi-truck', 'Free Shipping'], ['bi-arrow-counterclockwise', 'Free Returns'], ['bi-shield-check', 'Secure Checkout']].map(([icon, label]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <i className={`bi ${icon}`} style={{ color: 'var(--accent)' }} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
