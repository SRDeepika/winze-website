import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faLinkedin, 
    faWhatsapp, 
    faFacebook, 
    faInstagram
} from '@fortawesome/free-brands-svg-icons';

// Icon mapping
const iconMap = {
    'faLinkedin': faLinkedin,
    'faWhatsapp': faWhatsapp,
    'faFacebook': faFacebook,
    'faInstagram': faInstagram,
    'linkedin': faLinkedin,
    'whatsapp': faWhatsapp,
    'facebook': faFacebook,
    'instagram': faInstagram
};

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
                link_url: link.platform_url,
                link_title: `Social: ${link.platform_name}`,
                ip_address: ip
            })
        });
    } catch (error) {
        console.error('Tracking failed:', error);
    }
};

const SocialLinks = () => {
    const [hoveredId, setHoveredId] = useState(null);
    const [socialLinks, setSocialLinks] = useState([
        { id: 1, platform_name: "LinkedIn", platform_url: "https://www.linkedin.com/company/winze-technologies", icon: faLinkedin, color: "#0077b5", display_order: 1 },
        { id: 2, platform_name: "WhatsApp", platform_url: "https://wa.me/919880010417", icon: faWhatsapp, color: "#25D366", display_order: 2 },
        { id: 3, platform_name: "Facebook", platform_url: "https://www.facebook.com/winzetechnologies", icon: faFacebook, color: "#1877f2", display_order: 3 },
        { id: 4, platform_name: "Instagram", platform_url: "https://www.instagram.com/winzetechnologies", icon: faInstagram, color: "#e4405f", display_order: 4 }
    ]);

    // Fetch social links from API
    useEffect(() => {
        const fetchSocialLinks = async () => {
            try {
                const response = await fetch('https://winze-backend-api.onrender.com/api/social-links');
                const data = await response.json();
                if (data.success && data.links && data.links.length > 0) {
                    const formattedLinks = data.links.map(link => {
                        let icon = null;
                        const platformLower = link.platform_name.toLowerCase();
                        if (platformLower === 'linkedin') icon = faLinkedin;
                        else if (platformLower === 'whatsapp') icon = faWhatsapp;
                        else if (platformLower === 'facebook') icon = faFacebook;
                        else if (platformLower === 'instagram') icon = faInstagram;
                        
                        return {
                            id: link.id,
                            platform_name: link.platform_name,
                            platform_url: link.platform_url,
                            icon: icon || faLinkedin,
                            color: link.color_code || '#0077b5',
                            display_order: link.display_order
                        };
                    });
                    setSocialLinks(formattedLinks.sort((a, b) => a.display_order - b.display_order));
                }
            } catch (error) {
                console.error('Error fetching social links:', error);
            }
        };
        
        fetchSocialLinks();
    }, []);

    const handleClick = async (e, link) => {
        e.preventDefault();
        await trackSocialClick(link);
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