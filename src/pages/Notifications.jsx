import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchUnreadCount } = useAuth();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      fetchNotifications();
      fetchUnreadCount();
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await API.put('/notifications/mark-all-read');
      fetchNotifications();
      fetchUnreadCount();
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  if (loading) return <LoadingSpinner text="Fetching your notifications..." />;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-0">Notifications Center</h2>
          <p className="text-muted small mb-0">Alerts regarding AI matches, claim reviews, and item status updates</p>
        </div>
        {notifications.some(n => !n.read) && (
          <button className="btn btn-outline-primary btn-sm fw-bold" onClick={handleMarkAllRead}>
            Mark All as Read
          </button>
        )}
      </div>

      <div className="list-group shadow-sm rounded-4 overflow-hidden border">
        {notifications.length === 0 ? (
          <div className="p-5 text-center bg-white text-muted">
            <i className="bi bi-bell-slash fs-1 text-muted opacity-50"></i>
            <p className="mt-2 mb-0">You have no notifications yet.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`list-group-item p-3 ${!n.read ? 'bg-primary bg-opacity-10 border-start border-primary border-4' : 'bg-white'}`}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <i className={`bi ${n.type === 'AI_MATCH' ? 'bi-cpu-fill text-primary' : n.type === 'CLAIM_APPROVED' ? 'bi-check-circle-fill text-success' : 'bi-bell-fill text-secondary'} me-2 fs-5`}></i>
                  <span className={!n.read ? 'fw-bold text-dark' : 'text-secondary'}>{n.message}</span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <small className="text-muted">{n.createdAt?.split('T')[0]}</small>
                  {!n.read && (
                    <button className="btn btn-sm btn-light border" onClick={() => handleMarkAsRead(n.id)}>
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
