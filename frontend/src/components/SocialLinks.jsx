import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faLinkedin, 
    faWhatsapp, 
    faFacebook, 
    faInstagram
} from '@fortawesome/free-brands-svg-icons';

// Hardcoded social links (same as before - no backend needed)
const socialLinks = [
    { id: 1, platform_name: "LinkedIn", platform_url: "https://www.linkedin.com/company/winze-technologies", icon: faLinkedin, color: "#0077b5" },
    { id: 2, platform_name: "WhatsApp", platform_url: "https://wa.me/919880010417", icon: faWhatsapp, color: "#25D366" },
    { id: 3, platform_name: "Facebook", platform_url: "https://www.facebook.com/winzetechnologies", icon: faFacebook, color: "#1877f2" },
    { id: 4, platform_name: "Instagram", platform_url: "https://www.instagram.com/winzetechnologies", icon: faInstagram, color: "#e4405f" }
];

const SocialLinks = () => {
    const [hoveredId, setHoveredId] = useState(null);

    const handleClick = (e, link) => {
        e.preventDefault();
        // Track click locally
        console.log(`Clicked ${link.platform_name}`);
        setTimeout(() => {
            window.open(link.platform_url, '_blank');
        }, 100);
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
            {socialLinks.map((link) => {
                const isHovered = hoveredId === link.id;

                return (
                    <div
                        key={link.id}
                        style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end'
                        }}
                        onMouseEnter={() => setHoveredId(link.id)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        {/* Tooltip that appears on the left side when hovering */}
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
                            {link.platform_name}
                        </span>
                        
                        {/* Floating button */}
                        <a
                            href={link.platform_url}
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