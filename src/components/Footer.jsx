import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container text-center">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h5 className="fw-bold mb-2">
              <i className="bi bi-search-heart text-primary me-2"></i>
              Campus Lost & Found System
            </h5>
            <p className="text-secondary small mb-3">
              An AI-powered automated lost and found management system designed for university campuses. Uses smart text analysis and attribute matching to reunite students with missing belongings.
            </p>
            <div className="border-top border-secondary pt-3 text-secondary small">
              &copy; {new Date().getFullYear()} Campus Lost & Found System. Built with Spring Boot 3 & React.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
