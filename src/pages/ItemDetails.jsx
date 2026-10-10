import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import AIMatchCard from '../components/AIMatchCard';
import LoadingSpinner from '../components/LoadingSpinner';

const ItemDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingAI, setGeneratingAI] = useState(false);

  // Claim modal state
  const [claimDescription, setClaimDescription] = useState('');
  const [proofDetails, setProofDetails] = useState('');
  const [claimSubmitting, setClaimSubmitting] = useState(false);
  const [claimError, setClaimError] = useState('');
  const [claimSuccess, setClaimSuccess] = useState('');

  // Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [userClaim, setUserClaim] = useState(null);

  useEffect(() => {
    fetchItemDetails();
  }, [id, user]);

  const fetchItemDetails = async () => {
    setLoading(true);
    try {
      const itemRes = await API.get(`/items/${id}`);
      setItem(itemRes.data);

      if (user) {
        try {
          const myClaimsRes = await API.get('/claims/my-claims');
          const existingClaim = myClaimsRes.data.find(c => c.item?.id === itemRes.data.id);
          setUserClaim(existingClaim || null);
        } catch (cErr) {
          console.warn('Could not fetch user claims:', cErr);
        }
      }

      try {
        const matchRes = await API.get(`/matches/item/${id}`);
        setMatches(matchRes.data || []);
      } catch (matchErr) {
        console.warn('Could not fetch item matches:', matchErr);
        setMatches([]);
      }
    } catch (err) {
      console.error('Failed to load item details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAIMatch = async () => {
    setGeneratingAI(true);
    try {
      const res = await API.post(`/matches/generate/${id}`);
      setMatches(res.data);
    } catch (err) {
      console.error('Failed to trigger AI match:', err);
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleConfirmMatch = async (matchId) => {
    try {
      await API.put(`/matches/${matchId}/confirm`);
      fetchItemDetails();
    } catch (err) {
      console.error('Failed to confirm match:', err);
    }
  };

  const handleRejectMatch = async (matchId) => {
    try {
      await API.put(`/matches/${matchId}/reject`);
      fetchItemDetails();
    } catch (err) {
      console.error('Failed to reject match:', err);
    }
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    setClaimError('');
    setClaimSuccess('');
    setClaimSubmitting(true);

    try {
      await API.post('/claims', {
        itemId: item.id,
        description: claimDescription,
        proofDetails: proofDetails,
      });
      setClaimSuccess('Claim submitted successfully! Campus staff will review your request.');
      setClaimDescription('');
      setProofDetails('');
      fetchItemDetails();
    } catch (err) {
      setClaimError(err.response?.data?.message || 'Failed to submit claim.');
    } finally {
      setClaimSubmitting(false);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const res = await API.post(`/items/${id}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setItem({ ...item, imageUrl: res.data.imageUrl });
      setImageFile(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const backendBase = import.meta.env.VITE_API_BASE_URL 
      ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '') 
      : 'http://localhost:8080';
    return `${backendBase}${url}`;
  };

  if (loading) return <LoadingSpinner text="Fetching report details..." />;
  if (!item) return <div className="container py-5"><div className="alert alert-warning">Item report not found.</div></div>;

  const isReporter = user && user.id === item.reportedBy?.id;

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/browse">Browse</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{item.title}</li>
        </ol>
      </nav>

      {/* Item Overview Card */}
      <div className="card shadow-md border-0 rounded-4 overflow-hidden mb-5">
        <div className="row g-0">
          {/* Image Left Column */}
          <div className="col-md-5 bg-light text-center p-4 d-flex flex-column align-items-center justify-content-center border-end">
            {item.imageUrl ? (
              <img
                src={getImageUrl(item.imageUrl)}
                alt={item.title}
                className="img-fluid rounded-3 shadow-sm"
                style={{ maxHeight: '320px', objectFit: 'contain' }}
              />
            ) : (
              <div className="py-5 text-muted">
                <i className="bi bi-image fs-1 opacity-50"></i>
                <p className="mt-2 small mb-0">No image uploaded for this report</p>
              </div>
            )}

            {/* Upload Image Modal Trigger if reported by current user */}
            {isReporter && (
              <form onSubmit={handleImageUpload} className="mt-3 w-100">
                <div className="input-group input-group-sm">
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                  <button type="submit" className="btn btn-outline-primary" disabled={uploadingImage || !imageFile}>
                    {uploadingImage ? 'Uploading...' : 'Upload Image'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Details Right Column */}
          <div className="col-md-7 p-4 p-md-5 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div className="d-flex gap-2">
                <span className={`badge ${item.type === 'LOST' ? 'badge-lost' : 'badge-found'} fs-6 px-3 py-2 rounded-pill`}>
                  {item.type} REPORT
                </span>
                <span className="badge bg-secondary fs-6 px-3 py-2 rounded-pill">
                  {item.status}
                </span>
              </div>

              <button
                className="btn btn-sm btn-outline-primary fw-bold"
                onClick={handleGenerateAIMatch}
                disabled={generatingAI}
              >
                <i className="bi bi-cpu me-1"></i>
                {generatingAI ? 'Running AI...' : 'Re-run AI Match'}
              </button>
            </div>

            <h2 className="fw-extrabold text-dark mb-2">{item.title}</h2>

            <div className="d-flex flex-wrap gap-2 mb-3">
              <span className="badge bg-light text-dark border px-3 py-2">
                <i className="bi bi-tag text-primary me-1"></i> {item.category?.name}
              </span>
              {item.brand && (
                <span className="badge bg-light text-dark border px-3 py-2">
                  <i className="bi bi-bookmark me-1"></i> Brand: {item.brand}
                </span>
              )}
              {item.color && (
                <span className="badge bg-light text-dark border px-3 py-2">
                  <i className="bi bi-palette me-1"></i> Color: {item.color}
                </span>
              )}
            </div>

            <h6 className="fw-bold text-secondary text-uppercase small">Description</h6>
            <p className="text-secondary leading-relaxed mb-4">{item.description}</p>

            <div className="bg-light p-3 rounded-3 mb-4 border">
              <div className="row g-2 small">
                <div className="col-sm-6">
                  <span className="text-muted">Location: </span>
                  <strong className="text-dark"><i className="bi bi-geo-alt text-danger me-1"></i> {item.location}</strong>
                </div>
                <div className="col-sm-6">
                  <span className="text-muted">Date Reported: </span>
                  <strong className="text-dark"><i className="bi bi-calendar3 me-1"></i> {item.dateLostOrFound || item.dateReported}</strong>
                </div>
                <div className="col-12 mt-2">
                  <span className="text-muted">Reported By: </span>
                  <strong className="text-dark"><i className="bi bi-person me-1"></i> {item.reportedBy?.name} ({item.reportedBy?.email})</strong>
                </div>
              </div>
            </div>

            {/* Submit Claim Action */}
            <div className="mt-auto">
              {!user ? (
                <Link to="/login" className="btn btn-primary btn-lg w-100 fw-bold">
                  Sign In to Submit Ownership Claim
                </Link>
              ) : isReporter ? (
                <div className="alert alert-info py-2 small mb-0">
                  <i className="bi bi-info-circle me-1"></i> <strong>You reported this item listing.</strong>
                  {item.type === 'LOST' && (
                    <div className="mt-1">
                      To claim a found item matching your report, check the <strong>AI Matches</strong> section below and click <strong>"View & Claim Found Item"</strong>!
                    </div>
                  )}
                </div>
              ) : userClaim ? (
                <div className="alert alert-warning py-2 small mb-0">
                  <i className="bi bi-clock-history me-1"></i> You have already submitted an ownership claim for this item. 
                  (Status: <strong>{userClaim.status}</strong>)
                </div>
              ) : item.status === 'RETURNED' ? (
                <div className="alert alert-success py-2 small mb-0">
                  <i className="bi bi-check-circle me-1"></i> This item has already been claimed and returned.
                </div>
              ) : (
                <button
                  className="btn btn-success btn-lg w-100 fw-bold shadow-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#claimModal"
                >
                  <i className="bi bi-shield-check me-2"></i> Submit Ownership Claim
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Matches Section */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold text-dark mb-0">
            <i className="bi bi-cpu text-primary me-2"></i>
            AI Matching Results ({matches.length})
          </h4>
          <small className="text-muted">Analyzed using attribute & text similarity algorithms</small>
        </div>

        {matches.length === 0 ? (
          <div className="bg-white p-4 rounded-4 text-center border shadow-sm">
            <i className="bi bi-cpu fs-1 text-muted opacity-50"></i>
            <p className="text-muted mt-2 mb-0">No potential AI matches generated yet for this item.</p>
            <button className="btn btn-sm btn-outline-primary mt-2" onClick={handleGenerateAIMatch} disabled={generatingAI}>
              Run AI Similarity Search Now
            </button>
          </div>
        ) : (
          matches.map((match) => (
            <AIMatchCard
              key={match.id}
              match={match}
              onConfirm={handleConfirmMatch}
              onReject={handleRejectMatch}
            />
          ))
        )}
      </div>

      {/* Claim Submission Modal */}
      <div className="modal fade" id="claimModal" tabIndex="-1" aria-labelledby="claimModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 shadow">
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title fw-bold" id="claimModalLabel">
                <i className="bi bi-shield-check me-2"></i> Claim Ownership
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleClaimSubmit}>
              <div className="modal-body p-4">
                {claimError && <div className="alert alert-danger py-2 small">{claimError}</div>}
                {claimSuccess && <div className="alert alert-success py-2 small">{claimSuccess}</div>}

                <p className="small text-muted mb-3">
                  Please describe ownership details to help staff verify your claim (e.g., specific marks, contents inside bag, wallpapers, serial numbers).
                </p>

                <div className="mb-3">
                  <label className="form-label fw-bold small text-secondary">Claim Explanation *</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="e.g., I lost this bag near the library. It contains my college ID card and a blue spiral notebook."
                    value={claimDescription}
                    onChange={(e) => setClaimDescription(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold small text-secondary">Proof of Ownership / Identifiers</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="e.g., Student ID Number #883921, passcode lock code, engraved initials."
                    value={proofDetails}
                    onChange={(e) => setProofDetails(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer bg-light">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-success fw-bold" disabled={claimSubmitting}>
                  {claimSubmitting ? 'Submitting...' : 'Confirm Claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
