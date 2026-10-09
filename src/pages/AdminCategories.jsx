import React, { useState, useEffect } from 'react';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingCategory) {
        await API.put(`/categories/${editingCategory.id}`, { name, description });
      } else {
        await API.post('/categories', { name, description });
      }
      setName('');
      setDescription('');
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || '');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await API.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category');
    }
  };

  if (loading) return <LoadingSpinner text="Fetching categories..." />;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="badge bg-warning text-dark font-weight-bold mb-1">ADMIN PORTAL</span>
          <h2 className="fw-bold text-dark mb-0">Category Management</h2>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold text-dark mb-3">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h5>

              {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold small text-secondary">Category Name *</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    placeholder="e.g. Sports Equipment"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold small text-secondary">Description</label>
                  <textarea
                    className="form-control bg-light"
                    rows="3"
                    placeholder="Brief description of items in this category..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="d-flex gap-2">
                  {editingCategory && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary flex-fill"
                      onClick={() => {
                        setEditingCategory(null);
                        setName('');
                        setDescription('');
                      }}
                    >
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="btn btn-primary flex-fill fw-bold">
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="ps-4">ID</th>
                      <th>Category Name</th>
                      <th>Description</th>
                      <th className="text-end pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c) => (
                      <tr key={c.id}>
                        <td className="ps-4 fw-bold">#{c.id}</td>
                        <td className="fw-bold text-dark">{c.name}</td>
                        <td className="small text-muted">{c.description || '-'}</td>
                        <td className="text-end pe-4">
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(c)}>
                            <i className="bi bi-pencil me-1"></i> Edit
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c.id)}>
                            <i className="bi bi-trash me-1"></i> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
