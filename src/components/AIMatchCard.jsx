import React from 'react';
import { Link } from 'react-router-dom';

const AIMatchCard = ({ match, onConfirm, onReject, showActions = true }) => {
  const { id, lostItem, foundItem, similarityScore, matchReason, status } = match;

  const scoreInt = Math.round(similarityScore || 0);

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-primary';
    return 'bg-warning text-dark';
  };

  // Parse reasoning lines
  const lines = matchReason ? matchReason.split('\n') : [];
  const factors = lines.filter(l => l.trim().startsWith('✓'));
  const explanationLine = lines.find(l => l.startsWith('AI Explanation:')) || '';
  const cleanExplanation = lines.slice(lines.indexOf(explanationLine) + 1).join('\n').replace(/^"|"$/g, '').trim() || matchReason;

  return (
    <div className="card border-primary border-2 shadow-sm rounded-3 mb-4 overflow-hidden">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-2 px-3">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-cpu-fill fs-5"></i>
          <span className="fw-bold">AI Match Recommendation</span>
        </div>
        <span className={`badge rounded-pill ${status === 'CONFIRMED' ? 'bg-success' : status === 'REJECTED' ? 'bg-danger' : 'bg-light text-dark'}`}>
          Status: {status}
        </span>
      </div>

      <div className="card-body">
        {/* Match Header Progress Bar */}
        <div className="row align-items-center mb-3">
          <div className="col-md-4 text-center border-end">
            <h2 className="display-6 fw-extrabold text-primary mb-0">{scoreInt}%</h2>
            <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.75rem' }}>
              Match Confidence
            </small>
          </div>
          <div className="col-md-8">
            <div className="d-flex justify-content-between mb-1 small fw-bold">
              <span>Similarity Score</span>
              <span>{scoreInt} / 100</span>
            </div>
            <div className="progress progress-match">
              <div
                className={`progress-bar ${getScoreColor(scoreInt)} progress-match-bar`}
                role="progressbar"
                style={{ width: `${scoreInt}%` }}
                aria-valuenow={scoreInt}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        </div>

        {/* Item Comparison Section */}
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <div className="p-3 bg-light rounded border border-danger border-opacity-25 h-100">
              <span className="badge badge-lost mb-2">LOST ITEM</span>
              <h6 className="fw-bold text-dark mb-1">{lostItem.title}</h6>
              <p className="small text-secondary mb-2 text-truncate">{lostItem.description}</p>
              <div className="small text-muted">
                <div><i className="bi bi-geo-alt me-1"></i> {lostItem.location}</div>
                <div><i className="bi bi-person me-1"></i> Reported by: {lostItem.reportedBy?.name}</div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="p-3 bg-light rounded border border-success border-opacity-25 h-100">
              <span className="badge badge-found mb-2">FOUND ITEM</span>
              <h6 className="fw-bold text-dark mb-1">{foundItem.title}</h6>
              <p className="small text-secondary mb-2 text-truncate">{foundItem.description}</p>
              <div className="small text-muted">
                <div><i className="bi bi-geo-alt me-1"></i> {foundItem.location}</div>
                <div><i className="bi bi-person me-1"></i> Reported by: {foundItem.reportedBy?.name}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Matching Factors Checklist */}
        {factors.length > 0 && (
          <div className="mb-3">
            <h6 className="fw-bold text-secondary mb-2 small text-uppercase">
              <i className="bi bi-check-all text-success me-1"></i> Matching Factors Identified:
            </h6>
            <div className="d-flex flex-wrap gap-2">
              {factors.map((factor, index) => (
                <span key={index} className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">
                  {factor}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* AI Dynamic Explanation */}
        <div className="p-3 bg-primary bg-opacity-10 rounded border border-primary border-opacity-25">
          <h6 className="fw-bold text-primary small text-uppercase mb-1">
            <i className="bi bi-robot me-1"></i> AI Reasoning & Explanation:
          </h6>
          <p className="small mb-0 text-dark italic">
            "{cleanExplanation}"
          </p>
        </div>
      </div>

      {showActions && (
        <div className="card-footer bg-light d-flex justify-content-between align-items-center">
          <div className="d-flex gap-2">
            <Link to={`/items/${foundItem.id}`} className="btn btn-sm btn-success fw-bold">
              <i className="bi bi-shield-check me-1"></i> View & Claim Found Item
            </Link>
            <Link to={`/items/${lostItem.id}`} className="btn btn-sm btn-outline-secondary">
              <i className="bi bi-file-earmark-text me-1"></i> View Lost Item
            </Link>
          </div>

          {status === 'PENDING' && (
            <div className="d-flex gap-2">
              {onConfirm && (
                <button className="btn btn-sm btn-success" onClick={() => onConfirm(id)}>
                  <i className="bi bi-check-lg me-1"></i> Confirm Match
                </button>
              )}
              {onReject && (
                <button className="btn btn-sm btn-outline-danger" onClick={() => onReject(id)}>
                  <i className="bi bi-x-lg me-1"></i> Reject Match
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIMatchCard;
