import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#2d3748',
      color: 'white',
      padding: '30px 0',
      marginTop: 'auto'
    }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <p>📊 Every click is being tracked in real-time</p>
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#a0aec0' }}>
          © 2024 ClickTracker - All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;