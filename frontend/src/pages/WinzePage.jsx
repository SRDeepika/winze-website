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
    faChevronLeft, faChevronRight, faTimes, faArrowRight
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
    rentPbx: "/images/rent-ip-pbx.jpg" 
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

// Company Logos
const clientLogos = [
    { name: "Netrack", url: "/images/netrack.png" },
    { name: "HP", url: "/images/hp.png" },
    { name: "AWS", url: "/images/aws.png" },
    { name: "TP-Link", url: "/images/tp-link.png" },
    { name: "Cisco", url: "/images/cisco.png" },
    { name: "Sophos", url: "/images/sophos.png" },
    { name: "MS Azure", url: "/images/ms-azure.png" },
    { name: "Check Point", url: "/images/checkpoint.png" },
    { name: "Microsoft 365", url: "/images/microsoft-365.png" },
    { name: "Narayana Health", url: "/images/narayana-health.png" },
    { name: "Matrix", url: "/images/matrix.png" },
    { name: "CP Plus", url: "/images/cp-plus.png" },
    { name: "Dell", url: "/images/dell.png" }
];

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
    
    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    
    const statsRef = useRef(null);
    const homeRef = useRef(null);
    const solutionsRef = useRef(null);
    const industriesRef = useRef(null);
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

    const openModal = (item) => {
        setModalData(item);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalData(null);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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
        { title: "Unified Communications", desc: "Seamless integration of voice, video, and messaging for enterprise collaboration.", icon: faChartLine, img: solutionImages.unified, detailedDesc: "Our Unified Communications solution brings together voice, video, messaging, and collaboration tools into a single platform with enterprise-grade security, 99.9% uptime, and 24/7 support. Features include: HD video conferencing, instant messaging, file sharing, and mobile accessibility." },
        { title: "Contact Center", desc: "AI-powered customer service solutions for enhanced agent productivity.", icon: faHeadset, img: solutionImages.contact, detailedDesc: "AI-powered contact center solutions with intelligent routing, chatbots, sentiment analysis, real-time analytics, and omnichannel support including voice, email, chat, and social media." },
        { title: "Video Conferencing", desc: "High-definition virtual meetings with advanced security features.", icon: faVideo, img: solutionImages.video, detailedDesc: "HD video conferencing with screen sharing, recording, virtual backgrounds, breakout rooms, end-to-end encryption, and integration with popular calendar apps." },
        { title: "IT Infrastructure", desc: "Enterprise-grade networking and server solutions for optimal performance.", icon: faServer, img: solutionImages.it, detailedDesc: "Complete IT infrastructure solutions including servers, networking equipment, storage systems, cloud integration, and 24/7 monitoring with proactive maintenance." },
        { title: "Smart Eye AI", desc: "Advanced video analytics for proactive security monitoring.", icon: faRobot, img: solutionImages.ai, detailedDesc: "AI-powered video analytics for real-time threat detection, facial recognition, license plate recognition, anomaly detection, and automated alerts with mobile notifications." },
        { title: "Smart Live Classroom", desc: "Interactive virtual learning platform with parent access features.", icon: faChalkboard, img: solutionImages.classroom, detailedDesc: "Virtual classroom platform with live video, interactive whiteboard, attendance tracking, assignment management, parent portal, and performance analytics." },
        { title: "SaaS Products", desc: "Scalable cloud solutions customized for your business needs.", icon: faCloud, img: solutionImages.saas, detailedDesc: "Custom SaaS solutions with scalable architecture, pay-as-you-go pricing, automatic updates, data encryption, and dedicated support for your business needs." },
        { title: "Enterprise Software Licensing", desc: "Flexible licensing options for major enterprise software.", icon: faFileAlt, img: solutionImages.software, detailedDesc: "Flexible licensing for Microsoft, Adobe, Oracle, SAP, and other leading vendors with volume discounts, compliance management, and dedicated account management." },
        { title: "Rental IT Infrastructure", desc: "Cost-effective hardware rental for projects and events.", icon: faLaptop, img: solutionImages.rental, detailedDesc: "Short-term and long-term IT equipment rental including laptops, desktops, servers, networking equipment, and AV gear with delivery, setup, and support included." },
        { title: "WiFi as a Service", desc: "Managed wireless solutions for seamless connectivity anywhere.", icon: faWifi, img: solutionImages.wifi, detailedDesc: "Managed WiFi solutions with enterprise-grade security, guest access, bandwidth management, usage analytics, and 24/7 support for offices, events, and public spaces." },
        { title: "Web & Mobile Development", desc: "Custom web and mobile applications for your business needs.", icon: faMobileAlt, img: solutionImages.webMobile, detailedDesc: "Custom web and mobile application development using React, Node.js, Flutter, and other modern technologies with responsive design, API integration, and ongoing maintenance." },
        { title: "Cyber Security", desc: "Advanced threat protection and security compliance solutions.", icon: faLock, img: solutionImages.cyberSecurity, detailedDesc: "Comprehensive cyber security solutions including threat detection, vulnerability assessments, compliance management (GDPR, HIPAA, PCI-DSS), security audits, and employee training." },
        { title: "CCTV Services", desc: "End-to-end surveillance solutions with H.265 HD cameras, cloud storage, and AI-powered video analytics.", icon: faVideo, img: "/images/cctv-services.jpg", detailedDesc: "Complete CCTV surveillance solutions with H.265 HD cameras, night vision, motion detection, cloud storage, mobile viewing, and AI-powered analytics for proactive security." },
        { title: "Cabling Services", desc: "Active & Passive Cabling solutions including Greenfield projects.", icon: faWifi, img: "/images/cabling-services.jpg", detailedDesc: "Professional structured cabling for data centers, offices, and industrial facilities including fiber optics, copper cabling, cable management, and certification testing." },
        { title: "Rent IP PBX System", desc: "Cost-effective cloud-based IP PBX phone system rental.", icon: faHeadset, img: "/images/rent-ip-pbx.jpg", detailedDesc: "Cloud-based IP PBX phone system with auto-attendant, call routing, voicemail to email, call recording, conferencing, and multi-branch connectivity on flexible rental terms." }
    ];

    const industries = [
        { name: "Healthcare", desc: "HIPAA-compliant IT solutions for modern healthcare facilities.", icon: faHospital, img: industryImages.healthcare, detailedDesc: "HIPAA-compliant healthcare IT solutions including telemedicine platforms, EHR systems, patient portals, secure messaging, and remote patient monitoring with 99.9% uptime." },
        { name: "Manufacturing", desc: "IoT and automation solutions for Industry 4.0 transformation.", icon: faIndustry, img: industryImages.manufacturing, detailedDesc: "Industry 4.0 solutions including IoT sensors, SCADA systems, predictive maintenance, real-time production monitoring, and supply chain integration for smart manufacturing." },
        { name: "Education", desc: "Digital learning platforms for institutions of all sizes.", icon: faGraduationCap, img: industryImages.education, detailedDesc: "Digital learning platforms with virtual classrooms, learning management systems, student information systems, parent portals, and analytics for K-12 and higher education." },
        { name: "Banking & Finance", desc: "Secure financial technology solutions for modern banking.", icon: faBuilding, img: industryImages.finance, detailedDesc: "Secure fintech solutions including digital banking platforms, payment gateways, fraud detection systems, compliance management, and data analytics for financial institutions." },
        { name: "Retail & E-commerce", desc: "Digital transformation solutions for retail businesses.", icon: faShoppingCart, img: industryImages.retail, detailedDesc: "Retail digital transformation including POS systems, inventory management, e-commerce platforms, customer analytics, loyalty programs, and omnichannel integration." },
        { name: "Logistics & Supply Chain", desc: "Intelligent logistics and supply chain management systems.", icon: faTruck, img: industryImages.logistics, detailedDesc: "Intelligent logistics solutions with real-time tracking, route optimization, warehouse management, inventory forecasting, and supply chain analytics for improved efficiency." }
    ];

    const navItems = [
        { name: "Home", ref: homeRef },
        { name: "Solutions", ref: solutionsRef },
        { name: "Industries", ref: industriesRef },
        { name: "Clients", ref: clientsRef },
        { name: "Work With Winze", ref: workwithRef }
    ];

    const deliveryItems = [
        { icon: faInfinity, title: "End-to-End Solutions", desc: "Complete lifecycle management from planning to execution and ongoing support.", detailedDesc: "Our end-to-end solutions cover every aspect of your technology journey. From initial consultation and planning to deployment, training, and ongoing support - we handle everything. This ensures seamless integration and minimal disruption to your business operations." },
        { icon: faCrown, title: "Enterprise Excellence", desc: "Guaranteed uptime, performance metrics, and measurable business results.", detailedDesc: "We guarantee enterprise-grade excellence with 99.9% uptime, comprehensive performance metrics, and measurable business results. Our solutions are designed to scale with your business and deliver consistent value." },
        { icon: faHandshake, title: "Flexible Engagement", desc: "Flexible consulting, project-based, or managed service engagement options.", detailedDesc: "Choose the engagement model that works best for you - whether it's strategic consulting, project-based delivery, or fully managed services. We adapt to your needs and budget." },
        { icon: faBolt, title: "Rapid Deployment", desc: "Accelerated implementation with minimal business disruption.", detailedDesc: "Our accelerated deployment methodology gets your solutions up and running quickly without disrupting your daily operations. We use proven frameworks and best practices to ensure smooth implementation." },
        { icon: faChartLine, title: "Analytics & Insights", desc: "Data-driven decision making with real-time dashboards.", detailedDesc: "Gain valuable insights from your data with our advanced analytics solutions. Real-time dashboards, custom reports, and predictive analytics help you make informed business decisions." },
        { icon: faShieldAlt, title: "24/7 Premium Support", desc: "Round-the-clock monitoring and technical assistance.", detailedDesc: "Our dedicated support team is available 24/7 to assist you with any technical issues. We provide proactive monitoring, rapid response times, and premium support services to keep your business running smoothly." }
    ];

    const workWithWinze = [
        { icon: faHandshake, title: "Strategic Partnership", desc: "We don't just deliver services; we build long-term strategic partnerships focused on your business growth.", detailedDesc: "As a strategic partner, we align our goals with yours. We invest time to understand your business challenges and work collaboratively to develop solutions that drive growth and innovation." },
        { icon: faGem, title: "Enterprise Value", desc: "Your success is our success. We're committed to delivering excellence in every project we undertake.", detailedDesc: "We measure our success by your success. Every project is executed with a focus on delivering measurable business value, ROI, and long-term benefits for your enterprise." },
        { icon: faRocket, title: "Innovation First", desc: "Stay ahead of the curve with our cutting-edge solutions and future-ready technology approach.", detailedDesc: "We continuously invest in research and development to bring you the latest technologies and innovative solutions. Stay competitive with our future-ready approach." },
        { icon: faUsers, title: "Client Success", desc: "100+ successful deployments, 20+ satisfied enterprise clients, and 16+ years of excellence.", detailedDesc: "Our track record speaks for itself. With over 100 successful deployments and 20+ satisfied enterprise clients across 16+ years, we have the expertise and experience to deliver results." }
    ];

    // Modal Component
    const CardModal = () => {
        if (!modalData) return null;
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.95)',
                zIndex: 10000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
            }} onClick={closeModal}>
                <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '40px',
                    maxWidth: '500px',
                    width: '90%',
                    textAlign: 'center',
                    cursor: 'default',
                    maxHeight: '80vh',
                    overflow: 'auto'
                }} onClick={(e) => e.stopPropagation()}>
                    <button onClick={closeModal} style={{
                        float: 'right',
                        background: '#667eea',
                        border: 'none',
                        fontSize: '18px',
                        cursor: 'pointer',
                        color: 'white',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        marginTop: '-20px',
                        marginRight: '-20px'
                    }}>×</button>
                    
                    <FontAwesomeIcon icon={modalData.icon} style={{ fontSize: '50px', color: '#667eea', marginBottom: '20px', marginTop: '20px' }} />
                    <h2 style={{ color: '#1a1a2e', marginBottom: '15px', fontSize: '24px' }}>{modalData.title || modalData.name}</h2>
                    
                    <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '20px', textAlign: 'left' }}>
                        {modalData.detailedDesc || "Detailed information coming soon. Please contact us for more details."}
                    </p>
                    
                    <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <button onClick={closeModal} style={{
                            padding: '10px 30px',
                            background: '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}>Close</button>
                        <button 
                            onClick={() => {
                                setShowQuoteModal(true);
                            }} 
                            style={{
                                padding: '10px 30px',
                                background: 'transparent',
                                color: '#667eea',
                                border: '2px solid #667eea',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            Request a Quote →
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Background Image Component
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
            <img 
                src={imageSrc} 
                alt="background"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
            />
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
            <img 
                src={imageSrc} 
                alt="background"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
            />
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
                .delivery-card, .work-card {
                    background: white; border-radius: 20px; padding: 40px 25px; text-align: center;
                    transition: all 0.4s; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid rgba(0,0,0,0.05);
                    cursor: pointer;
                }
                .delivery-card:hover, .work-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.15); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
                .delivery-card:hover h3, .delivery-card:hover p, .work-card:hover h3, .work-card:hover p { color: white; }
                .delivery-card:hover .icon, .work-card:hover .icon { color: white !important; }
                .solution-card, .industry-card {
                    background: white; border-radius: 20px; overflow: hidden; transition: all 0.4s;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid rgba(0,0,0,0.05);
                    cursor: pointer;
                }
                .solution-card:hover, .industry-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
                .solution-card-image, .industry-card-image { width: 100%; height: 200px; object-fit: cover; }
                .solution-card-content, .industry-card-content { padding: 25px; text-align: center; }
                .solution-card:hover .solution-card-content, .industry-card:hover .industry-card-content { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
                .solution-card:hover h3, .solution-card:hover p, .solution-card:hover .icon, .industry-card:hover h3, .industry-card:hover p, .industry-card:hover .icon { color: white; }
                .client-logo-item {
                    background: white; padding: 20px; border-radius: 12px; text-align: center; cursor: pointer;
                    transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.08); min-width: 150px;
                    border: 1px solid rgba(0,0,0,0.05); flex-shrink: 0;
                }
                .client-logo-item:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.12); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
                .client-logo-item:hover h3 { color: white; }
                .client-logo-img { width: 80px; height: 80px; margin: 0 auto 12px; display: flex; align-items: center; justifyContent: center; }
                .client-logo-img img { width: 100%; height: 100%; object-fit: contain; }
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
                
                {/* Navigation Bar */}
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
                    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div 
                                style={{
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
                                }}
                                onClick={() => setShowLogoModal(true)}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <img 
                                    src="/winze-logo.jpg" 
                                    alt="Winze Technologies Logo" 
                                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = '<span style="color:white;font-size:24px;font-weight:bold">W</span>';
                                    }}
                                />
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
                        
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                            {navItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        scrollToSection(item.ref, item.name);
                                    }}
                                    style={{ 
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
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                                        e.target.style.color = 'white';
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 4px 15px rgba(102,126,234,0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'transparent';
                                        e.target.style.color = '#ddd';
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
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
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.05)';
                                e.target.style.boxShadow = '0 8px 25px rgba(102,126,234,0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)';
                                e.target.style.boxShadow = '0 4px 15px rgba(102,126,234,0.3)';
                            }}
                            >✨ Get a Quote</button>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section ref={homeRef} id="home" style={{
                    minHeight: '100vh',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '80px 5%',
                    overflow: 'hidden'
                }}>
                    <BackgroundImage imageSrc={bgImages.hero} />
                    <div className="section-content" style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 2 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
                            <div>
                                <div style={{ marginBottom: '25px' }}>
                                    <span style={{ 
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        padding: '8px 24px',
                                        borderRadius: '30px',
                                        fontSize: '14px',
                                        color: 'white',
                                        display: 'inline-block',
                                        boxShadow: '0 4px 15px rgba(102,126,234,0.3)'
                                    }}>🏆 16+ Years of Excellence</span>
                                </div>
                                <h1 style={{ fontSize: '4.5rem', marginBottom: '20px', color: 'white', lineHeight: '1.2', fontFamily: "'Playfair Display', serif", fontWeight: '800' }}>Winze Technologies</h1>
                                <p style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#ddd', lineHeight: '1.6' }}>Leading Enterprise Communication, Security, and AI Technology Solutions Provider</p>
                                <p style={{ marginBottom: '30px', color: '#aaa', lineHeight: '1.7' }}>With over 16 years of industry experience, Winze Technologies Pvt Ltd specializes in designing, deploying, and supporting integrated technology ecosystems for enterprises across India.</p>
                                <div style={{ marginBottom: '35px', borderLeft: '3px solid #667eea', paddingLeft: '20px' }}>
                                    <strong style={{ fontSize: '1.1rem', color: 'white' }}>Arun N</strong><br />
                                    <span style={{ fontSize: '14px', color: '#aaa' }}>Chief Executive Officer</span>
                                </div>
                                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                    <button onClick={(e) => { e.stopPropagation(); setShowQuoteModal(true); handleTrackClick('Free Consultation', 'cta'); }} style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '14px 40px',
                                        borderRadius: '50px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        boxShadow: '0 4px 15px rgba(102,126,234,0.3)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 8px 25px rgba(102,126,234,0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 15px rgba(102,126,234,0.3)';
                                    }}>✨ Get a Free Consultation →</button>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        handleTrackClick('Explore Solutions', 'cta');
                                        if (solutionsRef.current) {
                                            solutionsRef.current.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }} style={{
                                        background: 'transparent',
                                        color: 'white',
                                        border: '2px solid #667eea',
                                        padding: '14px 40px',
                                        borderRadius: '50px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                                        e.target.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'transparent';
                                        e.target.style.transform = 'translateY(0)';
                                    }}>Explore Solutions</button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div
                                    style={{
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        cursor: 'pointer',
                                        display: 'inline-block',
                                        animation: 'premiumGlow 3s ease-in-out infinite',
                                        background: 'linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))',
                                        padding: '3px',
                                        borderRadius: '23px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.animation = 'premiumGlow 0.8s ease-in-out infinite';
                                        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.animation = 'premiumGlow 3s ease-in-out infinite';
                                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                    }}
                                >
                                    <img 
                                        src="/images/hero-image.jpg" 
                                        alt="Hero" 
                                        style={{ 
                                            width: '100%', 
                                            maxWidth: '550px',
                                            height: 'auto',
                                            borderRadius: '20px', 
                                            boxShadow: '0 25px 50px rgba(0,0,0,0.3)', 
                                            border: '2px solid rgba(102,126,234,0.5)',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            display: 'block'
                                        }} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What We Deliver Section */}
                <section id="delivery" style={{ padding: '100px 5%', position: 'relative', overflow: 'hidden' }}>
                    <DarkBackgroundImage imageSrc={bgImages.delivery} />
                    <div className="section-content" style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                        <h2 style={{ textAlign: 'center', fontSize: '3rem', color: 'white', marginBottom: '15px' }}>What We Deliver</h2>
                        <p style={{ textAlign: 'center', color: '#FFD700', marginBottom: '60px', fontSize: '1.1rem' }}>Comprehensive lifecycle for technology integration</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '35px' }}>
                            {deliveryItems.map((item, i) => (
                                <div 
                                    key={i} 
                                    className="delivery-card"
                                    onMouseEnter={() => setHoveredCard(i)} 
                                    onMouseLeave={() => setHoveredCard(null)} 
                                >
                                    <FontAwesomeIcon icon={item.icon} style={{ fontSize: '50px', marginBottom: '20px', color: hoveredCard === i ? 'white' : '#667eea' }} />
                                    <h3 style={{ marginBottom: '15px', color: hoveredCard === i ? 'white' : '#1a1a2e', fontSize: '1.3rem', fontWeight: '700' }}>{item.title}</h3>
                                    <p style={{ color: hoveredCard === i ? 'rgba(255,255,255,0.9)' : '#666', lineHeight: '1.5' }}>{item.desc}</p>
                                    <button 
                                        style={{
                                            display: 'inline-block',
                                            marginTop: '15px',
                                            padding: '10px 25px',
                                            backgroundColor: '#667eea',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '30px',
                                            cursor: 'pointer',
                                            fontWeight: '600',
                                            fontSize: '14px',
                                            transition: 'all 0.3s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#764ba2'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleTrackClick(item.title, 'delivery');
                                            openModal(item);
                                        }}
                                    >
                                        Learn More →
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Solutions Portfolio Section */}
<section ref={solutionsRef} id="solutions" style={{ padding: '100px 5%', position: 'relative', overflow: 'hidden' }}>
    <BackgroundImage imageSrc={bgImages.solutions} />
    <div className="section-content" style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <h2 style={{ textAlign: 'center', fontSize: '3rem', color: 'white', marginBottom: '15px' }}>Our Solutions Portfolio</h2>
        <p style={{ textAlign: 'center', color: '#FFD700', marginBottom: '10px', fontSize: '1.2rem', fontStyle: 'italic', fontWeight: '600' }}>Our SOLUTIONS — Practical Action, Bold Ambition, Endless Possibilities</p>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.8)', marginBottom: '60px', fontSize: '1rem' }}>Enterprise-grade technology solutions for modern businesses</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
            {solutions.map((solution, idx) => (
                <div 
                    key={idx} 
                    className="solution-card"
                    style={{
                        background: 'white',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        transition: 'all 0.4s ease-in-out',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                        cursor: 'pointer',
                        transform: hoveredCard === `sol-${idx}` ? 'translateY(-10px)' : 'translateY(0)',
                        boxShadow: hoveredCard === `sol-${idx}` ? '0 20px 40px rgba(0,0,0,0.15)' : '0 10px 30px rgba(0,0,0,0.08)'
                    }}
                    onMouseEnter={() => setHoveredCard(`sol-${idx}`)} 
                    onMouseLeave={() => setHoveredCard(null)} 
                >
                    <img 
                        src={solution.img} 
                        alt={solution.title} 
                        style={{ 
                            width: '100%', 
                            height: '200px', 
                            objectFit: 'cover',
                            transition: 'all 0.4s ease-in-out'
                        }} 
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/600x400/667eea/white?text=' + encodeURIComponent(solution.title);
                        }}
                    />
                    <div style={{ 
                        padding: '25px', 
                        textAlign: 'center',
                        transition: 'all 0.4s ease-in-out',
                        background: hoveredCard === `sol-${idx}` ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'
                    }}>
                        <FontAwesomeIcon 
                            icon={solution.icon} 
                            style={{ 
                                fontSize: '40px', 
                                marginBottom: '15px', 
                                color: hoveredCard === `sol-${idx}` ? 'white' : '#667eea',
                                transition: 'color 0.3s'
                            }} 
                        />
                        <h3 style={{ 
                            marginBottom: '12px', 
                            color: hoveredCard === `sol-${idx}` ? 'white' : '#1a1a2e', 
                            fontSize: '1.2rem', 
                            fontWeight: '700',
                            transition: 'color 0.3s'
                        }}>{solution.title}</h3>
                        <p style={{ 
                            color: hoveredCard === `sol-${idx}` ? 'rgba(255,255,255,0.9)' : '#666', 
                            lineHeight: '1.5', 
                            marginBottom: '20px',
                            transition: 'color 0.3s'
                        }}>{solution.desc}</p>
                        
                        {/* Learn More Button */}
                        <div
                            style={{
                                display: 'inline-block',
                                padding: '12px 30px',
                                backgroundColor: hoveredCard === `sol-${idx}` ? 'white' : '#667eea',
                                color: hoveredCard === `sol-${idx}` ? '#667eea' : 'white',
                                borderRadius: '50px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: 'all 0.3s',
                                marginTop: '10px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                            onClick={() => {
                                handleTrackClick(solution.title, 'solution');
                                openModal(solution);
                            }}
                        >
                            Learn More →
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
</section>
                {/* Industries Section */}
                <section ref={industriesRef} id="industries" style={{ padding: '100px 5%', position: 'relative', overflow: 'hidden' }}>
                    <DarkBackgroundImage imageSrc={bgImages.industries} />
                    <div className="section-content" style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                        <h2 style={{ textAlign: 'center', fontSize: '3rem', color: 'white', marginBottom: '15px' }}>Industries We Serve</h2>
                        <p style={{ textAlign: 'center', color: '#FFD700', marginBottom: '60px', fontSize: '1.1rem' }}>Transforming businesses across sectors with innovative solutions</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                            {industries.map((industry, idx) => (
                                <div 
                                    key={idx} 
                                    className="industry-card"
                                    onMouseEnter={() => setHoveredCard(`ind-${idx}`)} 
                                    onMouseLeave={() => setHoveredCard(null)} 
                                >
                                    <img src={industry.img} alt={industry.name} className="industry-card-image" />
                                    <div className="industry-card-content">
                                        <FontAwesomeIcon icon={industry.icon} className="icon" style={{ fontSize: '40px', marginBottom: '15px', color: '#667eea' }} />
                                        <h3 style={{ marginBottom: '10px', color: '#1a1a2e', fontSize: '1.2rem', fontWeight: '700' }}>{industry.name}</h3>
                                        <p style={{ color: '#666', lineHeight: '1.5', fontSize: '0.9rem', marginBottom: '20px' }}>{industry.desc}</p>
                                        {/* Learning More Button with INLINE STYLES */}
                                        <div
                                            style={{
                                                display: 'inline-block',
                                                padding: '12px 30px',
                                                backgroundColor: '#667eea',
                                                color: 'white',
                                                borderRadius: '50px',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                textAlign: 'center',
                                                transition: 'all 0.3s',
                                                marginTop: '10px'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#764ba2'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#667eea'}
                                            onClick={() => {
                                                handleTrackClick(industry.name, 'industry');
                                                openModal(industry);
                                            }}
                                        >
                                            Learn More →
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Our Trusted Partners Section */}
                <section ref={clientsRef} id="clients" style={{
                    padding: '80px 5%',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}>
                    <div className="section-content" style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
                        <h2 style={{ fontSize: '3rem', color: 'white', marginBottom: '15px', fontFamily: "'Playfair Display', serif", fontWeight: '800' }}>Our Trusted Partners</h2>
                        <p style={{ color: '#FFD700', marginBottom: '20px', fontSize: '1.2rem', fontStyle: 'italic', fontWeight: '600' }}>Innovation. Excellence. Trust.</p>
                        <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '50px', fontSize: '1rem', fontWeight: '500', letterSpacing: '0.5px' }}>Partnering with industry leaders to deliver world-class technology solutions</p>
                        
                        <div className="marquee-container">
                            <div className="marquee-content">
                                {[...clientLogos, ...clientLogos, ...clientLogos].map((client, idx) => (
                                    <div 
                                        key={idx}
                                        className="client-logo-item"
                                        onClick={() => handleTrackClick(client.name, 'client')}
                                        style={{ background: 'white' }}
                                    >
                                        <div className="client-logo-img">
                                            <img 
                                                src={client.url} 
                                                alt={client.name}
                                                style={{ filter: 'none' }}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = `https://placehold.co/100x100/667eea/white?text=${client.name.charAt(0)}`;
                                                }}
                                            />
                                        </div>
                                        <h3 style={{ color: '#333', fontSize: '0.9rem', margin: 0, fontWeight: '600' }}>{client.name}</h3>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Work With Winze Section */}
                <section ref={workwithRef} id="workwith" style={{ padding: '100px 5%', position: 'relative', overflow: 'hidden' }}>
                    <DarkBackgroundImage imageSrc={bgImages.workwith} />
                    <div className="section-content" style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
                        <h2 style={{ fontSize: '3rem', color: 'white', marginBottom: '15px', fontFamily: "'Playfair Display', serif", fontWeight: '800' }}>Why Work With Winze?</h2>
                        <p style={{ color: '#FFD700', marginBottom: '50px', fontSize: '1.1rem' }}>Partner with us for a transformative technology experience</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                            {workWithWinze.map((item, idx) => (
                                <div 
                                    key={idx}
                                    className="work-card"
                                    onMouseEnter={() => setHoveredCard(`work-${idx}`)} 
                                    onMouseLeave={() => setHoveredCard(null)} 
                                >
                                    <FontAwesomeIcon icon={item.icon} className="icon" style={{ fontSize: '50px', marginBottom: '20px', color: hoveredCard === `work-${idx}` ? 'white' : '#667eea' }} />
                                    <h3 style={{ marginBottom: '15px', color: hoveredCard === `work-${idx}` ? 'white' : '#1a1a2e', fontSize: '1.3rem', fontWeight: '700' }}>{item.title}</h3>
                                    <p style={{ color: hoveredCard === `work-${idx}` ? 'rgba(255,255,255,0.9)' : '#666', lineHeight: '1.5', marginBottom: '20px' }}>{item.desc}</p>
                                    {/* Learning More Button with INLINE STYLES */}
                                    <div
                                        style={{
                                            display: 'inline-block',
                                            padding: '12px 30px',
                                            backgroundColor: '#667eea',
                                            color: 'white',
                                            borderRadius: '50px',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            transition: 'all 0.3s',
                                            marginTop: '10px'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#764ba2'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#667eea'}
                                        onClick={() => {
                                            handleTrackClick(item.title, 'workwith');
                                            openModal(item);
                                        }}
                                    >
                                        Learn More →
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Our Impact in Numbers Section */}
                <section ref={statsRef} style={{ padding: '100px 5%', position: 'relative', overflow: 'hidden' }}>
                    <BackgroundImage imageSrc={bgImages.stats} />
                    <div className="section-content" style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
                        <h2 style={{ fontSize: '3rem', color: 'white', marginBottom: '15px', fontFamily: "'Playfair Display', serif", fontWeight: '800' }}>Our Impact in Numbers</h2>
                        <p style={{ color: '#FFD700', marginBottom: '50px', fontSize: '1.2rem', fontStyle: 'italic', fontWeight: '600' }}>Delivering excellence through measurable results and proven success</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
                            <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '30px 20px', borderRadius: '15px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3)', animation: 'pulse 2s infinite' }}>
                                <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'white', marginBottom: '15px' }}>{counters.years}+</div>
                                <h3 style={{ fontSize: '1.3rem', color: 'white', marginBottom: '10px', fontWeight: 'bold' }}>Years in Business</h3>
                                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', lineHeight: '1.4' }}>Extensive Experience in delivering IT Solutions & Services</p>
                            </div>

                            <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', padding: '30px 20px', borderRadius: '15px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3)', animation: 'pulse 2s infinite 0.3s' }}>
                                <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'white', marginBottom: '15px' }}>{counters.expertise}+</div>
                                <h3 style={{ fontSize: '1.3rem', color: 'white', marginBottom: '10px', fontWeight: 'bold' }}>Expertise</h3>
                                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', lineHeight: '1.4' }}>Domain experts delivering cutting-edge solutions</p>
                            </div>

                            <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', padding: '30px 20px', borderRadius: '15px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3)', animation: 'pulse 2s infinite 0.6s' }}>
                                <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'white', marginBottom: '15px' }}>{counters.clients}+</div>
                                <h3 style={{ fontSize: '1.3rem', color: 'white', marginBottom: '10px', fontWeight: 'bold' }}>Clients</h3>
                                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', lineHeight: '1.4' }}>Trusted by businesses across the globe</p>
                            </div>

                            <div style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', padding: '30px 20px', borderRadius: '15px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3)', animation: 'pulse 2s infinite 0.9s' }}>
                                <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'white', marginBottom: '15px' }}>{counters.awards}+</div>
                                <h3 style={{ fontSize: '1.3rem', color: 'white', marginBottom: '10px', fontWeight: 'bold' }}>Awards</h3>
                                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', lineHeight: '1.4' }}>Industry recognition for excellence & innovation</p>
                            </div>

                            <div style={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', padding: '30px 20px', borderRadius: '15px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3)', animation: 'pulse 2s infinite 1.2s' }}>
                                <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>{counters.projects}+</div>
                                <h3 style={{ fontSize: '1.3rem', color: '#333', marginBottom: '10px', fontWeight: 'bold' }}>Projects</h3>
                                <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: '1.4' }}>Successfully delivered with exceptional quality</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Logo Modal */}
                {showLogoModal && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.95)',
                        backdropFilter: 'blur(20px)',
                        zIndex: 2000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }} onClick={() => setShowLogoModal(false)}>
                        <div style={{ maxWidth: '90vw', maxHeight: '90vh', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => setShowLogoModal(false)} style={{
                                position: 'absolute', top: '-50px', right: '-50px', background: 'rgba(255,255,255,0.2)', border: 'none',
                                fontSize: '30px', cursor: 'pointer', color: 'white', width: '40px', height: '40px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s'
                            }}>×</button>
                            <div style={{ background: 'white', borderRadius: '20px', padding: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
                                <img src="/winze-logo.jpg" alt="Winze Technologies Logo" style={{ maxWidth: '70vw', maxHeight: '70vh', objectFit: 'contain' }} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Quote Modal */}
                {showQuoteModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowQuoteModal(false)}>
                        <div style={{ background: 'linear-gradient(135deg, #1a1a3e 0%, #2d2d5e 100%)', borderRadius: '20px', padding: '45px', maxWidth: '550px', width: '100%', position: 'relative', border: '1px solid rgba(255,255,255,0.2)' }} onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => setShowQuoteModal(false)} style={{ position: 'absolute', top: '20px', right: '25px', background: 'rgba(255,255,255,0.1)', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'white', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                            <h2 style={{ color: 'white', marginBottom: '25px', textAlign: 'center' }}>✨ Request a Quote</h2>
                            <p style={{ color: '#ccc', textAlign: 'center', marginBottom: '30px', fontSize: '14px' }}>Fill out the form and our team will contact you within 24 hours</p>
                            <form onSubmit={handleSubmitQuote}>
                                <input type="text" name="name" placeholder="Full Name" required onChange={handleInputChange} style={{ width: '100%', padding: '14px', marginBottom: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '15px' }} />
                                <input type="email" name="email" placeholder="Email Address" required onChange={handleInputChange} style={{ width: '100%', padding: '14px', marginBottom: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '15px' }} />
                                <input type="tel" name="phone" placeholder="Phone Number" required onChange={handleInputChange} style={{ width: '100%', padding: '14px', marginBottom: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '15px' }} />
                                <select name="service" onChange={handleInputChange} style={{ width: '100%', padding: '14px', marginBottom: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '15px' }}>
                                    <option value="">Select a Service</option>
                                    {solutions.map(s => <option key={s.title}>{s.title}</option>)}
                                </select>
                                <textarea name="message" placeholder="Tell us about your requirements..." rows="4" onChange={handleInputChange} style={{ width: '100%', padding: '14px', marginBottom: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '15px' }}></textarea>
                                <button type="submit" style={{ width: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '14px', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s' }}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>Submit Request →</button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Card Modal */}
                <CardModal />

                {/* Footer */}
                <footer style={{ background: '#0a0a1a', color: 'white', padding: '60px 5% 30px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '45px', marginBottom: '45px' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                    <div style={{ width: '45px', height: '45px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => setShowLogoModal(true)}>
                                        <img src="/winze-logo.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }} />
                                    </div>
                                    <span style={{ fontWeight: '800', fontSize: '1.2rem', color: 'white' }}>Winze Technologies</span>
                                </div>
                                <p style={{ color: '#aaa', lineHeight: '1.6' }}>Driving Innovation through Customer-Centric Technology Solutions.</p>
                            </div>
                            <div>
                                <h4 style={{ marginBottom: '20px', color: '#667eea', fontSize: '1.1rem' }}>Quick Links</h4>
                                {navItems.map((item) => (
                                    <p key={item.name}>
                                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollToSection(item.ref, item.name); }} style={{ color: '#aaa', background: 'none', border: 'none', display: 'block', marginBottom: '12px', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.3s' }}
                                        onMouseEnter={(e) => e.target.style.color = '#667eea'}
                                        onMouseLeave={(e) => e.target.style.color = '#aaa'}>
                                            {item.name}
                                        </button>
                                    </p>
                                ))}
                            </div>
                            <div>
                                <h4 style={{ marginBottom: '20px', color: '#667eea', fontSize: '1.1rem' }}>Contact Info</h4>
                                <p style={{ color: '#aaa', marginBottom: '12px' }}>📧 arunn@winzetech.com</p>
                                <p style={{ color: '#aaa', marginBottom: '12px' }}>📞 +91 98800 10417</p>
                                <p style={{ color: '#aaa', marginBottom: '12px' }}>🌐 www.winzetech.com</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'center', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', color: '#666' }}>
                            <p>© 2024 Winze Technologies Pvt Ltd. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
            </>
        </HelmetProvider>
    );
};

export default WinzePage;