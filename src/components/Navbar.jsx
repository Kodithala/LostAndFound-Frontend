import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, unreadCount, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <i className="bi bi-search-heart text-primary fs-3"></i>
          <span>CampusLostFound</span>
          <span className="badge bg-primary fs-6 fw-normal ms-1">AI</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                <i className="bi bi-house-door me-1"></i> Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/browse">
                <i className="bi bi-grid me-1"></i> Browse Items
              </NavLink>
            </li>

            {user && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/report-lost">
                    <i className="bi bi-exclamation-circle me-1 text-danger"></i> Report Lost
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/report-found">
                    <i className="bi bi-check-circle me-1 text-success"></i> Report Found
                  </NavLink>
                </li>
              </>
            )}

            {/* Admin Portal Navigation - Only visible to authenticated ADMINs */}
            {isAdmin && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle text-warning font-weight-bold"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-shield-lock me-1"></i> Admin Portal
                </a>
                <ul className="dropdown-menu dropdown-menu-dark">
                  <li>
                    <Link className="dropdown-item" to="/admin/dashboard">
                      <i className="bi bi-speedometer2 me-2"></i> Admin Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/users">
                      <i className="bi bi-people me-2"></i> Users Management
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/items">
                      <i className="bi bi-box-seam me-2"></i> Items Management
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/claims">
                      <i className="bi bi-file-earmark-check me-2"></i> Claims Management
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/categories">
                      <i className="bi bi-tags me-2"></i> Categories
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/matches">
                      <i className="bi bi-cpu me-2"></i> AI Matches Monitor
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {user ? (
              <>
                <NavLink className="btn btn-outline-light position-relative btn-sm" to="/notifications">
                  <i className="bi bi-bell"></i>
                  {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {unreadCount}
                    </span>
                  )}
                </NavLink>

                <div className="dropdown ms-2">
                  <button
                    className="btn btn-secondary btn-sm dropdown-toggle d-flex align-items-center gap-2"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-person-circle fs-6"></i>
                    <span>{user.name}</span>
                    <span className="badge bg-light text-dark ms-1" style={{ fontSize: '0.7rem' }}>
                      {user.role}
                    </span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow">
                    <li>
                      <Link className="dropdown-item" to="/dashboard">
                        <i className="bi bi-layout-dashboard me-2"></i> My Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/my-reports">
                        <i className="bi bi-journal-text me-2"></i> My Reports
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/my-matches">
                        <i className="bi bi-cpu me-2"></i> My AI Matches
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/my-claims">
                        <i className="bi bi-card-checklist me-2"></i> My Claims
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="bi bi-person me-2"></i> Profile
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-light btn-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
