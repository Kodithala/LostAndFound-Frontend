import React from 'react';
import { Link } from 'react-router-dom';

const AccessDenied = () => {
  return (
    <div className="container py-5 my-5 text-center">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0 rounded-4 p-5 bg-white">
            <div className="mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger rounded-circle p-4 mb-2"
                style={{ width: '90px', height: '90px' }}
              >
                <i className="bi bi-shield-lock-fill display-4"></i>
              </div>
            </div>
            <h1 className="fw-bold text-danger mb-3">Access Denied</h1>
            <p className="lead text-secondary mb-4 fs-6 fw-normal">
              You don't have permission to access the Admin Dashboard. Only authorized administrators can access this page.
            </p>
            <div>
              <Link to="/" className="btn btn-primary px-4 py-2 fw-bold shadow-sm rounded-3">
                <i className="bi bi-house-door me-2"></i> Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
