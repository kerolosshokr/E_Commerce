import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchProducts, fetchCategories, setSearchQuery, setCategory, setSortOrder, setPage } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import { SkeletonGrid } from '../components/product/ProductSkeleton';

const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
];

const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const { products, filteredProducts, categories, loading, error, searchQuery, selectedCategory, sortOrder, currentPage, itemsPerPage } = useAppSelector((s) => s.products);

  useEffect(() => {
    if (products.length === 0) dispatch(fetchProducts());
    if (categories.length === 0) dispatch(fetchCategories());
  }, []);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginated = filteredProducts.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="page-container">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>

        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', marginBottom: '0.25rem' }}>All Products</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            {selectedCategory !== 'all' && ` in "${selectedCategory}"`}
          </p>
        </div>

        {/* Search & Sort */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ flex: '1 1 260px' }}>
            <i className="bi bi-search search-icon" />
            <input
              className="sw-input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            />
          </div>
          <select
            className="sw-input"
            style={{ flex: '0 0 200px' }}
            value={sortOrder}
            onChange={(e) => dispatch(setSortOrder(e.target.value as any))}
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Category chips */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.75rem' }}>
          <button
            className={`filter-chip ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => dispatch(setCategory('all'))}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => dispatch(setCategory(cat))}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <SkeletonGrid count={8} />
        ) : error ? (
          <div className="empty-state">
            <div className="empty-state-icon">⚠️</div>
            <h5 style={{ color: 'var(--text-primary)' }}>Failed to Load Products</h5>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
            <button className="btn-accent" onClick={() => dispatch(fetchProducts())}>
              <i className="bi bi-arrow-clockwise" /> Retry
            </button>
          </div>
        ) : paginated.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h5 style={{ color: 'var(--text-primary)' }}>No Products Found</h5>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Try adjusting your search or filters.
            </p>
            <button className="btn-ghost" onClick={() => { dispatch(setSearchQuery('')); dispatch(setCategory('all')); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="row g-3">
              {paginated.map((product) => (
                <div key={product.id} className="col-6 col-md-4 col-lg-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
                <button
                  className="pagination-btn"
                  onClick={() => dispatch(setPage(currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <i className="bi bi-chevron-left" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                    onClick={() => dispatch(setPage(page))}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="pagination-btn"
                  onClick={() => dispatch(setPage(currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <i className="bi bi-chevron-right" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
