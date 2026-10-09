import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await API.get('/claims');
      setClaims(res.data);
    } catch (err) {
      console.error('Failed to fetch claims:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (claimId, newStatus) => {
    setActionLoading(true);
    try {
      await API.put(`/claims/${claimId}/status`, { status: newStatus });
      fetchClaims();
      setSelectedClaim(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Fetching submitted claims..." />;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="badge bg-warning text-dark font-weight-bold mb-1">ADMIN & STAFF</span>
          <h2 className="fw-bold text-dark mb-0">Claim Review & Approvals</h2>
        </div>
      </div>

      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Claim ID</th>
                  <th>Item Title</th>
                  <th>Claimant Name</th>
                  <th>Claim Description</th>
                  <th>Date Submitted</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {claims.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
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
                        <div className="small text-muted">Category: {c.item?.category?.name}</div>
                      </td>
                      <td>
                        <div className="fw-bold">{c.claimant?.name}</div>
                        <div className="small text-muted">{c.claimant?.email}</div>
                      </td>
                      <td>
                        <div className="text-truncate" style={{ maxWidth: '240px' }}>
                          {c.description}
                        </div>
                      </td>
                      <td className="small">{c.createdAt?.split('T')[0]}</td>
                      <td>
                        <span className={`badge ${c.status === 'APPROVED' ? 'bg-success' : c.status === 'REJECTED' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#reviewModal"
                          onClick={() => setSelectedClaim(c)}
                        >
                          <i className="bi bi-eye me-1"></i> Review Proof
                        </button>
                        {c.status === 'PENDING' && (
                          <div className="btn-group">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleUpdateStatus(c.id, 'APPROVED')}
                              disabled={actionLoading}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleUpdateStatus(c.id, 'REJECTED')}
                              disabled={actionLoading}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Review Details Modal */}
      {selectedClaim && (
        <div className="modal fade" id="reviewModal" tabIndex="-1" aria-labelledby="reviewModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold" id="reviewModalLabel">
                  <i className="bi bi-shield-check me-2"></i> Claim Review - #{selectedClaim.id}
                </h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-3 mb-4">
                  <div className="col-md-6 border-end">
                    <h6 className="fw-bold text-uppercase text-secondary small">Item Details</h6>
                    <h5 className="fw-bold text-dark">{selectedClaim.item?.title}</h5>
                    <p className="small text-muted">{selectedClaim.item?.description}</p>
                    <div className="small">
                      <div><strong>Location:</strong> {selectedClaim.item?.location}</div>
                      <div><strong>Reported By:</strong> {selectedClaim.item?.reportedBy?.name}</div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <h6 className="fw-bold text-uppercase text-secondary small">Claimant Info</h6>
                    <h5 className="fw-bold text-dark">{selectedClaim.claimant?.name}</h5>
                    <p className="small text-muted mb-1">Email: {selectedClaim.claimant?.email}</p>
                    <p className="small text-muted">Phone: {selectedClaim.claimant?.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="p-3 bg-light rounded-3 mb-3 border">
                  <h6 className="fw-bold text-dark mb-1">User's Ownership Description:</h6>
                  <p className="small mb-0 text-secondary">{selectedClaim.description}</p>
                </div>

                {selectedClaim.proofDetails && (
                  <div className="p-3 bg-primary bg-opacity-10 rounded-3 border border-primary border-opacity-25 mb-3">
                    <h6 className="fw-bold text-primary mb-1">Proof Details / Secret Identifiers:</h6>
                    <p className="small mb-0 text-dark">{selectedClaim.proofDetails}</p>
                  </div>
                )}
              </div>

              <div className="modal-footer bg-light d-flex justify-content-between">
                <div>
                  <span className="text-muted small">Current Status: </span>
                  <span className="badge bg-secondary">{selectedClaim.status}</span>
                </div>

                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  {selectedClaim.status === 'PENDING' && (
                    <>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        data-bs-dismiss="modal"
                        onClick={() => handleUpdateStatus(selectedClaim.id, 'REJECTED')}
                      >
                        Reject Claim
                      </button>
                      <button
                        type="button"
                        className="btn btn-success fw-bold"
                        data-bs-dismiss="modal"
                        onClick={() => handleUpdateStatus(selectedClaim.id, 'APPROVED')}
                      >
                        Approve & Mark Returned
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClaims;
