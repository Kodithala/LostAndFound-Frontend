import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [recentItems, setRecentItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, catRes] = await Promise.all([
        API.get('/items'),
        API.get('/categories'),
      ]);
      setRecentItems(itemsRes.data.slice(0, 6)); // Top 6 recent items
      setCategories(catRes.data);
    } catch (err) {
      console.error('Failed to load home page data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/browse?keyword=${encodeURIComponent(searchKeyword)}&categoryId=${selectedCategory}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section mb-5">
        <div className="container text-center">
          <div className="badge badge-ai mb-3 px-3 py-2 fs-6 shadow">
            <i className="bi bi-robot me-2"></i> Powered by Automated AI Matching
          </div>
          <h1 className="hero-title display-4 mb-3">
            Lost Something on Campus? <br />
            <span className="text-primary">Let AI Help You Find It.</span>
          </h1>
          <p className="lead text-slate-300 max-w-2xl mx-auto mb-4" style={{ opacity: 0.9 }}>
            Our smart university lost & found platform automatically compares lost and found item reports using keyword, brand, location, and color similarity.
          </p>

          {/* Quick Search Bar */}
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <form onSubmit={handleSearchSubmit} className="bg-white p-2 rounded-4 shadow-lg d-flex flex-column flex-md-row gap-2">
                <div className="input-group input-group-lg border-0">
                  <span className="input-group-text bg-transparent border-0 text-muted">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 shadow-none text-dark"
                    placeholder="Search lost or found items (e.g. Samsung earbuds, ID card...)"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                </div>
                <select
                  className="form-select form-select-lg border-0 bg-light w-md-auto text-dark"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{ minWidth: '160px' }}
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <button type="submit" className="btn btn-primary btn-lg px-4 rounded-3 fw-bold">
                  Search
                </button>
              </form>
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3 mt-4">
            <Link to="/report-lost" className="btn btn-danger btn-lg px-4 shadow-sm">
              <i className="bi bi-exclamation-triangle me-2"></i> Report Lost Item
            </Link>
            <Link to="/report-found" className="btn btn-success btn-lg px-4 shadow-sm">
              <i className="bi bi-check-circle me-2"></i> Report Found Item
            </Link>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="container mb-5">
        {/* Features Row */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="feature-box">
              <div className="feature-icon bg-primary bg-opacity-10 text-primary">
                <i className="bi bi-robot"></i>
              </div>
              <h5 className="fw-bold">Smart AI Matching</h5>
              <p className="text-muted small">
                Automated similarity scoring checks item names, brand, color, location, and dates to suggest possible matches immediately.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-box">
              <div className="feature-icon bg-success bg-opacity-10 text-success">
                <i className="bi bi-shield-check"></i>
              </div>
              <h5 className="fw-bold">Verified Claims</h5>
              <p className="text-muted small">
                Submit claims with proof of ownership. Campus staff and administrators verify claims before returning items safely.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-box">
              <div className="feature-icon bg-warning bg-opacity-10 text-warning">
                <i className="bi bi-bell"></i>
              </div>
              <h5 className="fw-bold">Instant Notifications</h5>
              <p className="text-muted small">
                Receive real-time notifications on your dashboard when AI identifies a potential match for your reported missing item.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Items Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold text-dark mb-1">Recent Campus Reports</h3>
            <p className="text-muted small mb-0">Browse latest reported lost and found items on campus</p>
          </div>
          <Link to="/browse" className="btn btn-outline-primary fw-bold">
            View All Items <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : recentItems.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-3 shadow-sm">
            <i className="bi bi-inbox fs-1 text-muted"></i>
            <p className="text-muted mt-2">No item reports found yet. Be the first to report!</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {recentItems.map((item) => (
              <div key={item.id} className="col">
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
