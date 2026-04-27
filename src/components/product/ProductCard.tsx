import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { toggleWishlist } from '../../redux/slices/wishlistSlice';
import { formatPrice, truncate } from '../../utils';
import type { Product } from '../../types';
import { toast } from 'react-toastify';

interface Props { product: Product; }

const StarRating = ({ rate }: { rate: number }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      <span className="rating-stars">
        {[1,2,3,4,5].map(i => (
          <i key={i} className={`bi bi-star${i <= Math.round(rate) ? '-fill' : i - 0.5 <= rate ? '-half' : ''}`} />
        ))}
      </span>
      <span className="rating-text">{rate.toFixed(1)}</span>
    </div>
  );
};

const ProductCard: React.FC<Props> = ({ product }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const wishItems = useAppSelector((s) => s.wishlist.items);
  const isWished = wishItems.some((i) => i.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addToCart({ product }));
    toast.success(`Added to cart! 🛒`, { autoClose: 2000 });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleWishlist(product));
    toast(isWished ? 'Removed from wishlist' : 'Added to wishlist ❤️', { autoClose: 1500 });
  };

  return (
    <div className="product-card animate-scale" onClick={() => navigate(`/products/${product.id}`)} style={{ cursor: 'pointer' }}>
      {/* Wishlist btn */}
      <button className={`wish-btn ${isWished ? 'active' : ''}`} onClick={handleWishlist}>
        <i className={`bi bi-heart${isWished ? '-fill' : ''}`} />
      </button>

      {/* Image */}
      <div className="card-img-wrap">
        <img src={product.image} alt={product.title} loading="lazy" />
      </div>

      {/* Body */}
      <div className="card-body">
        <div className="card-category">{product.category}</div>
        <p className="card-title">{truncate(product.title, 55)}</p>
        <StarRating rate={product.rating.rate} />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({product.rating.count} reviews)</span>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
          <span className="card-price">{formatPrice(product.price)}</span>
          <button className="btn-accent" style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem' }} onClick={handleAddToCart}>
            <i className="bi bi-bag-plus" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export { StarRating };
export default ProductCard;
