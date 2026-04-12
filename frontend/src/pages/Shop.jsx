import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [sneakers, setSneakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  // Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedBrands, setSelectedBrands] = useState(searchParams.get('brand')?.split(',') || []);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedSize, setSelectedSize] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get('/sneakers/brands').then(({ data }) => setBrands(data)).catch(() => {});
  }, []);

  const fetchSneakers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedBrands.length) params.set('brand', selectedBrands.join(','));
      if (priceRange[0] > 0) params.set('minPrice', priceRange[0]);
      if (priceRange[1] < 500) params.set('maxPrice', priceRange[1]);
      if (selectedSize) params.set('size', selectedSize);
      if (sortBy) params.set('sort', sortBy);
      params.set('page', page);

      const { data } = await api.get(`/sneakers?${params.toString()}`);
      setSneakers(data.sneakers);
      setTotalPages(data.pages);
    } catch {
      console.error('Failed to fetch sneakers');
    } finally {
      setLoading(false);
    }
  }, [page, priceRange, search, selectedBrands, selectedSize, sortBy]);

  useEffect(() => {
    fetchSneakers();
  }, [fetchSneakers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchSneakers();
  };

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedBrands([]);
    setPriceRange([0, 500]);
    setSelectedSize('');
    setSortBy('');
    setPage(1);
  };

  const sizes = [6, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13];

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1>All Sneakers</h1>
        <div className="shop-controls">
          <form className="search-bar" onSubmit={handleSearch}>
            <FiSearch />
            <input
              type="text"
              placeholder="Search sneakers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sort by</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="name">Name A-Z</option>
          </select>
          <button className="filter-toggle-btn" onClick={() => setFiltersOpen(!filtersOpen)}>
            <FiFilter /> Filters
          </button>
        </div>
      </div>

      <div className="shop-layout">
        {/* Sidebar Filters */}
        <aside className={`shop-filters ${filtersOpen ? 'open' : ''}`}>
          <div className="filters-header">
            <h3>Filters</h3>
            <button onClick={clearFilters} className="clear-filters">Clear All</button>
            <button className="close-filters" onClick={() => setFiltersOpen(false)}><FiX /></button>
          </div>

          <div className="filter-group">
            <h4>Brand</h4>
            <div className="filter-options">
              {brands.map(brand => (
                <label key={brand} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4>Price Range</h4>
            <div className="price-range">
              <input
                type="range"
                min="0"
                max="500"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              />
              <div className="price-labels">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>

          <div className="filter-group">
            <h4>Size</h4>
            <div className="size-grid">
              {sizes.map(size => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize == size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(selectedSize == size ? '' : size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="shop-products">
          {loading ? (
            <SkeletonLoader count={8} />
          ) : sneakers.length === 0 ? (
            <div className="no-results">
              <h3>No sneakers found</h3>
              <p>Try adjusting your filters</p>
              <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {sneakers.map(sneaker => (
                  <ProductCard key={sneaker._id} sneaker={sneaker} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="pagination">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
