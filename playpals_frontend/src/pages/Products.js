import React, { useState, useEffect } from "react";
import "./Products.css";
import { useCart } from "../state/CartContext";

/**
 * Products page — responsive product listing grid, filters (sidebar/modal), API fetch,
 * product cards (image, name, price, add to cart, quick view), and filtering/sorting.
 *
 * Features:
 * - Responsive grid for product cards.
 * - Filters: Age, Category, Price, Brand (sidebar on desktop, modal on mobile).
 * - Sorting (by price, age, name, bestseller).
 * - "Add to Cart" and "Quick View" in the product card.
 * - Quick View modal for product details.
 * - Fetch product data from backend API with filtering/sorting parameters.
 */

// --- Utility: Responsive handling ---
function useMobileView(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

// --- Filter utils ---
const DEFAULT_FILTERS = {
  age: "",
  category: "",
  priceMin: "",
  priceMax: "",
  brand: "",
  sortBy: "bestseller",
  sortOrder: "desc",
};

// Example hardcoded filter options — in real build, fetch unique values from API
const AGE_GROUPS = [
  { value: 3, label: "3+" },
  { value: 4, label: "4+" },
  { value: 5, label: "5+" },
  { value: 6, label: "6+" },
  { value: 7, label: "7+" },
  { value: 8, label: "8+" },
  { value: 9, label: "9+" },
  { value: 10, label: "10+" },
];
const CATEGORIES = [
  "STEM Toys",
  "Creative Kits",
  "Board Games",
  "Puzzles",
  "Outdoor Fun",
  "Books"
];
const BRANDS = [
  "PlayWell",
  "BrightMinds",
  "HappyHands",
  "SmartKidz",
  "FunBox",
  "PuzzlePro"
];
const SORT_OPTIONS = [
  { value: "bestseller-desc", label: "Bestseller" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A-Z" },
  { value: "name-desc", label: "Name: Z-A" },
  { value: "age-asc", label: "Age: Low to High" },
  { value: "age-desc", label: "Age: High to Low" }
];

// --- Main Products Page ---
function Products() {
  const API_BASE = "http://localhost:3001"; // TODO: move to env

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [quickView, setQuickView] = useState(null); // Product for modal
  const [error, setError] = useState(null);

  const isMobile = useMobileView();

  // --- API Fetch ---
  useEffect(() => {
    setLoading(true);
    setError(null);
    // Build query string from filters
    const params = new URLSearchParams();
    if (filters.age) params.append("age", filters.age);
    if (filters.category) params.append("category", filters.category);
    if (filters.priceMin) params.append("priceMin", filters.priceMin);
    if (filters.priceMax) params.append("priceMax", filters.priceMax);
    if (filters.brand) params.append("brand", filters.brand);
    if (filters.sortBy) {
      if (filters.sortBy.includes("-")) {
        const [field, order] = filters.sortBy.split("-");
        params.append("sortBy", field);
        params.append("sortOrder", order);
      } else {
        params.append("sortBy", filters.sortBy);
        params.append("sortOrder", "desc");
      }
    }
    fetch(`${API_BASE}/products?${params.toString()}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch products.");
        return r.json();
      })
      .then((data) => setProducts(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [filters]);

  // Cart logic from context
  const { dispatch } = useCart();

  // --- Filter handlers ---
  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }
  function handleClearFilters() {
    setFilters(DEFAULT_FILTERS);
  }
  function handleSortChange(e) {
    setFilters((prev) => ({ ...prev, sortBy: e.target.value }));
  }

  // "Add to Cart" action
  function handleAddToCart(product) {
    dispatch({ type: "ADD_TO_CART", product, quantity: 1 });
  }

  // --- Rendering ---
  return (
    <section className="products-root">
      <h2 className="products-title">Browse Products</h2>
      <div className="products-controls">
        {isMobile ? (
          <button className="filter-modal-btn" onClick={() => setShowFilterModal(true)}>
            Filters & Sort
          </button>
        ) : (
          <FilterSidebar
            filters={filters}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
            onSortChange={handleSortChange}
          />
        )}
        {!isMobile && (
          <span style={{ flex: 1 }} />
        )}
        {!isMobile && (
          <select
            className="sort-select"
            value={filters.sortBy}
            onChange={handleSortChange}
            style={{ marginLeft: "auto", minWidth: 175 }}
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        )}
      </div>
      {isMobile && (
        <FilterModal
          open={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          filters={filters}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
          onSortChange={handleSortChange}
        />
      )}
      <div className="products-grid-wrapper">
        {loading ? (
          <div className="products-loading">Loading products…</div>
        ) : error ? (
          <div className="products-error">{error}</div>
        ) : products.length === 0 ? (
          <div className="products-empty">No products found.</div>
        ) : (
          <div className="products-grid">
            {products.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onAddToCart={() => handleAddToCart(prod)}
                onQuickView={() => setQuickView(prod)}
              />
            ))}
          </div>
        )}
      </div>
      {quickView && (
        <QuickViewModal product={quickView} onClose={() => setQuickView(null)} onAddToCart={() => { handleAddToCart(quickView); setQuickView(null); }} />
      )}
    </section>
  );
}

// --- Filter Sidebar for Desktop ---
function FilterSidebar({ filters, onChange, onClear, onSortChange }) {
  return (
    <aside className="filter-sidebar">
      <h3 className="filter-title">Filters</h3>
      <div className="filter-group">
        <label htmlFor="age-select">Age Range</label>
        <select id="age-select" name="age" value={filters.age} onChange={onChange}>
          <option value="">Any</option>
          {AGE_GROUPS.map((a) => (
            <option value={a.value} key={a.value}>{a.label}</option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label htmlFor="category-select">Category</label>
        <select id="category-select" name="category" value={filters.category} onChange={onChange}>
          <option value="">Any</option>
          {CATEGORIES.map((c) => (
            <option value={c} key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label>Price Range</label>
        <div style={{ display: "flex", gap: 6 }}>
          <input type="number" name="priceMin" placeholder="Min" value={filters.priceMin} onChange={onChange} style={{ width: 55 }} min="0" />
          <input type="number" name="priceMax" placeholder="Max" value={filters.priceMax} onChange={onChange} style={{ width: 55 }} min="0" />
        </div>
      </div>
      <div className="filter-group">
        <label htmlFor="brand-select">Brand</label>
        <select id="brand-select" name="brand" value={filters.brand} onChange={onChange}>
          <option value="">Any</option>
          {BRANDS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>
      <button onClick={onClear} className="clear-btn">Clear Filters</button>
      <h4 className="sort-title" style={{marginTop:18}}>Sort by</h4>
      <select value={filters.sortBy} onChange={onSortChange} className="sort-select">
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </aside>
  );
}

// --- Filter Modal for Mobile ---
function FilterModal({ open, onClose, filters, onChange, onClear, onSortChange }) {
  if (!open) return null;
  return (
    <div className="filter-modal-overlay" onClick={onClose}>
      <div className="filter-modal" onClick={e => e.stopPropagation()}>
        <h3 className="filter-title">Filter & Sort</h3>
        <div className="filter-group">
          <label htmlFor="mobile-age-select">Age Range</label>
          <select id="mobile-age-select" name="age" value={filters.age} onChange={onChange}>
            <option value="">Any</option>
            {AGE_GROUPS.map((a) => (
              <option value={a.value} key={a.value}>{a.label}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="mobile-category-select">Category</label>
          <select id="mobile-category-select" name="category" value={filters.category} onChange={onChange}>
            <option value="">Any</option>
            {CATEGORIES.map((c) => (
              <option value={c} key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Price Range</label>
          <div style={{ display: "flex", gap: 6 }}>
            <input type="number" name="priceMin" placeholder="Min" value={filters.priceMin} onChange={onChange} style={{ width: 56 }} min="0" />
            <input type="number" name="priceMax" placeholder="Max" value={filters.priceMax} onChange={onChange} style={{ width: 56 }} min="0" />
          </div>
        </div>
        <div className="filter-group">
          <label htmlFor="mobile-brand-select">Brand</label>
          <select id="mobile-brand-select" name="brand" value={filters.brand} onChange={onChange}>
            <option value="">Any</option>
            {BRANDS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <h4 className="sort-title" style={{marginTop:14}}>Sort by</h4>
        <select value={filters.sortBy} onChange={onSortChange} className="sort-select">
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="modal-actions">
          <button className="clear-btn" onClick={onClear}>Clear</button>
          <button className="apply-btn" onClick={onClose}>Apply</button>
        </div>
      </div>
    </div>
  );
}

// --- Product Card ---
function ProductCard({ product, onAddToCart, onQuickView }) {
  return (
    <div className="product-card" tabIndex={0} aria-label={product.name}>
      <div className="product-img-wrapper" onClick={onQuickView} role="button" tabIndex={0}>
        <img
          className="product-img"
          src={product.images?.[0] || "https://cdn.pixabay.com/photo/2013/07/13/12/10/toy-146162_1280.png"}
          alt={product.name}
          loading="lazy"
        />
        {product.bestseller && <span className="badge bestseller-badge">Bestseller</span>}
      </div>
      <div className="product-info">
        <span className="product-title">{product.name}</span>
        <span className="product-brand">{product.brand}</span>
        <span className="product-age">Ages {product.age}+</span>
        <span className="product-price">${product.price.toFixed(2)}</span>
      </div>
      <div className="product-card-actions">
        <button className="quick-view-btn" onClick={onQuickView}>👁 Quick View</button>
        <button className="add-cart-btn" onClick={onAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
}

// --- Quick View Modal ---
function QuickViewModal({ product, onClose, onAddToCart }) {
  if (!product) return null;
  return (
    <div className="quickview-modal-overlay" onClick={onClose}>
      <article className="quickview-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="close-modal-btn" onClick={onClose} aria-label="Close">✕</button>
        <div className="quickview-img-wrap">
          <img
            src={product.images?.[0] || "https://cdn.pixabay.com/photo/2013/07/13/12/10/toy-146162_1280.png"}
            alt={product.name}
            className="quickview-img"
            loading="lazy"
          />
        </div>
        <div className="quickview-info">
          <h3 className="quickview-title">{product.name}</h3>
          <span className="quickview-brand">{product.brand}</span>
          <span className="quickview-age">Ages {product.age}+</span>
          <span className="quickview-price">${product.price.toFixed(2)}</span>
          <div className="quickview-description">{product.description}</div>
          <button className="add-cart-btn large" onClick={onAddToCart}>Add to Cart</button>
        </div>
      </article>
    </div>
  );
}

export default Products;
