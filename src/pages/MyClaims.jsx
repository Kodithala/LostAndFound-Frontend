import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const MyClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyClaims();
  }, []);

  const fetchMyClaims = async () => {
    try {
      const res = await API.get('/claims/my-claims');
      setClaims(res.data);
    } catch (err) {
      console.error('Failed to load my claims:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Fetching your submitted claims..." />;

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-dark mb-1">My Ownership Claims</h2>
      <p className="text-muted small mb-4">Track verification status of claims you submitted for items</p>

      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Claim ID</th>
                  <th>Item Title</th>
                  <th>Claim Explanation</th>
                  <th>Submitted Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {claims.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No claims submitted yet.
                    </td>
                  </tr>
                ) : (
                  claims.map((c) => (
                    <tr key={c.id}>
                      <td className="ps-4 fw-bold">#{c.id}</td>
                      <td>
                        <Link to={`/items/${c.item?.id}`} className="fw-bold text-primary text-decoration-none">
                          {c.item?.title}
                        </Link>
                      </td>
                      <td className="small text-muted">{c.description}</td>
                      <td className="small">{c.createdAt?.split('T')[0]}</td>
                      <td>
                        <span className={`badge ${c.status === 'APPROVED' ? 'bg-success' : c.status === 'REJECTED' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyClaims;
