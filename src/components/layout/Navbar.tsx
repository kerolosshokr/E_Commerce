import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout } from '../../redux/slices/authSlice';
import { toggleCart } from '../../redux/slices/cartSlice';
import { selectCartCount } from '../../redux/slices/cartSlice';
import { useTheme } from '../../hooks/useTheme';
import { toast } from 'react-toastify';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const cartItems = useAppSelector((s) => s.cart.items);
  const wishCount = useAppSelector((s) => s.wishlist.items.length);
  const cartCount = selectCartCount(cartItems);

  const handleLogout = () => {
    dispatch(logout());
    toast.info('Signed out successfully');
    navigate('/login');
  };

  return (
    <nav className="sw-navbar">
      <div className="container h-100 d-flex align-items-center justify-content-between gap-3">
        {/* Brand */}
        <Link to="/" className="nav-brand flex-shrink-0">
          Shop<span>Wave</span>
        </Link>

        {/* Nav Links – desktop */}
        <div className="d-none d-md-flex align-items-center gap-1">
          <NavLink to="/" end className="nav-link">Home</NavLink>
          <NavLink to="/products" className="nav-link">Shop</NavLink>
          {user && <NavLink to="/wishlist" className="nav-link">Wishlist</NavLink>}
        </div>

        {/* Right controls */}
        <div className="d-flex align-items-center gap-1">
          {/* Theme toggle */}
          <button className="nav-icon-btn" onClick={toggleTheme} title="Toggle theme">
            <i className={`bi bi-${theme === 'light' ? 'moon' : 'sun'}`} />
          </button>

          {/* Wishlist */}
          {user && (
            <Link to="/wishlist" className="nav-icon-btn" style={{ textDecoration: 'none' }}>
              <i className="bi bi-heart" />
              {wishCount > 0 && <span className="cart-badge">{wishCount}</span>}
            </Link>
          )}

          {/* Cart */}
          <button className="nav-icon-btn" onClick={() => dispatch(toggleCart())}>
            <i className="bi bi-bag" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {/* Auth */}
          {user ? (
            <div className="dropdown">
              <button
                className="nav-icon-btn dropdown-toggle"
                data-bs-toggle="dropdown"
                style={{ fontSize: '0.85rem', paddingInline: '0.75rem', gap: '0.4rem', display: 'flex', alignItems: 'center' }}
              >
                <i className="bi bi-person-circle" style={{ fontSize: '1.1rem' }} />
                <span className="d-none d-md-inline">{user.name?.firstname}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <li><Link className="dropdown-item" to="/profile" style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>Profile</Link></li>
                <li><Link className="dropdown-item" to="/orders" style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>Orders</Link></li>
                <li><hr className="dropdown-divider" style={{ borderColor: 'var(--border)' }} /></li>
                <li><button className="dropdown-item" onClick={handleLogout} style={{ color: '#e74c3c', fontSize: '0.875rem' }}>Sign Out</button></li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="btn-accent" style={{ fontSize: '0.82rem', padding: '0.5rem 1.1rem' }}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
