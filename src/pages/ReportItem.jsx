import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../services/api';

const ReportItem = ({ defaultType = 'LOST' }) => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || defaultType;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState(initialType);
  const [categoryId, setCategoryId] = useState('');
  const [location, setLocation] = useState('');
  const [dateLostOrFound, setDateLostOrFound] = useState(new Date().toISOString().split('T')[0]);
  const [color, setColor] = useState('');
  const [brand, setBrand] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data);
      if (res.data.length > 0) {
        setCategoryId(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !description || !location || !categoryId) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      // 1. Create Item
      const itemRes = await API.post('/items', {
        title,
        description,
        type,
        categoryId,
        location,
        dateLostOrFound,
        color,
        brand,
      });

      const newItem = itemRes.data;

      // 2. Upload image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        await API.post(`/items/${newItem.id}/image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      navigate(`/items/${newItem.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to report item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0 rounded-4">
            <div className={`card-header ${type === 'LOST' ? 'bg-danger' : 'bg-success'} text-white p-4`}>
              <h3 className="fw-bold mb-1">
                <i className={`bi ${type === 'LOST' ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-2`}></i>
                Report {type === 'LOST' ? 'Lost Item' : 'Found Item'}
              </h3>
              <p className="mb-0 small" style={{ opacity: 0.9 }}>
                Our AI matching engine will immediately scan past reports for matching items!
              </p>
            </div>

            <div className="card-body p-4 p-md-5">
              {error && <div className="alert alert-danger py-2 small mb-4">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Report Type *</label>
                    <select
                      className="form-select bg-light"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="LOST">LOST ITEM (I lost something)</option>
                      <option value="FOUND">FOUND ITEM (I found something)</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Category *</label>
                    <select
                      className="form-select bg-light"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold small text-secondary">Item Title *</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    placeholder="e.g. Black Samsung Galaxy Buds Pro"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold small text-secondary">Item Description *</label>
                  <textarea
                    className="form-control bg-light"
                    rows="4"
                    placeholder="Provide detailed description including specific marks, case details, location specifics..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Campus Location *</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      placeholder="e.g. Central Library 1st Floor"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Date Lost or Found *</label>
                    <input
                      type="date"
                      className="form-control bg-light"
                      value={dateLostOrFound}
                      onChange={(e) => setDateLostOrFound(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Primary Color</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      placeholder="e.g. Black, Blue, Silver"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Brand / Manufacturer</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      placeholder="e.g. Samsung, Apple, Dell"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold small text-secondary">Upload Item Photo (Optional)</label>
                  <input
                    type="file"
                    className="form-control bg-light"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                  <small className="text-muted">Upload an image file (PNG, JPG, JPEG) up to 10MB.</small>
                </div>

                <div className="d-flex gap-3 pt-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`btn ${type === 'LOST' ? 'btn-danger' : 'btn-success'} flex-fill fw-bold py-2 shadow-sm`}
                    disabled={loading}
                  >
                    {loading ? 'Submitting Report...' : `Submit ${type} Report`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportItem;
