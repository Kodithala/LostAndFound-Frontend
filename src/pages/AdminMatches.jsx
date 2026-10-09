import React, { useState, useEffect } from 'react';
import API from '../services/api';
import AIMatchCard from '../components/AIMatchCard';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await API.get('/matches');
      setMatches(res.data);
    } catch (err) {
      console.error('Failed to load AI matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id) => {
    try {
      await API.put(`/matches/${id}/confirm`);
      fetchMatches();
    } catch (err) {
      alert('Failed to confirm match');
    }
  };

  const handleReject = async (id) => {
    try {
      await API.put(`/matches/${id}/reject`);
      fetchMatches();
    } catch (err) {
      alert('Failed to reject match');
    }
  };

  if (loading) return <LoadingSpinner text="Loading AI generated match queue..." />;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="badge bg-warning text-dark font-weight-bold mb-1">ADMIN & STAFF</span>
          <h2 className="fw-bold text-dark mb-0">AI Match Engine Monitor</h2>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="bg-white p-5 rounded-4 text-center border shadow-sm">
          <i className="bi bi-cpu fs-1 text-muted"></i>
          <p className="text-muted mt-2">No AI matches found in the system queue.</p>
        </div>
      ) : (
        matches.map((m) => (
          <AIMatchCard key={m.id} match={m} onConfirm={handleConfirm} onReject={handleReject} />
        ))
      )}
    </div>
  );
};

export default AdminMatches;
