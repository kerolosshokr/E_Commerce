const ProductSkeleton = () => (
  <div className="product-card">
    <div className="card-img-wrap">
      <div className="skeleton" style={{ width: 160, height: 160, borderRadius: 8 }} />
    </div>
    <div className="card-body">
      <div className="skeleton" style={{ height: 12, width: '50%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 14, width: '90%', marginBottom: 6 }} />
      <div className="skeleton" style={{ height: 14, width: '70%', marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 16 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeleton" style={{ height: 20, width: '30%' }} />
        <div className="skeleton" style={{ height: 34, width: 80, borderRadius: 6 }} />
      </div>
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 8 }: { count?: number }) => (
  <div className="row g-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="col-6 col-md-4 col-lg-3">
        <ProductSkeleton />
      </div>
    ))}
  </div>
);

export default ProductSkeleton;
