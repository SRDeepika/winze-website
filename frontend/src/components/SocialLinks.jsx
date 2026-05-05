import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faLinkedin, 
    faWhatsapp, 
    faFacebook, 
    faInstagram,
    faTwitter,
    faYoutube
} from '@fortawesome/free-brands-svg-icons';
import { socialLinkService } from '../services/socialLinkService';

const iconMap = {
    'faLinkedin': faLinkedin,
    'faWhatsapp': faWhatsapp,
    'faFacebook': faFacebook,
    'faInstagram': faInstagram,
    'faTwitter': faTwitter,
    'faYoutube': faYoutube
};

const SocialLinks = () => {
    const [socialLinks, setSocialLinks] = useState([]);
    const [hoveredId, setHoveredId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSocialLinks();
    }, []);

    const loadSocialLinks = async () => {
        const links = await socialLinkService.getAll();
        setSocialLinks(links);
        setLoading(false);
    };

    if (loading) {
        return null; // or a loading spinner
    }

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
            gap: '15px'
        }}>
            {socialLinks.map((link) => {
                const Icon = iconMap[link.icon_class] || faLinkedin;
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
                                right: '60px',
                                whiteSpace: 'nowrap',
                                backgroundColor: link.color_code,
                                color: 'white',
                                padding: '8px 15px',
                                borderRadius: '25px',
                                fontSize: '14px',
                                fontWeight: '500',
                                opacity: isHovered ? 1 : 0,
                                transform: isHovered ? 'translateX(0)' : 'translateX(20px)',
                                transition: 'all 0.3s ease',
                                pointerEvents: 'none',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                            }}
                        >
                            {link.platform_name}
                        </span>
                        <a
                            href={link.platform_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '45px',
                                height: '45px',
                                backgroundColor: isHovered ? link.color_code : '#1a1a2e',
                                borderRadius: '50%',
                                color: 'white',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease',
                                transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                                boxShadow: isHovered ? `0 0 15px ${link.color_code}` : '0 4px 15px rgba(0,0,0,0.2)'
                            }}
                        >
                            <FontAwesomeIcon icon={Icon} style={{ fontSize: '22px' }} />
                        </a>
                    </div>
                );
            })}
        </div>
    );
};

export default SocialLinks;