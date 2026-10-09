import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickCredentials = (role) => {
    if (role === 'ADMIN') {
      setEmail('admin@college.com');
      setPassword('admin123');
    } else if (role === 'STAFF') {
      setEmail('staff@college.com');
      setPassword('staff123');
    } else if (role === 'STUDENT') {
      setEmail('student@college.com');
      setPassword('student123');
    }
  };

  return (
    <div className="container py-5 my-4">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="badge badge-ai mb-2">CAMPUS SYSTEM</div>
                <h3 className="fw-bold text-dark">Sign In</h3>
                <p className="text-muted small">Enter your credentials to access Lost & Found portal</p>
              </div>

              {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold small text-secondary">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control bg-light border-start-0"
                      placeholder="student@college.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold small text-secondary">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control bg-light border-start-0"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-bold mb-3 shadow-sm"
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              {/* Demo Account Quick Buttons for Tutor Demo */}
              <div className="border-top pt-3 mt-3">
                <p className="text-muted small text-center mb-2 fw-bold">Quick Demo Login (1-Click Fill):</p>
                <div className="d-flex justify-content-center gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => fillQuickCredentials('STUDENT')}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-success"
                    onClick={() => fillQuickCredentials('STAFF')}
                  >
                    Staff
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-warning"
                    onClick={() => fillQuickCredentials('ADMIN')}
                  >
                    Admin
                  </button>
                </div>
              </div>

              <div className="text-center mt-4">
                <p className="small text-muted mb-0">
                  Don't have an account?{' '}
                  <Link to="/register" className="fw-bold text-primary">
                    Register here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
