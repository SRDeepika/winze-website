import React, { useState } from 'react';
import { trackClick } from '../services/api';
import toast from 'react-hot-toast';

const LinkCard = ({ title, description, url, icon }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    
    const loadingToast = toast.loading(`Tracking ${title}...`);
    
    try {
      await trackClick({
        link_url: url,
        link_title: title,
        ip_address: 'user'
      });
      
      toast.dismiss(loadingToast);
      toast.success(`✅ Click tracked: ${title}`);
      
      setTimeout(() => {
        window.open(url, '_blank');
      }, 500);
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('❌ Failed to track click');
      console.error('Track error:', err);
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 10px 30px rgba(0,0,0,0.15)' 
          : '0 4px 6px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>{icon}</div>
      <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
        {title}
      </h3>
      <p style={{ color: '#666', marginBottom: '12px', lineHeight: '1.5' }}>
        {description}
      </p>
      <div style={{ 
        fontSize: '12px', 
        color: '#667eea',
        wordBreak: 'break-all',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
        {url}
      </div>
      {isHovered && (
        <div style={{
          marginTop: '12px',
          color: '#764ba2',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          Click to visit →
        </div>
      )}
    </div>
  );
};

export default LinkCard;