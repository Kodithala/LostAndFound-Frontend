import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Profile = () => {
  const { user, updateUserData } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);

    try {
      const res = await API.put(`/users/profile/${user.id}`, { name, phone });
      updateUserData(res.data);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-md border-0 rounded-4">
            <div className="card-header bg-dark text-white p-4">
              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-person-circle fs-1 text-primary"></i>
                <div>
                  <h4 className="fw-bold mb-0">{user?.name}</h4>
                  <span className="badge bg-primary mt-1">{user?.role} ACCOUNT</span>
                </div>
              </div>
            </div>

            <div className="card-body p-4 p-md-5">
              {success && <div className="alert alert-success py-2 small mb-3">{success}</div>}
              {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold small text-secondary">University Email (Read Only)</label>
                  <input type="email" className="form-control bg-light text-muted" value={user?.email || ''} disabled />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold small text-secondary">Full Name</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold small text-secondary">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control bg-light"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100 fw-bold py-2 shadow-sm" disabled={loading}>
                  {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
