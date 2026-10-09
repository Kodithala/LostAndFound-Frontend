import React, { useState, useEffect } from 'react';
import API from '../services/api';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';

const MyReports = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyReports();
  }, []);

  const fetchMyReports = async () => {
    try {
      const res = await API.get('/items/my-reports');
      setItems(res.data);
    } catch (err) {
      console.error('Failed to load my reports:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Fetching your reported items..." />;

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-dark mb-1">My Reported Items</h2>
      <p className="text-muted small mb-4">View and manage all lost and found listings you have created</p>

      {items.length === 0 ? (
        <div className="bg-white p-5 rounded-4 text-center border shadow-sm">
          <i className="bi bi-journal-x fs-1 text-muted"></i>
          <p className="text-muted mt-2">You haven't reported any items yet.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {items.map((item) => (
            <div key={item.id} className="col">
              <ItemCard item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReports;
