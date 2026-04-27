import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { closeCart, removeFromCart, updateQuantity, selectCartTotal, selectCartCount } from '../../redux/slices/cartSlice';
import { formatPrice, truncate } from '../../utils';
import type { CartItem } from '../../types';

const CartDrawer = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, isOpen } = useAppSelector((s) => s.cart);
  const { user } = useAppSelector((s) => s.auth);
  const total = selectCartTotal(items);
  const count = selectCartCount(items);

  if (!isOpen) return null;

  const handleCheckout = () => {
    dispatch(closeCart());
    if (!user) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <>
      <div className="cart-overlay" onClick={() => dispatch(closeCart())} />
      <div className="cart-drawer">
        {/* Header */}
        <div className="cart-drawer-header">
          <div>
            <h5 style={{ fontFamily: 'var(--font-display)', margin: 0, color: 'var(--text-primary)' }}>
              Your Cart
            </h5>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{count} item{count !== 1 ? 's' : ''}</span>
          </div>
          <button
            onClick={() => dispatch(closeCart())}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '1.3rem', padding: '0.25rem' }}
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {/* Body */}
        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="empty-state animate-up">
              <div className="empty-state-icon">🛍️</div>
              <h6 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Your cart is empty</h6>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Discover products and add them to your cart.
              </p>
              <button className="btn-accent" onClick={() => { dispatch(closeCart()); navigate('/products'); }}>
                Browse Products
              </button>
            </div>
          ) : (
            items.map((item: CartItem) => (
              <div key={item.id} className="cart-item animate-fade">
                <div className="cart-item-img">
                  <img src={item.image} alt={item.title} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.2rem', lineHeight: 1.4 }}>
                    {truncate(item.title, 45)}
                  </p>
                  <p style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
                    {formatPrice(item.price)}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="qty-control">
                      <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}>
                        <i className="bi bi-dash" />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}>
                        <i className="bi bi-plus" />
                      </button>
                    </div>
                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c', fontSize: '1rem', padding: '0.25rem' }}
                    >
                      <i className="bi bi-trash3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Subtotal</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>{formatPrice(total)}</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Taxes and shipping calculated at checkout
            </p>
            <button className="btn-accent w-100 justify-content-center" onClick={handleCheckout}>
              <i className="bi bi-arrow-right" />
              Checkout · {formatPrice(total)}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
