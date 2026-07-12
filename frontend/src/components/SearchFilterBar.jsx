import { useEffect, useState } from 'react';
import './SearchFilterBar.css';

const EMPTY_FILTERS = { make: '', model: '', category: '', minPrice: '', maxPrice: '' };

// 350ms delay feels responsive without hammering the API on every keystroke.
const DEBOUNCE_MS = 350;

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="16.2" y1="16.2" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function SearchFilterBar({ onSearch }) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [panelOpen, setPanelOpen] = useState(false);
  const activeCount = Object.values(filters).filter(Boolean).length;
  const hasActiveFilters = activeCount > 0;

  const update = (field) => (e) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const clear = () => {
    setFilters(EMPTY_FILTERS);
    onSearch({});
  };

  useEffect(() => {
    const cleaned = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
    const timer = setTimeout(() => onSearch(cleaned), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [filters, onSearch]);

  return (
    <div className="filter-console">
      <div className="filter-console-heading">
        <h2>Find your next vehicle</h2>
        <p>Search by make, model, category, or price range.</p>
      </div>

      <button
        type="button"
        className="filter-console-toggle"
        onClick={() => setPanelOpen((v) => !v)}
        aria-expanded={panelOpen}
      >
        <SearchIcon />
        <span>Search &amp; filter</span>
        {hasActiveFilters && <span className="filter-count-badge">{activeCount}</span>}
        <span className={`filter-chevron ${panelOpen ? 'is-open' : ''}`} aria-hidden="true">⌄</span>
      </button>

      <div className={`filter-console-panel ${panelOpen ? 'is-open' : ''}`}>
        <div className="filter-panel-inner">
          <div className="filter-bar-inputs">
            <div className="filter-field">
              <label htmlFor="f-make">Make</label>
              <input id="f-make" placeholder="e.g. Toyota" value={filters.make} onChange={update('make')} />
            </div>
            <div className="filter-field">
              <label htmlFor="f-model">Model</label>
              <input id="f-model" placeholder="e.g. Camry" value={filters.model} onChange={update('model')} />
            </div>
            <div className="filter-field">
              <label htmlFor="f-category">Category</label>
              <input id="f-category" placeholder="Sedan, SUV…" value={filters.category} onChange={update('category')} />
            </div>
            <div className="filter-field filter-field--narrow">
              <label htmlFor="f-min">Min price</label>
              <input id="f-min" type="number" min="0" placeholder="₹0" value={filters.minPrice} onChange={update('minPrice')} />
            </div>
            <div className="filter-field filter-field--narrow">
              <label htmlFor="f-max">Max price</label>
              <input id="f-max" type="number" min="0" placeholder="Any" value={filters.maxPrice} onChange={update('maxPrice')} />
            </div>
          </div>
          {hasActiveFilters && (
            <div className="filter-bar-actions">
              <button type="button" className="filter-clear-btn" onClick={clear}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
