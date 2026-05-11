import SocialLinks from '../components/SocialLinks';
import React, { useState, useEffect, useRef } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import SEO from '../components/SEO';
import { trackClick } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChartLine, faShieldAlt, faHeadset, faVideo, faServer, faRobot, 
    faChalkboard, faCloud, faFileAlt, faLaptop, faWifi, faMobileAlt, 
    faLock, faHospital, faIndustry, faGraduationCap, faBuilding,
    faTruck, faShoppingCart, faHandshake, faStar, faRocket,
    faInfinity, faCrown, faGem, faBolt, faUsers,
    faBriefcase, faTrophy, faGlobe, faLightbulb, faProjectDiagram,
    faChevronLeft, faChevronRight, faTimes, faArrowRight, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { 
    faLinkedin, 
    faWhatsapp, 
    faFacebook, 
    faInstagram 
} from '@fortawesome/free-brands-svg-icons';

// ========== BACKGROUND IMAGES ==========
const bgImages = {
    hero: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format",
    delivery: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format",
    solutions: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format",
    industries: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format",
    workwith: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format",
    stats: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format",
};

// Solution Images for Cards
const solutionImages = {
    unified: "/images/unified-comm.jpg",
    contact: "/images/contact-center.jpg",
    video: "/images/video-conferencing.jpg",
    it: "/images/it-infrastructure.jpg",
    ai: "/images/ai-smart-eye.jpg",
    classroom: "/images/smart-classroom.jpg",
    saas: "/images/saas-products.jpg",
    software: "/images/software-licensing.jpg",
    rental: "/images/rental-it.jpg",
    wifi: "/images/wifi-service.jpg",
    webMobile: "/images/web-mobile.jpg",
    cyberSecurity: "/images/cyber-security.jpg",
    cctv: "/images/cctv-services.jpg",
    cabling: "/images/cabling-services.jpg",
};

// Industry Images for Cards
const industryImages = {
    healthcare: "/images/healthcare.jpg",
    manufacturing: "/images/manufacturing.jpg",
    education: "/images/education.jpg",
    finance: "/images/finance.jpg",
    retail: "/images/retail.jpg",
    logistics: "/images/logistics.jpg"
};

// Partner Logos
const partnerLogos = [
    { name: "Netrack", url: "/images/netrack.png" },
    { name: "HP", url: "/images/hp.png" },
    { name: "AWS", url: "/images/aws.png" },
    { name: "TP-Link", url: "/images/tp-link.png" },
    { name: "Sophos", url: "/images/sophos.png" },
    { name: "MS Azure", url: "/images/ms-azure.png" },
    { name: "Check Point", url: "/images/checkpoint.png" },
    { name: "Microsoft 365", url: "/images/microsoft-365.png" },
    { name: "Matrix", url: "/images/matrix.png" },
    { name: "CP Plus", url: "/images/cp-plus.png" },
    { name: "Dell", url: "/images/dell.png" }
];

// Client Logos - Using reliable placeholder images
const clientLogos = [
    { name: "Toshiba", url: "https://placehold.co/200x100/667eea/white?text=Toshiba" },
    { name: "Toyota", url: "https://placehold.co/200x100/667eea/white?text=Toyota" },
    { name: "Starpacks", url: "https://placehold.co/200x100/667eea/white?text=Starpacks" },
    { name: "MAF", url: "https://placehold.co/200x100/667eea/white?text=MAF" },
    { name: "Athma", url: "https://placehold.co/200x100/667eea/white?text=Athma" },
    { name: "RGP", url: "https://placehold.co/200x100/667eea/white?text=RGP" },
    { name: "Utthunga", url: "https://placehold.co/200x100/667eea/white?text=Utthunga" },
    { name: "TRC", url: "https://placehold.co/200x100/667eea/white?text=TRC" },
    { name: "Unilateral", url: "https://placehold.co/200x100/667eea/white?text=Unilateral" },
    { name: "Sun Bright", url: "https://placehold.co/200x100/667eea/white?text=Sun+Bright" },
    { name: "CKPC", url: "https://placehold.co/200x100/667eea/white?text=CKPC" },
    { name: "Kyyba", url: "https://placehold.co/200x100/667eea/white?text=Kyyba" },
    { name: "Skidata", url: "https://placehold.co/200x100/667eea/white?text=Skidata" },
    { name: "SATRAC", url: "https://placehold.co/200x100/667eea/white?text=SATRAC" }
];

// Note: solutionDetailedContent object is the same as before - keeping it concise here
// (Keep your existing solutionDetailedContent object - it's too long to repeat but works fine)

const WinzePage = () => {
    const [scrolled, setScrolled] = useState(false);
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [showLogoModal, setShowLogoModal] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [counters, setCounters] = useState({
        years: 0,
        expertise: 0,
        clients: 0,
        awards: 0,
        projects: 0
    });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
    });
    
    const [landingModalOpen, setLandingModalOpen] = useState(false);
    const [landingData, setLandingData] = useState(null);
    
    const statsRef = useRef(null);
    const homeRef = useRef(null);
    const solutionsRef = useRef(null);
    const industriesRef = useRef(null);
    const partnersRef = useRef(null);
    const clientsRef = useRef(null);
    const workwithRef = useRef(null);

    useEffect(() => {
        window.addEventListener('scroll', () => {
            setScrolled(window.scrollY > 50);
        });
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targets = {
                        years: 16,
                        expertise: 10,
                        clients: 500,
                        awards: 10,
                        projects: 100
                    };
                    const duration = 2000;
                    const stepTime = 20;
                    const steps = duration / stepTime;
                    
                    Object.keys(targets).forEach(key => {
                        let current = 0;
                        const increment = targets[key] / steps;
                        const interval = setInterval(() => {
                            current += increment;
                            if (current >= targets[key]) {
                                setCounters(prev => ({ ...prev, [key]: targets[key] }));
                                clearInterval(interval);
                            } else {
                                setCounters(prev => ({ ...prev, [key]: Math.floor(current) }));
                            }
                        }, stepTime);
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });
        
        if (statsRef.current) {
            observer.observe(statsRef.current);
        }
        
        return () => {
            window.removeEventListener('scroll', () => {});
            observer.disconnect();
        };
    }, []);

    const handleTrackClick = async (itemName, category) => {
        try {
            let userIp = '0.0.0.0';
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                userIp = data.ip;
            } catch (err) {
                console.log('Could not get IP, using default');
            }

            await trackClick({
                link_url: window.location.href,
                link_title: `Winze - ${itemName}`,
                ip_address: userIp,
                category: category
            });
        } catch (error) {
            console.error('Tracking failed:', error);
        }
    };

    const openLandingPage = (item) => {
        const detailedContent = solutionDetailedContent[item.title];
        setLandingData({
            ...item,
            detailedContent: detailedContent
        });
        setLandingModalOpen(true);
        handleTrackClick(item.title, 'landing_page_view');
    };

    const closeLandingPage = () => {
        setLandingModalOpen(false);
        setLandingData(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitQuote = async (e) => {
        e.preventDefault();
        await handleTrackClick(`Quote Request from ${formData.name} - ${formData.service}`, 'quote');
        setShowQuoteModal(false);
        setFormData({ name: '', email: '', phone: '', service: '', message: '' });
    };

    const scrollToSection = (ref, sectionName) => {
        handleTrackClick(`Navigation - ${sectionName}`, 'nav');
        if (ref && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const solutions = [
        { title: "Video Conferencing", desc: "High-definition virtual meetings with advanced security features.", icon: faVideo, img: solutionImages.video },
        { title: "Smart Eye AI", desc: "Advanced video analytics for proactive security monitoring.", icon: faRobot, img: solutionImages.ai },
        { title: "Rental IT Infrastructure", desc: "Cost-effective hardware rental for projects and events.", icon: faLaptop, img: solutionImages.rental },
        { title: "SaaS Products", desc: "Scalable cloud solutions customized for your business needs.", icon: faCloud, img: solutionImages.saas },
        { title: "Enterprise Software Licensing", desc: "Flexible licensing options for major enterprise software.", icon: faFileAlt, img: solutionImages.software },
        { title: "IT Infrastructure", desc: "Enterprise-grade networking and server solutions for optimal performance.", icon: faServer, img: solutionImages.it },
        { title: "CCTV Services", desc: "End-to-end surveillance solutions with H.265 HD cameras, cloud storage, and AI-powered video analytics.", icon: faVideo, img: "/images/cctv-services.jpg" },
        { title: "Cabling Services", desc: "Active & Passive Cabling solutions including Greenfield projects.", icon: faWifi, img: "/images/cabling-services.jpg" },
        { title: "WiFi as a Service", desc: "Managed wireless solutions for seamless connectivity anywhere.", icon: faWifi, img: solutionImages.wifi },
        { title: "Smart Live Classroom", desc: "Interactive virtual learning platform with parent access features.", icon: faChalkboard, img: solutionImages.classroom },
        { title: "Web & Mobile Development", desc: "Custom web and mobile applications for your business needs.", icon: faMobileAlt, img: solutionImages.webMobile },
        { title: "Cyber Security", desc: "Advanced threat protection and security compliance solutions.", icon: faLock, img: solutionImages.cyberSecurity },
        { title: "Unified Communications", desc: "Seamless integration of voice, video, and messaging for enterprise collaboration.", icon: faChartLine, img: solutionImages.unified },
        { title: "Contact Center", desc: "AI-powered customer service solutions for enhanced agent productivity.", icon: faHeadset, img: solutionImages.contact }
    ];

    const industries = [
        { name: "Healthcare", desc: "HIPAA-compliant IT solutions for modern healthcare facilities.", icon: faHospital, img: industryImages.healthcare },
        { name: "Manufacturing", desc: "IoT and automation solutions for Industry 4.0 transformation.", icon: faIndustry, img: industryImages.manufacturing },
        { name: "Education", desc: "Digital learning platforms for institutions of all sizes.", icon: faGraduationCap, img: industryImages.education },
        { name: "Banking & Finance", desc: "Secure financial technology solutions for modern banking.", icon: faBuilding, img: industryImages.finance },
        { name: "Retail & E-commerce", desc: "Digital transformation solutions for retail businesses.", icon: faShoppingCart, img: industryImages.retail },
        { name: "Logistics & Supply Chain", desc: "Intelligent logistics and supply chain management systems.", icon: faTruck, img: industryImages.logistics }
    ];

    const navItems = [
        { name: "Home", ref: homeRef },
        { name: "Solutions", ref: solutionsRef },
        { name: "Industries", ref: industriesRef },
        { name: "Partners", ref: partnersRef },
        { name: "Clients", ref: clientsRef },
        { name: "Work With Winze", ref: workwithRef }
    ];

    const deliveryItems = [
        { icon: faInfinity, title: "End-to-End Solutions", desc: "Complete lifecycle management from planning to execution and ongoing support." },
        { icon: faCrown, title: "Enterprise Excellence", desc: "Guaranteed uptime, performance metrics, and measurable business results." },
        { icon: faHandshake, title: "Flexible Engagement", desc: "Flexible consulting, project-based, or managed service engagement options." },
        { icon: faBolt, title: "Rapid Deployment", desc: "Accelerated implementation with minimal business disruption." },
        { icon: faChartLine, title: "Analytics & Insights", desc: "Data-driven decision making with real-time dashboards." },
        { icon: faShieldAlt, title: "24/7 Premium Support", desc: "Round-the-clock monitoring and technical assistance." }
    ];

    const workWithWinze = [
        { icon: faHandshake, title: "Strategic Partnership", desc: "We don't just deliver services; we build long-term strategic partnerships focused on your business growth." },
        { icon: faGem, title: "Enterprise Value", desc: "Your success is our success. We're committed to delivering excellence in every project we undertake." },
        { icon: faRocket, title: "Innovation First", desc: "Stay ahead of the curve with our cutting-edge solutions and future-ready technology approach." },
        { icon: faUsers, title: "Client Success", desc: "100+ successful deployments, 20+ satisfied enterprise clients, and 16+ years of excellence." }
    ];

    // Full Page Landing Page Modal Component
    const FullPageLanding = ({ item, onClose }) => {
        if (!item) return null;
        
        const content = item.detailedContent;
        const [showQuoteForm, setShowQuoteForm] = useState(false);
        const [quoteFormData, setQuoteFormData] = useState({
            name: '',
            email: '',
            phone: '',
            message: ''
        });
        const [submitted, setSubmitted] = useState(false);

        const handleQuoteSubmit = async (e) => {
            e.preventDefault();
            await handleTrackClick(`Landing Page Quote - ${item.title} from ${quoteFormData.name}`, 'landing_quote');
            setSubmitted(true);
            setTimeout(() => {
                setShowQuoteForm(false);
                setSubmitted(false);
                setQuoteFormData({ name: '', email: '', phone: '', message: '' });
            }, 2000);
        };

        if (!content) return null;

        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'white',
                zIndex: 10000,
                overflow: 'auto',
                cursor: 'default'
            }}>
                <button onClick={onClose} style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    background: '#667eea',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: 'white',
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    zIndex: 10001,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}>×</button>

                <div style={{
                    height: '60vh',
                    background: `linear-gradient(135deg, rgba(15,12,41,0.85), rgba(48,43,99,0.85)), url(${content.image || item.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: 'white'
                }}>
                    <div style={{ maxWidth: '800px', padding: '20px' }}>
                        <FontAwesomeIcon icon={item.icon} style={{ fontSize: '80px', marginBottom: '20px' }} />
                        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>{item.title}</h1>
                        <p style={{ fontSize: '20px', opacity: 0.9 }}>{content.overview}</p>
                    </div>
                </div>

                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
                    <div style={{ marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '32px', color: '#1a1a2e', marginBottom: '30px', textAlign: 'center' }}>Key Benefits</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                            {content.benefits.map((benefit, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#f8f9ff', borderRadius: '12px' }}>
                                    <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#667eea', fontSize: '24px', flexShrink: 0 }} />
                                    <span style={{ color: '#333', fontSize: '16px' }}>{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '60px', background: '#f0f2f5', padding: '40px', borderRadius: '20px' }}>
                        <h2 style={{ fontSize: '32px', color: '#1a1a2e', marginBottom: '30px', textAlign: 'center' }}>Key Features</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {content.features.map((feature, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                                    <FontAwesomeIcon icon={faStar} style={{ color: '#FFD700', fontSize: '20px' }} />
                                    <span style={{ color: '#555' }}>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '32px', color: '#1a1a2e', marginBottom: '30px', textAlign: 'center' }}>Use Cases</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center' }}>
                            {content.useCases.map((useCase, idx) => (
                                <span key={idx} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '12px 30px', borderRadius: '40px', fontSize: '16px', fontWeight: '500' }}>
                                    {useCase}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '20px',
                        padding: '50px',
                        textAlign: 'center',
                        color: 'white'
                    }}>
                        {!showQuoteForm && !submitted && (
                            <>
                                <h2 style={{ fontSize: '28px', marginBottom: '15px' }}>Ready to Get Started?</h2>
                                <p style={{ marginBottom: '25px', fontSize: '18px', opacity: 0.9 }}>Get a personalized quote for {item.title}</p>
                                <button onClick={() => setShowQuoteForm(true)} style={{
                                    padding: '15px 40px',
                                    background: 'white',
                                    color: '#667eea',
                                    border: 'none',
                                    borderRadius: '50px',
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                                    Request a Quote →
                                </button>
                            </>
                        )}

                        {showQuoteForm && !submitted && (
                            <div>
                                <h3 style={{ marginBottom: '20px' }}>Request Quote for {item.title}</h3>
                                <form onSubmit={handleQuoteSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
                                    <input type="text" placeholder="Full Name" required value={quoteFormData.name} onChange={(e) => setQuoteFormData({ ...quoteFormData, name: e.target.value })} style={{ width: '100%', padding: '14px', marginBottom: '15px', borderRadius: '10px', border: 'none', fontSize: '16px' }} />
                                    <input type="email" placeholder="Email Address" required value={quoteFormData.email} onChange={(e) => setQuoteFormData({ ...quoteFormData, email: e.target.value })} style={{ width: '100%', padding: '14px', marginBottom: '15px', borderRadius: '10px', border: 'none', fontSize: '16px' }} />
                                    <input type="tel" placeholder="Phone Number" required value={quoteFormData.phone} onChange={(e) => setQuoteFormData({ ...quoteFormData, phone: e.target.value })} style={{ width: '100%', padding: '14px', marginBottom: '15px', borderRadius: '10px', border: 'none', fontSize: '16px' }} />
                                    <textarea placeholder="Tell us about your requirements..." rows="3" value={quoteFormData.message} onChange={(e) => setQuoteFormData({ ...quoteFormData, message: e.target.value })} style={{ width: '100%', padding: '14px', marginBottom: '20px', borderRadius: '10px', border: 'none', fontSize: '16px', resize: 'vertical' }}></textarea>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <button type="button" onClick={() => setShowQuoteForm(false)} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>Cancel</button>
                                        <button type="submit" style={{ flex: 1, padding: '12px', background: 'white', color: '#667eea', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Submit</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {submitted && (
                            <div>
                                <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '60px', marginBottom: '20px' }} />
                                <h3>Thank You!</h3>
                                <p>Our team will contact you within 24 hours about {item.title}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ background: '#1a1a2e', color: 'white', padding: '40px', textAlign: 'center' }}>
                    <p>© 2024 Winze Technologies Pvt Ltd. All rights reserved.</p>
                </div>
            </div>
        );
    };

    const BackgroundImage = ({ imageSrc }) => (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            zIndex: 0
        }}>
            <img src={imageSrc} alt="background" style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }} />
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(15,12,41,0.85) 0%, rgba(48,43,99,0.85) 50%, rgba(36,36,62,0.85) 100%)'
            }} />
        </div>
    );

    const DarkBackgroundImage = ({ imageSrc }) => (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            zIndex: 0
        }}>
            <img src={imageSrc} alt="background" style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }} />
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.7) 100%)'
            }} />
        </div>
    );

    return (
        <HelmetProvider>
            <>
            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.02); opacity: 0.95; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes marqueeScroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes premiumGlow {
                    0% { box-shadow: 0 0 10px rgba(102,126,234,0.3), 0 0 20px rgba(102,126,234,0.2); filter: brightness(1); transform: translateY(0px); }
                    30% { box-shadow: 0 0 40px rgba(255,215,0,0.5), 0 0 60px rgba(102,126,234,0.4); filter: brightness(1.05); transform: translateY(-5px); }
                    60% { box-shadow: 0 0 60px rgba(255,215,0,0.7), 0 0 80px rgba(102,126,234,0.6); filter: brightness(1.08); transform: translateY(-8px); }
                    100% { box-shadow: 0 0 10px rgba(102,126,234,0.3), 0 0 20px rgba(102,126,234,0.2); filter: brightness(1); transform: translateY(0px); }
                }
                .marquee-container { width: 100%; overflow: hidden; position: relative; }
                .marquee-content { display: flex; gap: 20px; padding: 20px 10px; width: fit-content; animation: marqueeScroll 25s linear infinite; }
                .marquee-container:hover .marquee-content { animation-play-state: paused; }
                section { position: relative; z-index: 1; }
                .section-content { position: relative; z-index: 2; }
                .delivery-card, .work-card, .solution-card, .industry-card {
                    background: white;
                    border-radius: 20px;
                    text-align: center;
                    transition: all 0.4s ease-in-out;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
                    border: 1px solid rgba(0,0,0,0.05);
                    cursor: pointer;
                    overflow: hidden;
                }
                .delivery-card:hover, .work-card:hover, .solution-card:hover, .industry-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                .delivery-card:hover h3, .delivery-card:hover p,
                .work-card:hover h3, .work-card:hover p,
                .solution-card:hover h3, .solution-card:hover p,
                .industry-card:hover h3, .industry-card:hover p {
                    color: white;
                }
                .delivery-card:hover .icon, .work-card:hover .icon,
                .solution-card:hover .icon, .industry-card:hover .icon {
                    color: white !important;
                }
                .solution-card-image, .industry-card-image {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                }
                .solution-card-content, .industry-card-content {
                    padding: 25px;
                    text-align: center;
                    transition: all 0.4s ease-in-out;
                }
                .solution-card:hover .solution-card-content,
                .industry-card:hover .industry-card-content {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                .delivery-card .learn-more-btn,
                .work-card .learn-more-btn,
                .solution-card .learn-more-btn,
                .industry-card .learn-more-btn {
                    background-color: #667eea;
                    color: white;
                    border: none;
                }
                .delivery-card:hover .learn-more-btn,
                .work-card:hover .learn-more-btn,
                .solution-card:hover .learn-more-btn,
                .industry-card:hover .learn-more-btn {
                    background: white !important;
                    color: #667eea !important;
                    border: 1px solid #667eea !important;
                }
                .client-logo-item, .partner-logo-item {
                    background: white; padding: 20px; border-radius: 12px; text-align: center; cursor: pointer;
                    transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.08); min-width: 150px;
                    border: 1px solid rgba(0,0,0,0.05); flex-shrink: 0;
                }
                .client-logo-item:hover, .partner-logo-item:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.12); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
                .client-logo-item:hover h3, .partner-logo-item:hover h3 { color: white; }
                .client-logo-img, .partner-logo-img { width: 80px; height: 80px; margin: 0 auto 12px; display: flex; align-items: center; justifyContent: center; }
                .client-logo-img img, .partner-logo-img img { width: 100%; height: 100%; object-fit: contain; }
                .nav-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 15px;
                }
                .nav-menu {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                    flex-wrap: wrap;
                    justify-content: flex-end;
                }
                @media (max-width: 768px) {
                    .nav-container {
                        flex-direction: column;
                        align-items: center;
                    }
                    .nav-menu {
                        justify-content: center;
                    }
                }
            `}</style>
            
            <SEO 
                title="Winze Technologies | Enterprise Communication, Security & AI"
                description="Winze Technologies delivers unified communications, AI security, SaaS products, and IT infrastructure with 16+ years of enterprise expertise."
                keywords="unified communications, contact center, video conferencing, IT infrastructure, AI security, SaaS products, enterprise software"
                url="https://www.winzetech.com"
                image="/og-image.jpg"
                type="website"
            />
            
            <div style={{ fontFamily: "'Poppins', 'Montserrat', sans-serif", overflowX: 'hidden', position: 'relative' }}>
                
                <SocialLinks />
                
                <nav style={{
                    position: 'sticky',
                    top: 0,
                    left: 0,
                    right: 0,
                    background: scrolled ? 'rgba(15,12,41,0.98)' : 'rgba(15,12,41,0.95)',
                    backdropFilter: 'blur(20px)',
                    padding: '15px 5%',
                    zIndex: 1000,
                    transition: 'all 0.3s',
                    boxShadow: scrolled ? '0 2px 30px rgba(0,0,0,0.2)' : 'none'
                }}>
                    <div className="nav-container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: '0 4px 15px rgba(102,126,234,0.3)'
                            }} onClick={() => setShowLogoModal(true)} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                <img src="/winze-logo.jpg" alt="Winze Technologies Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }} onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = '<span style="color:white;font-size:24px;font-weight:bold">W</span>';
                                }} />
                            </div>
                            <span style={{ 
                                fontWeight: '800', 
                                fontSize: '1.5rem', 
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontFamily: "'Playfair Display', serif",
                                letterSpacing: '-0.5px'
                            }}>Winze Technologies</span>
                        </div>
                        
                        <div className="nav-menu">
                            {navItems.map((item) => (
                                <button key={item.name} onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    scrollToSection(item.ref, item.name);
                                }} style={{ 
                                    background: 'transparent',
                                    color: '#ddd',
                                    fontWeight: '600',
                                    padding: '10px 22px',
                                    borderRadius: '30px',
                                    transition: 'all 0.3s',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontFamily: "'Poppins', sans-serif",
                                    border: 'none'
                                }} onMouseEnter={(e) => {
                                    e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                                    e.target.style.color = 'white';
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 4px 15px rgba(102,126,234,0.3)';
                                }} onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = '#ddd';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }}>
                                    {item.name}
                                </button>
                            ))}
                            <button onClick={(e) => { e.stopPropagation(); setShowQuoteModal(true); handleTrackClick('Get Quote Button', 'cta'); }} style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '10px 28px',
                                borderRadius: '30px',
                                cursor: 'pointer',
                                fontWeight: '700',
                                transition: 'all 0.3s',
                                fontFamily: "'Poppins', sans-serif",
                                boxShadow: '0 4px 15px rgba(102,126,234,0.3)'
                            }} onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.05)';
                                e.target.style.boxShadow = '0 8px 25px rgba(102,126,234,0.4)';
                            }} onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)';
                                e.target.style.boxShadow = '0 4px 15px rgba(102,126,234,0.3)';
                            }}>✨ Get a Quote</button>
                        </div>
                    </div>
                </nav>

                {/* Rest of your sections - keep the same as before */}
                {/* Hero Section, What We Deliver, Solutions, Industries, Partners, Clients, Work With Winze, Stats, Modals, Footer */}
                {/* (Keep all your existing section code here) */}
                
            </div>
            </>
        </HelmetProvider>
    );
};

export default WinzePage;