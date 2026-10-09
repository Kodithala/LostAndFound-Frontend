import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

// Chart.js registration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get('/admin/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Fetching admin metrics & analytics..." />;
  if (!stats) return <div className="container py-5"><div className="alert alert-danger">Error loading admin dashboard stats.</div></div>;

  // Chart Data Configurations
  const lostVsFoundData = {
    labels: ['Lost Items', 'Found Items'],
    datasets: [
      {
        label: 'Item Reports',
        data: [stats.totalLostItems, stats.totalFoundItems],
        backgroundColor: ['#ef4444', '#10b981'],
        borderWidth: 1,
      },
    ],
  };

  const categoryLabels = Object.keys(stats.itemsByCategory || {});
  const categoryValues = Object.values(stats.itemsByCategory || {});

  const categoryChartData = {
    labels: categoryLabels.length ? categoryLabels : ['Electronics', 'Documents', 'Accessories', 'Bags', 'Books'],
    datasets: [
      {
        label: 'Items Count',
        data: categoryValues.length ? categoryValues : [4, 2, 3, 5, 1],
        backgroundColor: '#2563eb',
        borderRadius: 8,
      },
    ],
  };

  const claimStatusData = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [
      {
        data: [stats.pendingClaims, stats.approvedClaims, stats.claimsByStatus?.REJECTED || 0],
        backgroundColor: ['#f59e0b', '#10b981', '#ef4444'],
      },
    ],
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="badge bg-warning text-dark font-weight-bold mb-1">ADMIN & STAFF PORTAL</span>
          <h2 className="fw-bold text-dark mb-0">System Analytics & Control Panel</h2>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/claims" className="btn btn-primary btn-sm fw-bold">
            <i className="bi bi-file-earmark-check me-1"></i> Review Claims ({stats.pendingClaims})
          </Link>
          <Link to="/admin/categories" className="btn btn-outline-secondary btn-sm fw-bold">
            <i className="bi bi-tags me-1"></i> Categories
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="row g-3 mb-5">
        <div className="col-md-2">
          <div className="card text-center p-3 border-0 shadow-sm rounded-4 bg-white">
            <span className="text-muted small fw-bold text-uppercase">Total Users</span>
            <h3 className="fw-extrabold text-dark mt-1 mb-0">{stats.totalUsers}</h3>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center p-3 border-0 shadow-sm rounded-4 bg-danger bg-opacity-10">
            <span className="text-danger small fw-bold text-uppercase">Lost Reports</span>
            <h3 className="fw-extrabold text-danger mt-1 mb-0">{stats.totalLostItems}</h3>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center p-3 border-0 shadow-sm rounded-4 bg-success bg-opacity-10">
            <span className="text-success small fw-bold text-uppercase">Found Reports</span>
            <h3 className="fw-extrabold text-success mt-1 mb-0">{stats.totalFoundItems}</h3>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center p-3 border-0 shadow-sm rounded-4 bg-warning bg-opacity-10">
            <span className="text-dark small fw-bold text-uppercase">Total Claims</span>
            <h3 className="fw-extrabold text-dark mt-1 mb-0">{stats.totalClaims}</h3>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center p-3 border-0 shadow-sm rounded-4 bg-primary bg-opacity-10">
            <span className="text-primary small fw-bold text-uppercase">AI Matches</span>
            <h3 className="fw-extrabold text-primary mt-1 mb-0">{stats.matchedItems}</h3>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center p-3 border-0 shadow-sm rounded-4 bg-info bg-opacity-10">
            <span className="text-info text-dark small fw-bold text-uppercase">Returned</span>
            <h3 className="fw-extrabold text-dark mt-1 mb-0">{stats.returnedItems}</h3>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="row g-4 mb-5">
        {/* Category Distribution Bar Chart */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
            <h5 className="fw-bold text-dark mb-3">Items by Category Distribution</h5>
            <div style={{ height: '280px' }}>
              <Bar
                data={categoryChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          </div>
        </div>

        {/* Lost vs Found Doughnut */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
            <h5 className="fw-bold text-dark mb-3">Lost vs Found Proportion</h5>
            <div style={{ height: '280px' }} className="d-flex align-items-center justify-content-center">
              <Doughnut
                data={lostVsFoundData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Claim Breakdown Chart */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 className="fw-bold text-dark mb-3">Claim Review Status Breakdown</h5>
            <div style={{ height: '240px' }} className="d-flex align-items-center justify-content-center">
              <Pie
                data={claimStatusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
        </div>

        {/* Quick Management Links */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h5 className="fw-bold text-dark mb-3">Admin Quick Controls</h5>
            <div className="list-group list-group-flush">
              <Link to="/admin/claims" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3">
                <div>
                  <i className="bi bi-file-earmark-check text-primary me-2 fs-5"></i>
                  <strong className="text-dark">Review Submitted Claims</strong>
                  <div className="small text-muted">Verify ownership proofs and approve/reject claims</div>
                </div>
                <span className="badge bg-warning text-dark">{stats.pendingClaims} Pending</span>
              </Link>
              <Link to="/admin/items" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3">
                <div>
                  <i className="bi bi-box-seam text-success me-2 fs-5"></i>
                  <strong className="text-dark">Manage All Item Reports</strong>
                  <div className="small text-muted">View, search, or remove reported items</div>
                </div>
                <i className="bi bi-chevron-right text-muted"></i>
              </Link>
              <Link to="/admin/users" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3">
                <div>
                  <i className="bi bi-people text-info me-2 fs-5"></i>
                  <strong className="text-dark">Manage Registered Users</strong>
                  <div className="small text-muted">View user accounts, roles, and report logs</div>
                </div>
                <i className="bi bi-chevron-right text-muted"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
