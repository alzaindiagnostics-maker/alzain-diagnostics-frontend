import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { fetchPackages, fetchCategories } from '../api/publicApi';
import PackageCard from '../components/common/PackageCard';
import '../styles/packages.css';

export default function Packages({ onBookPackage }) {
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState(['All', 'Health Packages', 'Medical / Gulf', 'Fever', 'Diabetes', 'Liver', 'Lipid', 'Thyroid', 'Electrolytes']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      const cats = await fetchCategories();
      setCategories(cats.map(c => c === 'ALL' ? 'All' : c));
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchPackages({
        query: searchTerm,
        category: selectedCategory === 'All' ? '' : selectedCategory,
        sort: sortBy
      });
      setPackages(data);
      setLoading(false);
    }

    const timer = setTimeout(() => {
      loadData();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, sortBy]);

  return (
    <div className="packages-page section-padding">
      <div className="container">
        {/* Header */}
        <div className="section-header text-center">
          <span className="section-subtitle">DIAGNOSTIC TEST CATALOGUE</span>
          <h1 className="section-title">Health Checkup Packages & Profiles</h1>
          <p className="section-description">
            Explore our diagnostic test packages formulated for complete body health, metabolic screening, and disease diagnosis in Pullampet.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="controls-card">
          <div className="search-box-wrapper">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search tests (e.g. Thyroid, HbA1c, Fever, Lipid...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
                Clear
              </button>
            )}
          </div>

          <div className="sort-wrapper">
            <SlidersHorizontal size={18} className="sort-icon" />
            <span className="sort-label">Sort by:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="default">Featured / Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="category-pills-bar">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              className={`category-pill ${selectedCategory.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Counter */}
        <div className="results-counter-bar">
          <span>Showing <strong>{packages.length}</strong> diagnostic packages</span>
          {selectedCategory !== 'All' && (
            <span className="active-filter-badge">
              Category: {selectedCategory}
            </span>
          )}
        </div>

        {/* Package Grid */}
        {loading ? (
          <div className="loading-state flex-center py-5">
            <Loader2 size={36} className="animate-spin text-primary mr-2" />
            <span>Loading diagnostic packages...</span>
          </div>
        ) : packages.length > 0 ? (
          <div className="packages-grid">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id || pkg.slug} pkg={pkg} onBookPackage={onBookPackage} />
            ))}
          </div>
        ) : (
          <div className="no-results-box">
            <h3>No Diagnostic Packages Found</h3>
            <p>We couldn't find any packages matching "{searchTerm}". Try clearing your search or filter.</p>
            <button 
              className="btn btn-outline mt-3"
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
