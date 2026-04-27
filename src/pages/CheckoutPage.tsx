import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { clearCart, selectCartTotal } from '../redux/slices/cartSlice';
import { formatPrice, truncate, generateOrderId, isValidEmail, isValidCard, formatCardNumber, formatExpiry } from '../utils';
import { toast } from 'react-toastify';
import type { ShippingInfo, PaymentInfo } from '../types';

// ─── Step Indicator ────────────────────────────────────────────────────────────
const STEPS = ['Shipping', 'Payment', 'Review'];

const StepIndicator = ({ current }: { current: number }) => (
  <div className="checkout-step-indicator">
    {STEPS.map((label, i) => (
      <div key={label} className={`step-item ${i < current ? 'completed' : i === current ? 'active' : ''}`}>
        <div className="step-circle">
          {i < current ? <i className="bi bi-check" /> : i + 1}
        </div>
        <span className="step-label">{label}</span>
      </div>
    ))}
  </div>
);

// ─── Step 1: Shipping ──────────────────────────────────────────────────────────
const ShippingStep = ({ onNext }: { onNext: (data: ShippingInfo) => void }) => {
  const { user } = useAppSelector((s) => s.auth);
  const [form, setForm] = useState<ShippingInfo>({
    firstName: user?.name?.firstname || '',
    lastName: user?.name?.lastname || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States',
  });
  const [errors, setErrors] = useState<Partial<ShippingInfo>>({});

  const validate = () => {
    const e: Partial<ShippingInfo> = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!isValidEmail(form.email)) e.email = 'Valid email required';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.zip.trim()) e.zip = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const F = ({ id, label, placeholder, half }: { id: keyof ShippingInfo; label: string; placeholder: string; half?: boolean }) => (
    <div className={half ? 'col-6' : 'col-12'} style={{ marginBottom: '0.1rem' }}>
      <label className="sw-label">{label}</label>
      <input className={`sw-input ${errors[id] ? 'error' : ''}`} value={form[id]}
        onChange={(e) => setForm(f => ({ ...f, [id]: e.target.value }))} placeholder={placeholder} />
      {errors[id] && <p className="form-error">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="animate-up">
      <h4 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>Shipping Information</h4>
      <div className="row g-3">
        <F id="firstName" label="First Name" placeholder="John" half />
        <F id="lastName" label="Last Name" placeholder="Doe" half />
        <F id="email" label="Email" placeholder="john@example.com" />
        <F id="phone" label="Phone" placeholder="+1 (555) 000-0000" />
        <F id="address" label="Address" placeholder="123 Main Street" />
        <F id="city" label="City" placeholder="New York" half />
        <F id="state" label="State" placeholder="NY" half />
        <F id="zip" label="ZIP Code" placeholder="10001" half />
        <F id="country" label="Country" placeholder="United States" half />
      </div>
      <div style={{ marginTop: '2rem' }}>
        <button className="btn-accent" style={{ padding: '0.8rem 2rem' }} onClick={() => { if (validate()) onNext(form); }}>
          Continue to Payment <i className="bi bi-arrow-right" />
        </button>
      </div>
    </div>
  );
};

// ─── Step 2: Payment ────────────────────────────────────────────────────────────
const PaymentStep = ({ onNext, onBack }: { onNext: (data: PaymentInfo) => void; onBack: () => void }) => {
  const [form, setForm] = useState<PaymentInfo>({ cardNumber: '4532015112830366', cardName: 'John Doe', expiry: '12/26', cvv: '123' });
  const [errors, setErrors] = useState<Partial<PaymentInfo>>({});

  const validate = () => {
    const e: Partial<PaymentInfo> = {};
    if (!isValidCard(form.cardNumber)) e.cardNumber = 'Enter a valid 16-digit card number';
    if (!form.cardName.trim()) e.cardName = 'Cardholder name required';
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) e.expiry = 'Format: MM/YY';
    if (!/^\d{3,4}$/.test(form.cvv)) e.cvv = '3 or 4 digits required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="animate-up">
      <h4 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>Payment Details</h4>

      <div style={{ background: 'var(--accent-light)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        <i className="bi bi-shield-lock" style={{ color: 'var(--accent)', marginRight: '0.4rem' }} />
        Your payment details are encrypted and secure. Demo card is pre-filled.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label className="sw-label">Card Number</label>
          <input className={`sw-input ${errors.cardNumber ? 'error' : ''}`}
            value={formatCardNumber(form.cardNumber)}
            onChange={(e) => setForm(f => ({ ...f, cardNumber: e.target.value.replace(/\s/g, '') }))}
            placeholder="1234 5678 9012 3456" maxLength={19} />
          {errors.cardNumber && <p className="form-error">{errors.cardNumber}</p>}
        </div>
        <div>
          <label className="sw-label">Cardholder Name</label>
          <input className={`sw-input ${errors.cardName ? 'error' : ''}`}
            value={form.cardName} onChange={(e) => setForm(f => ({ ...f, cardName: e.target.value }))}
            placeholder="Full name on card" />
          {errors.cardName && <p className="form-error">{errors.cardName}</p>}
        </div>
        <div className="row g-3">
          <div className="col-6">
            <label className="sw-label">Expiry Date</label>
            <input className={`sw-input ${errors.expiry ? 'error' : ''}`}
              value={form.expiry} onChange={(e) => setForm(f => ({ ...f, expiry: formatExpiry(e.target.value) }))}
              placeholder="MM/YY" maxLength={5} />
            {errors.expiry && <p className="form-error">{errors.expiry}</p>}
          </div>
          <div className="col-6">
            <label className="sw-label">CVV</label>
            <input className={`sw-input ${errors.cvv ? 'error' : ''}`}
              value={form.cvv} onChange={(e) => setForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
              placeholder="123" maxLength={4} type="password" />
            {errors.cvv && <p className="form-error">{errors.cvv}</p>}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button className="btn-ghost" onClick={onBack}><i className="bi bi-arrow-left" /> Back</button>
        <button className="btn-accent" style={{ padding: '0.8rem 2rem' }} onClick={() => { if (validate()) onNext(form); }}>
          Review Order <i className="bi bi-arrow-right" />
        </button>
      </div>
    </div>
  );
};

// ─── Step 3: Review ─────────────────────────────────────────────────────────────
const ReviewStep = ({ shipping, payment, onBack, onPlace }: {
  shipping: ShippingInfo; payment: PaymentInfo; onBack: () => void; onPlace: () => void;
}) => {
  const { items } = useAppSelector((s) => s.cart);
  const total = selectCartTotal(items);
  const shipping_cost = total >= 50 ? 0 : 5.99;
  const tax = total * 0.08;

  return (
    <div className="animate-up">
      <h4 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>Review Your Order</h4>

      <div className="row g-4">
        <div className="col-md-7">
          {/* Items */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1rem' }}>
            <h6 style={{ marginBottom: '1rem', fontWeight: 700 }}>Order Items ({items.length})</h6>
            {items.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>
                <img src={item.image} alt={item.title} style={{ width: 44, height: 44, objectFit: 'contain', background: 'var(--bg-secondary)', borderRadius: 6 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.82rem', fontWeight: 500, margin: 0, color: 'var(--text-primary)' }}>{truncate(item.title, 40)}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Qty: {item.quantity}</p>
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.875rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', flexShrink: 0 }}>
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Shipping Info summary */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1rem' }}>
            <h6 style={{ marginBottom: '0.75rem', fontWeight: 700 }}>Ship To</h6>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
              {shipping.firstName} {shipping.lastName}<br />
              {shipping.address}, {shipping.city}, {shipping.state} {shipping.zip}<br />
              {shipping.country}
            </p>
          </div>

          {/* Payment summary */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <h6 style={{ marginBottom: '0.75rem', fontWeight: 700 }}>Payment</h6>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="bi bi-credit-card" style={{ color: 'var(--accent)' }} />
              **** **** **** {payment.cardNumber.slice(-4)}
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-md-5">
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', position: 'sticky', top: 'calc(var(--navbar-h) + 1rem)' }}>
            <h6 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Order Summary</h6>
            {[
              ['Subtotal', formatPrice(total)],
              ['Shipping', shipping_cost === 0 ? 'FREE' : formatPrice(shipping_cost)],
              ['Tax (8%)', formatPrice(tax)],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                <span style={{ fontWeight: 600, color: val === 'FREE' ? '#10b981' : 'var(--text-primary)' }}>{val}</span>
              </div>
            ))}
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent)' }}>
                {formatPrice(total + shipping_cost + tax)}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button className="btn-accent w-100 justify-content-center" style={{ padding: '0.85rem', fontSize: '0.95rem' }} onClick={onPlace}>
                <i className="bi bi-bag-check" /> Place Order
              </button>
              <button className="btn-ghost w-100 justify-content-center" onClick={onBack}>
                <i className="bi bi-arrow-left" /> Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Success Screen ─────────────────────────────────────────────────────────────
const SuccessScreen = ({ orderId }: { orderId: string }) => {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem' }} className="animate-scale">
      <div className="success-icon"><i className="bi bi-check-lg" /></div>
      <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.75rem' }}>Order Placed!</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
        Thank you for your purchase. Your order has been confirmed.
      </p>
      <div style={{ display: 'inline-block', background: 'var(--accent-light)', padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-pill)', fontWeight: 700, color: 'var(--accent)', marginBottom: '2rem', fontSize: '0.875rem' }}>
        Order #{orderId}
      </div>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        A confirmation email will be sent shortly. Expected delivery: 3–5 business days.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn-accent" onClick={() => navigate('/products')}>
          <i className="bi bi-bag" /> Continue Shopping
        </button>
        <button className="btn-ghost" onClick={() => navigate('/')}>
          <i className="bi bi-house" /> Back to Home
        </button>
      </div>
    </div>
  );
};

// ─── Main Checkout Page ─────────────────────────────────────────────────────────
const CheckoutPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items } = useAppSelector((s) => s.cart);
  const total = selectCartTotal(items);
  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState<ShippingInfo | null>(null);
  const [payment, setPayment] = useState<PaymentInfo | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);

  if (items.length === 0 && !orderId) {
    return (
      <div className="page-container">
        <div className="empty-state" style={{ paddingTop: '6rem' }}>
          <div className="empty-state-icon">🛒</div>
          <h5>Your cart is empty</h5>
          <button className="btn-accent mt-3" onClick={() => navigate('/products')}>Start Shopping</button>
        </div>
      </div>
    );
  }

  const placeOrder = () => {
    setPlacing(true);
    setTimeout(() => {
      const id = generateOrderId();
      setOrderId(id);
      dispatch(clearCart());
      setStep(3);
      setPlacing(false);
      toast.success('Order placed successfully! 🎉');
    }, 1500);
  };

  return (
    <div className="page-container">
      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', maxWidth: 900 }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Checkout</h1>

        {step < 3 && <StepIndicator current={step} />}

        {step === 0 && <ShippingStep onNext={(d) => { setShipping(d); setStep(1); }} />}
        {step === 1 && <PaymentStep onNext={(d) => { setPayment(d); setStep(2); }} onBack={() => setStep(0)} />}
        {step === 2 && shipping && payment && (
          placing ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <div className="spinner-border" style={{ color: 'var(--accent)', width: 48, height: 48, borderWidth: 3 }} />
              <p style={{ marginTop: '1.25rem', color: 'var(--text-secondary)' }}>Processing your order...</p>
            </div>
          ) : (
            <ReviewStep shipping={shipping} payment={payment} onBack={() => setStep(1)} onPlace={placeOrder} />
          )
        )}
        {step === 3 && orderId && <SuccessScreen orderId={orderId} />}
      </div>
    </div>
  );
};

export default CheckoutPage;
