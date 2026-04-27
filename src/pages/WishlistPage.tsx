import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { toggleWishlist, clearWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import ProductCard from '../components/product/ProductCard';
import { toast } from 'react-toastify';

const WishlistPage = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((s) => s.wishlist);

  const moveAllToCart = () => {
    items.forEach((p) => dispatch(addToCart({ product: p })));
    dispatch(clearWishlist());
    toast.success(`${items.length} items moved to cart! 🛒`);
  };

  return (
    <div className="page-container">
      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>My Wishlist</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{items.length} saved item{items.length !== 1 ? 's' : ''}</p>
          </div>
          {items.length > 0 && (
            <button className="btn-accent" onClick={moveAllToCart}>
              <i className="bi bi-bag-check" /> Move All to Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="empty-state" style={{ paddingTop: '5rem' }}>
            <div className="empty-state-icon">❤️</div>
            <h5 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Your wishlist is empty</h5>
            <p style={{ color: 'var(--text-muted)' }}>Save items you love to your wishlist.</p>
          </div>
        ) : (
          <div className="row g-3">
            {items.map((product) => (
              <div key={product.id} className="col-6 col-md-4 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
