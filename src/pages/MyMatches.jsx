import React, { useState, useEffect } from 'react';
import API from '../services/api';
import AIMatchCard from '../components/AIMatchCard';
import LoadingSpinner from '../components/LoadingSpinner';

const MyMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyMatches();
  }, []);

  const fetchMyMatches = async () => {
    try {
      const res = await API.get('/matches/my-matches');
      setMatches(res.data);
    } catch (err) {
      console.error('Failed to load my matches:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Fetching your AI matches..." />;

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-dark mb-1">My AI Match Recommendations</h2>
      <p className="text-muted small mb-4">High-confidence potential matches identified for your reported items</p>

      {matches.length === 0 ? (
        <div className="bg-white p-5 rounded-4 text-center border shadow-sm">
          <i className="bi bi-cpu fs-1 text-muted"></i>
          <p className="text-muted mt-2">No AI matches found for your reports yet.</p>
        </div>
      ) : (
        matches.map((m) => <AIMatchCard key={m.id} match={m} />)
      )}
    </div>
  );
};

export default MyMatches;
