/**
 * @fileoverview Application entry point with error boundary
 * @module main
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import CrewCutMarketingCalculator from './CrewCutMarketingCalculator';
import './index.css'; // ← CSS imported here (recommended for Vite)

/**
 * Error Boundary for production error handling
 * Prevents white screen of death, provides user-friendly error messaging
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error:', error, errorInfo);
    // In production, send to error tracking service (Sentry, LogRocket, etc.)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'system-ui' }}>
          <h1 style={{ color: '#dc2626', fontSize: '2rem', marginBottom: '1rem' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#4b5563', marginBottom: '2rem' }}>
            Please refresh the page or contact support if the problem persists.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              padding: '10px 20px', 
              background: '#10b981', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#059669'}
            onMouseOut={(e) => e.target.style.background = '#10b981'}
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <CrewCutMarketingCalculator />
    </ErrorBoundary>
  </React.StrictMode>
);
