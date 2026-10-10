import React from 'react';
import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const backendBase = import.meta.env.VITE_API_BASE_URL 
      ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '') 
      : 'https://lostandfound-backend-production-a81a.up.railway.app';
    return `${backendBase}${url}`;
  };

  const statusBadgeClass = {
    ACTIVE: 'bg-primary',
    MATCHED: 'bg-info text-dark',
    CLAIMED: 'bg-warning text-dark',
    RETURNED: 'bg-success',
    CLOSED: 'bg-secondary',
  };

  return (
    <div className="card card-hover h-100 shadow-sm border-0 rounded-3 overflow-hidden">
      <div className="position-relative bg-light text-center" style={{ height: '180px' }}>
        {item.imageUrl ? (
          <img
            src={getImageUrl(item.imageUrl)}
            alt={item.title}
            className="w-100 h-100"
            style={{ objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x180?text=No+Image+Available';
            }}
          />
        ) : (
          <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
            <i className="bi bi-image fs-1 opacity-50"></i>
            <small className="mt-1">No Image Provided</small>
          </div>
        )}

        <div className="position-absolute top-0 start-0 m-2 d-flex gap-1">
          <span className={`badge ${item.type === 'LOST' ? 'badge-lost' : 'badge-found'} rounded-pill shadow-sm`}>
            {item.type}
          </span>
          <span className={`badge ${statusBadgeClass[item.status] || 'bg-secondary'} rounded-pill shadow-sm`}>
            {item.status}
          </span>
        </div>
      </div>

      <div className="card-body d-flex flex-direction-column">
        <h5 className="card-title text-truncate fw-bold text-dark mb-1">{item.title}</h5>

        <div className="text-muted small mb-2 d-flex align-items-center gap-2">
          <span className="badge bg-light text-dark border">
            <i className="bi bi-tag me-1"></i>
            {item.category?.name || 'General'}
          </span>
          {item.brand && (
            <span className="badge bg-light text-dark border">
              {item.brand}
            </span>
          )}
          {item.color && (
            <span className="badge bg-light text-dark border">
              {item.color}
            </span>
          )}
        </div>

        <p className="card-text text-secondary small text-truncate-2 mb-3" style={{ minHeight: '40px' }}>
          {item.description}
        </p>

        <div className="mt-auto border-top pt-2 text-muted small d-flex justify-content-between align-items-center">
          <div>
            <i className="bi bi-geo-alt text-danger me-1"></i>
            <span>{item.location}</span>
          </div>
          <div>
            <i className="bi bi-calendar3 me-1"></i>
            <span>{item.dateLostOrFound || item.dateReported}</span>
          </div>
        </div>
      </div>

      <div className="card-footer bg-white border-0 pt-0 pb-3">
        <Link to={`/items/${item.id}`} className="btn btn-outline-primary w-100 btn-sm font-weight-bold">
          <i className="bi bi-eye me-1"></i> View Details & AI Matches
        </Link>
      </div>
    </div>
  );
};

export default ItemCard;
