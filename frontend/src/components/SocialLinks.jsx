import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faLinkedin, 
    faWhatsapp, 
    faFacebook, 
    faInstagram
} from '@fortawesome/free-brands-svg-icons';

// Define the only 4 links we want to show
const ALLOWED_LINKS = [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/winze-technologies', icon: faLinkedin, color: '#0077b5', order: 1 },
    { name: 'WhatsApp', url: 'https://wa.me/919880010417', icon: faWhatsapp, color: '#25D366', order: 2 },
    { name: 'Facebook', url: 'https://www.facebook.com/winzetechnologies', icon: faFacebook, color: '#1877f2', order: 3 },
    { name: 'Instagram', url: 'https://www.instagram.com/winzetechnologies', icon: faInstagram, color: '#e4405f', order: 4 }
];

const SocialLinks = () => {
    const [hoveredId, setHoveredId] = useState(null);
    const [socialLinks, setSocialLinks] = useState(ALLOWED_LINKS);

    const getIpAddress = async () => {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (err) {
            return '0.0.0.0';
        }
    };

    const trackSocialClick = async (link) => {
        try {
            const ip = await getIpAddress();
            await fetch('https://winze-backend-api.onrender.com/api/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    link_url: link.url,
                    link_title: `Social: ${link.name}`,
                    ip_address: ip
                })
            });
        } catch (error) {
            console.error('Tracking failed:', error);
        }
    };

    const handleClick = async (e, link) => {
        e.preventDefault();
        await trackSocialClick(link);
        window.open(link.url, '_blank');
    };

    return (
        <div style={{
            position: 'fixed',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        }}>
            {socialLinks.map((link, index) => {
                const isHovered = hoveredId === index;

                return (
                    <div
                        key={index}
                        style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end'
                        }}
                        onMouseEnter={() => setHoveredId(index)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        <span
                            style={{
                                position: 'absolute',
                                right: '55px',
                                whiteSpace: 'nowrap',
                                backgroundColor: link.color,
                                color: 'white',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '500',
                                opacity: isHovered ? 1 : 0,
                                transform: isHovered ? 'translateX(0)' : 'translateX(10px)',
                                transition: 'all 0.3s ease',
                                pointerEvents: 'none',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                            }}
                        >
                            {link.name}
                        </span>
                        
                        <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => handleClick(e, link)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '44px',
                                height: '44px',
                                backgroundColor: isHovered ? link.color : '#1a1a2e',
                                borderRadius: '50%',
                                color: 'white',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease',
                                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                                boxShadow: isHovered ? `0 0 12px ${link.color}` : '0 4px 12px rgba(0,0,0,0.15)',
                                cursor: 'pointer'
                            }}
                        >
                            <FontAwesomeIcon icon={link.icon} style={{ fontSize: '20px' }} />
                        </a>
                    </div>
                );
            })}
        </div>
    );
};

export default SocialLinks;