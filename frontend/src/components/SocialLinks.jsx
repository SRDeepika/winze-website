import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faWhatsapp, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';

const SocialLinks = () => {
    const socialLinks = [
        { name: 'LinkedIn', icon: faLinkedin, url: 'https://www.linkedin.com/company/winze-technologies', color: '#0077b5' },
        { name: 'WhatsApp', icon: faWhatsapp, url: 'https://wa.me/919880010417', color: '#25D366' },
        { name: 'Facebook', icon: faFacebook, url: 'https://www.facebook.com/winzetechnologies', color: '#1877f2' },
        { name: 'Instagram', icon: faInstagram, url: 'https://www.instagram.com/winzetechnologies', color: '#e4405f' }
    ];

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
            {socialLinks.map((link, index) => (
                <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        background: link.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '22px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                        textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
                    }}
                >
                    <FontAwesomeIcon icon={link.icon} />
                </a>
            ))}
        </div>
    );
};

export default SocialLinks;