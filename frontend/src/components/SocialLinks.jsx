import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faLinkedin, 
    faWhatsapp, 
    faFacebook, 
    faInstagram
} from '@fortawesome/free-brands-svg-icons';

const SocialLinks = () => {
    const [hoveredId, setHoveredId] = useState(null);
    const [socialLinks, setSocialLinks] = useState([
        {
            id: 20,
            name: 'LinkedIn',
            url: 'https://www.linkedin.com/company/winze-technologies',
            icon: faLinkedin,
            color: '#0077b5',
            order: 1
        },
        {
            id: 21,
            name: 'WhatsApp',
            url: 'https://wa.me/919880010417',
            icon: faWhatsapp,
            color: '#25D366',
            order: 2
        },
        {
            id: 22,
            name: 'Facebook',
            url: 'https://www.facebook.com/winzetechnologies',
            icon: faFacebook,
            color: '#1877f2',
            order: 3
        },
        {
            id: 23,
            name: 'Instagram',
            url: 'https://www.instagram.com/winzetechnologies',
            icon: faInstagram,
            color: '#e4405f',
            order: 4
        }
    ]);

    useEffect(() => {
        fetchSocialLinks();
    }, []);

    const fetchSocialLinks = async () => {
        try {
            const response = await fetch('https://winze-backend-api.onrender.com/api/social-links');
            const data = await response.json();
            
            if (data.success && data.links) {
                const links = data.links.map(link => {
                    let icon;
                    const name = link.platform_name.toLowerCase();
                    if (name === 'linkedin') icon = faLinkedin;
                    else if (name === 'whatsapp') icon = faWhatsapp;
                    else if (name === 'facebook') icon = faFacebook;
                    else if (name === 'instagram') icon = faInstagram;
                    
                    return {
                        id: link.id,
                        name: link.platform_name,
                        url: link.platform_url,
                        icon: icon,
                        color: link.color_code,
                        order: link.display_order
                    };
                });
                links.sort((a, b) => a.order - b.order);
                setSocialLinks(links);
            }
        } catch (error) {
            console.error('Error fetching social links:', error);
        }
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

    if (socialLinks.length === 0) {
        return null;
    }

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
                                fontWeight: '600',
                                opacity: isHovered ? 1 : 0,
                                transform: isHovered ? 'translateX(0)' : 'translateX(10px)',
                                transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                                pointerEvents: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                                zIndex: 10
                            }}
                        >
                            {link.name}
                        </span>
                        
                        <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => handleClick(e, link)}
                            onMouseEnter={() => setHoveredId(link.id)}
                            onMouseLeave={() => setHoveredId(null)}
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
                                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                                boxShadow: isHovered ? `0 0 12px ${link.color}` : '0 4px 12px rgba(0,0,0,0.15)',
                                cursor: 'pointer',
                                border: '1px solid rgba(255, 255, 255, 0.08)'
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