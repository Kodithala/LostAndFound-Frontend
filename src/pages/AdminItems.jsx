import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await API.get('/items');
      setItems(res.data);
    } catch (err) {
      console.error('Failed to load items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this item report?')) return;
    try {
      await API.delete(`/items/${id}`);
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete item');
    }
  };

  if (loading) return <LoadingSpinner text="Fetching item catalog..." />;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="badge bg-warning text-dark font-weight-bold mb-1">ADMIN & STAFF</span>
          <h2 className="fw-bold text-dark mb-0">Item Reports Management</h2>
        </div>
      </div>

      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Item ID</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Reported By</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="ps-4 fw-bold">#{item.id}</td>
                    <td>
                      <Link to={`/items/${item.id}`} className="fw-bold text-primary text-decoration-none">
                        {item.title}
                      </Link>
                    </td>
                    <td>
                      <span className={`badge ${item.type === 'LOST' ? 'badge-lost' : 'badge-found'}`}>
                        {item.type}
                      </span>
                    </td>
                    <td>{item.category?.name}</td>
                    <td>{item.location}</td>
                    <td>{item.reportedBy?.name}</td>
                    <td>
                      <span className="badge bg-secondary">{item.status}</span>
                    </td>
                    <td className="text-end pe-4">
                      <Link to={`/items/${item.id}`} className="btn btn-sm btn-outline-primary me-2">
                        View
                      </Link>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item.id)}>
                        Remove
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
  );
};

export default AdminItems;
