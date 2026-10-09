import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';
import AIMatchCard from '../components/AIMatchCard';
import LoadingSpinner from '../components/LoadingSpinner';

const UserDashboard = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [matches, setMatches] = useState([]);
  const [claims, setClaims] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const [repRes, matchRes, claimRes, notifRes] = await Promise.all([
        API.get('/items/my-reports'),
        API.get('/matches/my-matches'),
        API.get('/claims/my-claims'),
        API.get('/notifications'),
      ]);
      setReports(repRes.data);
      setMatches(matchRes.data);
      setClaims(claimRes.data);
      setNotifications(notifRes.data);
    } catch (err) {
      console.error('Failed to load user dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const lostCount = reports.filter(r => r.type === 'LOST').length;
  const foundCount = reports.filter(r => r.type === 'FOUND').length;
  const pendingClaimsCount = claims.filter(c => c.status === 'PENDING').length;
  const approvedClaimsCount = claims.filter(c => c.status === 'APPROVED').length;

  if (loading) return <LoadingSpinner text="Loading your dashboard..." />;

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Welcome back, {user?.name}!</h2>
          <p className="text-muted small mb-0">Overview of your reports, AI matches, claims, and campus alerts</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/report-lost" className="btn btn-danger btn-sm fw-bold">
            <i className="bi bi-exclamation-triangle me-1"></i> Report Lost
          </Link>
          <Link to="/report-found" className="btn btn-success btn-sm fw-bold">
            <i className="bi bi-check-circle me-1"></i> Report Found
          </Link>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="row g-3 mb-5">
        <div className="col-md-3">
          <div className="card stat-card bg-danger bg-opacity-10 border-danger border-opacity-25 p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-danger small fw-bold text-uppercase">Lost Reports</span>
                <h2 className="fw-extrabold text-danger mb-0">{lostCount}</h2>
              </div>
              <i className="bi bi-exclamation-circle fs-1 text-danger opacity-50"></i>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card stat-card bg-success bg-opacity-10 border-success border-opacity-25 p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-success small fw-bold text-uppercase">Found Reports</span>
                <h2 className="fw-extrabold text-success mb-0">{foundCount}</h2>
              </div>
              <i className="bi bi-check-circle fs-1 text-success opacity-50"></i>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card stat-card bg-primary bg-opacity-10 border-primary border-opacity-25 p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-primary small fw-bold text-uppercase">AI Matches</span>
                <h2 className="fw-extrabold text-primary mb-0">{matches.length}</h2>
              </div>
              <i className="bi bi-cpu fs-1 text-primary opacity-50"></i>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card stat-card bg-warning bg-opacity-10 border-warning border-opacity-25 p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-warning text-dark small fw-bold text-uppercase">Claims (Appr/Pend)</span>
                <h2 className="fw-extrabold text-dark mb-0">{approvedClaimsCount} / {pendingClaimsCount}</h2>
              </div>
              <i className="bi bi-shield-check fs-1 text-warning opacity-50"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <ul className="nav nav-pills mb-4 border-bottom pb-2" id="dashboardTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button className="nav-link active fw-bold" id="matches-tab" data-bs-toggle="tab" data-bs-target="#matches" type="button" role="tab">
            <i className="bi bi-cpu me-1"></i> AI Matches ({matches.length})
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link fw-bold" id="reports-tab" data-bs-toggle="tab" data-bs-target="#reports" type="button" role="tab">
            <i className="bi bi-journal-text me-1"></i> My Reports ({reports.length})
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link fw-bold" id="claims-tab" data-bs-toggle="tab" data-bs-target="#claims" type="button" role="tab">
            <i className="bi bi-card-checklist me-1"></i> My Claims ({claims.length})
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link fw-bold" id="notifs-tab" data-bs-toggle="tab" data-bs-target="#notifs" type="button" role="tab">
            <i className="bi bi-bell me-1"></i> Notifications ({notifications.length})
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content" id="dashboardTabsContent">
        {/* AI Matches Tab */}
        <div className="tab-pane fade show active" id="matches" role="tabpanel">
          {matches.length === 0 ? (
            <div className="bg-white p-5 rounded-4 text-center border shadow-sm">
              <i className="bi bi-cpu fs-1 text-muted opacity-50"></i>
              <h5 className="mt-3 fw-bold text-dark">No AI Matches Found Yet</h5>
              <p className="text-muted small">Report a lost or found item to trigger automated AI matching against active reports.</p>
            </div>
          ) : (
            matches.map((m) => <AIMatchCard key={m.id} match={m} />)
          )}
        </div>

        {/* My Reports Tab */}
        <div className="tab-pane fade" id="reports" role="tabpanel">
          {reports.length === 0 ? (
            <div className="bg-white p-5 rounded-4 text-center border shadow-sm">
              <i className="bi bi-inbox fs-1 text-muted"></i>
              <p className="text-muted mt-2">You haven't reported any lost or found items yet.</p>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {reports.map((item) => (
                <div key={item.id} className="col">
                  <ItemCard item={item} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Claims Tab */}
        <div className="tab-pane fade" id="claims" role="tabpanel">
          {claims.length === 0 ? (
            <div className="bg-white p-5 rounded-4 text-center border shadow-sm">
              <i className="bi bi-shield-x fs-1 text-muted"></i>
              <p className="text-muted mt-2">You haven't submitted any ownership claims.</p>
            </div>
          ) : (
            <div className="table-responsive bg-white rounded-4 shadow-sm border p-3">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Claim ID</th>
                    <th>Item Title</th>
                    <th>Claim Details</th>
                    <th>Date Submitted</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((c) => (
                    <tr key={c.id}>
                      <td>#{c.id}</td>
                      <td>
                        <Link to={`/items/${c.item?.id}`} className="fw-bold text-primary">
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Notifications Tab */}
        <div className="tab-pane fade" id="notifs" role="tabpanel">
          <div className="list-group shadow-sm rounded-4 overflow-hidden">
            {notifications.length === 0 ? (
              <div className="list-group-item p-4 text-center text-muted">No notifications</div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className={`list-group-item p-3 ${!n.read ? 'bg-primary bg-opacity-10 fw-bold' : ''}`}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <i className="bi bi-bell-fill me-2 text-primary"></i>
                      <span>{n.message}</span>
                    </div>
                    <small className="text-muted">{n.createdAt?.split('T')[0]}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
