import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';

const BrowseItems = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');

  useEffect(() => {
    fetchCategories();
    executeSearch();
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const executeSearch = async () => {
    setLoading(true);
    try {
      const params = {};
      const kw = searchParams.get('keyword') || keyword;
      const tp = searchParams.get('type') || type;
      const cat = searchParams.get('categoryId') || categoryId;
      const st = searchParams.get('status') || status;
      const loc = searchParams.get('location') || location;

      if (kw) params.keyword = kw;
      if (tp) params.type = tp;
      if (cat) params.categoryId = cat;
      if (st) params.status = st;
      if (loc) params.location = loc;

      const res = await API.get('/items/search', { params });
      setItems(res.data);
    } catch (err) {
      console.error('Failed to search items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const newParams = {};
    if (keyword) newParams.keyword = keyword;
    if (type) newParams.type = type;
    if (categoryId) newParams.categoryId = categoryId;
    if (status) newParams.status = status;
    if (location) newParams.location = location;

    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setKeyword('');
    setType('');
    setCategoryId('');
    setStatus('');
    setLocation('');
    setSearchParams({});
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Browse Campus Items</h2>
          <p className="text-muted small mb-0">Search and filter through all lost and found listings on campus</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-body p-3">
          <form onSubmit={handleFilterSubmit}>
            <div className="row g-2 align-items-center">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Keyword (e.g. Earbuds, Bag...)"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              <div className="col-md-2">
                <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="">All Types (Lost/Found)</option>
                  <option value="LOST">LOST Items Only</option>
                  <option value="FOUND">FOUND Items Only</option>
                </select>
              </div>

              <div className="col-md-2">
                <select className="form-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Location (e.g. Library)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="col-md-3 d-flex gap-2">
                <button type="submit" className="btn btn-primary flex-fill fw-bold">
                  <i className="bi bi-funnel me-1"></i> Filter
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={handleResetFilters}>
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <LoadingSpinner text="Searching item catalog..." />
      ) : items.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm my-3">
          <i className="bi bi-search fs-1 text-muted"></i>
          <h5 className="mt-3 fw-bold text-dark">No Items Found</h5>
          <p className="text-muted small">Try broadening your search parameters or keywords.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {items.map((item) => (
            <div key={item.id} className="col">
              <ItemCard item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseItems;
