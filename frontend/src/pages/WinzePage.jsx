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

// Partner Logos (Updated - removed Toshiba, Infosys, HCL, Tata)
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

// Client Logos for Clients section (all requested clients)
const clientLogos = [
    { name: "Toshiba", url: "/images/toshiba.png" },
    { name: "Toyota", url: "/images/toyota.png" },
    { name: "Starpacks", url: "/images/starpacks.png" },
    { name: "MAF", url: "/images/maf.png" },
    { name: "Athma", url: "/images/athma.png" },
    { name: "RGP", url: "/images/rgp.png" },
    { name: "Utthunga", url: "/images/utthunga.png" },
    { name: "TRC", url: "/images/trc.png" },
    { name: "Unilateral", url: "/images/unilateral.png" },
    { name: "Sun Bright", url: "/images/sun-bright.png" },
    { name: "CKPC", url: "/images/ckpc.png" },
    { name: "Kyyba", url: "/images/kyyba.png" },
    { name: "Skidata", url: "/images/skidata.png" }
];

// Detailed content for each solution card (AI-generated content for landing pages)
const solutionDetailedContent = {
    "Video Conferencing": {
        overview: "Our Video Conferencing solution provides enterprise-grade virtual meeting capabilities with crystal-clear HD video, advanced security features, and seamless integration with your existing workflow. Perfect for remote teams, global collaboration, and hybrid work environments.",
        benefits: [
            "4K Ultra HD video quality with automatic lighting adjustment",
            "End-to-end encryption for secure business communications",
            "Supports up to 500 participants in a single meeting",
            "Screen sharing, virtual backgrounds, and breakout rooms",
            "Integration with Slack, Teams, Zoom, and Google Workspace",
            "Recording and transcription with AI-powered summaries",
            "Mobile apps for iOS and Android with full functionality",
            "Real-time closed captioning and language translation"
        ],
        features: [
            "Smart gallery view that highlights active speakers",
            "Virtual hand raise, polls, and Q&A sessions",
            "Calendar integration for one-click meeting joins",
            "Custom branding for enterprise accounts",
            "Analytics dashboard with meeting insights",
            "API access for custom integrations"
        ],
        useCases: [
            "Global team meetings and daily standups",
            "Client presentations and sales demos",
            "Webinars and virtual events",
            "Remote interviews and onboarding",
            "Board meetings and executive briefings"
        ]
    },
    "Smart Eye AI": {
        overview: "Smart Eye AI is an advanced video analytics platform that transforms ordinary CCTV cameras into intelligent security systems. Using cutting-edge machine learning algorithms, it detects anomalies, recognizes faces and vehicles, and sends real-time alerts to prevent incidents before they occur.",
        benefits: [
            "Real-time threat detection with 99.5% accuracy",
            "Facial recognition with watchlist alerts",
            "Automatic number plate recognition (ANPR)",
            "Abandoned object and loitering detection",
            "Crowd density monitoring and social distancing alerts",
            "Fire and smoke detection from video feeds",
            "Unauthorized access alerts for restricted areas",
            "24/7 automated monitoring reduces manual effort"
        ],
        features: [
            "Centralized dashboard for multiple camera feeds",
            "Mobile app notifications for instant alerts",
            "Search by face, vehicle, or object across recorded footage",
            "Integration with existing CCTV infrastructure",
            "Cloud-based or on-premise deployment options",
            "Custom alert rules and zones configuration"
        ],
        useCases: [
            "Airport security and perimeter monitoring",
            "Retail store theft prevention",
            "Bank and ATM surveillance",
            "School and campus safety",
            "Industrial facility security"
        ]
    },
    "Rental IT Infrastructure": {
        overview: "Rental IT Infrastructure provides cost-effective, flexible hardware solutions for businesses of all sizes. Whether you need equipment for a short-term project, a corporate event, or to scale your operations during peak seasons, we deliver premium IT hardware with full setup and support.",
        benefits: [
            "Pay only for what you use with flexible daily/weekly/monthly rentals",
            "Latest generation laptops, desktops, and servers",
            "Free delivery, setup, and on-site support",
            "Replace faulty equipment within 4 hours",
            "Scale up or down based on project requirements",
            "No long-term commitment or capital expenditure",
            "All hardware sanitized and tested before delivery",
            "Bulk discounts for large-scale deployments"
        ],
        features: [
            "Enterprise-grade laptops (Dell, HP, Lenovo)",
            "High-performance desktops and workstations",
            "Servers and networking equipment",
            "AV equipment including projectors and speakers",
            "Printers, scanners, and peripherals",
            "Pre-configured with required software"
        ],
        useCases: [
            "Corporate events and conferences",
            "Software development and testing",
            "Temporary office setups and pop-up stores",
            "Exhibitions and trade shows",
            "Disaster recovery and business continuity"
        ]
    },
    "SaaS Products": {
        overview: "Our custom SaaS products are designed to solve specific business challenges with scalable, cloud-native architecture. From CRM to ERP, HRMS to project management, we build and deploy software that grows with your business.",
        benefits: [
            "Subscription-based pricing with no upfront costs",
            "Automatic updates and maintenance included",
            "99.99% uptime SLA with multi-region redundancy",
            "GDPR and SOC2 compliant data handling",
            "Customizable to match your business processes",
            "Integration APIs for third-party apps",
            "Dedicated customer success manager",
            "Regular security audits and penetration testing"
        ],
        features: [
            "White-label options for your brand",
            "Role-based access control and permissions",
            "Real-time analytics and custom reports",
            "Mobile-responsive design for on-the-go access",
            "24/7 technical support via chat, email, and phone",
            "Data export and backup capabilities"
        ],
        useCases: [
            "Small to medium business automation",
            "Enterprise workflow management",
            "Startup MVPs and product launches",
            "Industry-specific solutions (healthcare, retail, logistics)",
            "Legacy system modernization"
        ]
    },
    "Enterprise Software Licensing": {
        overview: "We simplify enterprise software licensing by offering volume discounts, compliance management, and dedicated account support for all major software vendors including Microsoft, Adobe, Oracle, SAP, and VMware.",
        benefits: [
            "Volume licensing discounts up to 40% off retail",
            "Centralized license management across your organization",
            "Compliance audits to prevent over-licensing or penalties",
            "Flexible payment terms (monthly, quarterly, annually)",
            "Dedicated licensing specialist assigned to your account",
            "Software asset management (SAM) services",
            "Migration assistance to cloud subscriptions",
            "Renewal reminders and best-price negotiation"
        ],
        features: [
            "Microsoft 365 and Azure licensing",
            "Adobe Creative Cloud and Document Cloud",
            "Oracle Database and ERP licenses",
            "SAP S/4HANA and Business Suite",
            "VMware virtualization licenses",
            "AutoCAD and design software",
            "Antivirus and security software"
        ],
        useCases: [
            "Startups needing affordable software access",
            "Enterprises with complex licensing needs",
            "Educational institutions with special pricing",
            "Government and non-profit organizations",
            "Businesses migrating to cloud subscriptions"
        ]
    },
    "IT Infrastructure": {
        overview: "Our IT Infrastructure solutions provide enterprise-grade networking, server, and storage systems designed for optimal performance, reliability, and scalability. From data center design to cloud integration, we build the foundation for your digital transformation.",
        benefits: [
            "99.999% uptime with redundant architecture",
            "24/7 proactive monitoring and alerting",
            "Scalable design that grows with your business",
            "On-premise, cloud, or hybrid deployment options",
            "Energy-efficient hardware reduces operating costs",
            "Disaster recovery and backup solutions included",
            "Regular firmware updates and patch management",
            "Vendor-agnostic recommendations for best value"
        ],
        features: [
            "Hyper-converged infrastructure (HCI)",
            "Enterprise switches, routers, and firewalls",
            "SAN and NAS storage systems",
            "Virtualization with VMware or Hyper-V",
            "Cloud integration (AWS, Azure, GCP)",
            "Network monitoring and management tools"
        ],
        useCases: [
            "New office setup and expansion",
            "Data center consolidation and migration",
            "Cloud repatriation projects",
            "Disaster recovery site implementation",
            "High-performance computing (HPC) clusters"
        ]
    },
    "CCTV Services": {
        overview: "Our comprehensive CCTV services include site survey, camera installation, configuration, cloud storage, and ongoing maintenance. We deploy H.265 HD cameras with night vision, motion detection, and AI-powered analytics for proactive security monitoring.",
        benefits: [
            "24/7 recording with 30-day cloud storage",
            "Remote viewing from any device (mobile, tablet, desktop)",
            "Motion-triggered alerts and email notifications",
            "AI-powered people counting and heat mapping",
            "License plate recognition for parking management",
            "Tamper detection and camera health monitoring",
            "Weatherproof cameras for outdoor installation",
            "Night vision up to 50 meters"
        ],
        features: [
            "4MP and 8MP HD cameras",
            "PTZ (Pan-Tilt-Zoom) cameras for active monitoring",
            "Explosion-proof cameras for hazardous areas",
            "Thermal cameras for perimeter security",
            "Video management software (VMS)",
            "Integration with access control systems"
        ],
        useCases: [
            "Office complexes and corporate campuses",
            "Warehouses and logistics centers",
            "Retail stores and shopping malls",
            "Schools and educational institutions",
            "Residential complexes and gated communities"
        ]
    },
    "Cabling Services": {
        overview: "We provide professional structured cabling solutions for data centers, offices, and industrial facilities. Our certified technicians design and install copper, fiber optic, and structured cabling systems that meet industry standards and future-proof your network.",
        benefits: [
            "Cat6, Cat6a, Cat7, and Cat8 copper cabling",
            "Single-mode and multi-mode fiber optics",
            "Cable management and labeling for easy maintenance",
            "Fluke testing and certification for every drop",
            "Greenfield and brownfield project experience",
            "Minimum 25-year warranty on cabling components",
            "Minimal disruption with after-hours installation",
            "Detailed as-built drawings and documentation"
        ],
        features: [
            "Rack mounting and cable tray installation",
            "Patch panel termination and testing",
            "Fiber splicing and connectorization",
            "Cable pathway design (overhead and underfloor)",
            "Grounding and bonding for safety",
            "Thermal imaging for hot spot detection"
        ],
        useCases: [
            "New building construction (Greenfield)",
            "Office renovations and expansions",
            "Data center cabling and re-cabling",
            "School and campus network infrastructure",
            "Industrial facility automation networks"
        ]
    },
    "WiFi as a Service": {
        overview: "WiFi as a Service delivers enterprise-grade wireless networking without the capital expense. We design, deploy, and manage your WiFi infrastructure, ensuring seamless connectivity for your employees, guests, and IoT devices.",
        benefits: [
            "Predictive monthly subscription pricing",
            "Access points, controllers, and licenses included",
            "Guest WiFi with social login and captive portal",
            "Bandwidth management and traffic shaping",
            "Usage analytics and heat mapping",
            "Automatic firmware updates and security patches",
            "24/7 monitoring and Remote Troubleshooting",
            "Scalable from 10 to 10,000 users"
        ],
        features: [
            "WiFi 6 (802.11ax) access points for high density",
            "Cloud-based or on-premise controller options",
            "Captive portal customization for branding",
            "Integration with Active Directory and RADIUS",
            "Self-service onboarding for guests",
            "Compliance reporting (PCI, HIPAA)"
        ],
        useCases: [
            "Corporate offices and coworking spaces",
            "Hotels and hospitality venues",
            "Airports and transportation hubs",
            "Stadiums and large event venues",
            "Warehouses and manufacturing facilities"
        ]
    },
    "Smart Live Classroom": {
        overview: "Smart Live Classroom is an interactive virtual learning platform that brings teachers and students together in an engaging digital environment. With live video, interactive whiteboards, attendance tracking, and parent portals, we make remote learning effective and enjoyable.",
        benefits: [
            "Live HD video classes with recording option",
            "Interactive digital whiteboard with annotations",
            "Automated attendance tracking and reporting",
            "Assignment submission and grading system",
            "Parent portal for progress monitoring",
            "Breakout rooms for group activities",
            "Screen sharing and presentation tools",
            " supports up to 500 students per session"
        ],
        features: [
            "Quiz and poll creation for real-time assessment",
            "Class recordings accessible anytime",
            "Digital library for course materials",
            "Discussion forums and chat moderation",
            "Certificate generation upon course completion",
            "Mobile apps for iOS and Android",
            "Integration with LMS like Moodle and Canvas"
        ],
        useCases: [
            "K-12 schools and online tutoring",
            "Colleges and university distance learning",
            "Corporate training and employee onboarding",
            "Test preparation and coaching institutes",
            "Skill development and vocational training"
        ]
    },
    "Web & Mobile Development": {
        overview: "Our Web & Mobile Development team builds custom applications using modern technologies like React, Node.js, Flutter, and React Native. From e-commerce platforms to enterprise dashboards, we deliver responsive, scalable, and secure solutions.",
        benefits: [
            "End-to-end development from concept to deployment",
            "Agile methodology with 2-week sprints",
            "Responsive design for all screen sizes",
            "API development and third-party integrations",
            "SEO-optimized architecture",
            "Ongoing maintenance and support",
            "Source code ownership with no vendor lock-in",
            "Cloud deployment (AWS, Azure, GCP)"
        ],
        features: [
            "Frontend: React, Angular, Vue.js",
            "Backend: Node.js, Python, Java, PHP",
            "Mobile: Flutter, React Native, Swift, Kotlin",
            "Database: MySQL, PostgreSQL, MongoDB",
            "DevOps: CI/CD, Docker, Kubernetes",
            "Security: HTTPS, JWT, OAuth"
        ],
        useCases: [
            "E-commerce and marketplace platforms",
            "Enterprise resource planning (ERP) systems",
            "Customer relationship management (CRM)",
            "On-demand service apps (Uber-like)",
            "Healthcare and telemedicine portals"
        ]
    },
    "Cyber Security": {
        overview: "Our comprehensive cyber security services protect your business from evolving threats. We provide threat detection, vulnerability assessments, compliance management, and employee training to keep your data and systems secure.",
        benefits: [
            "24/7 security operations center (SOC) monitoring",
            "Automated threat detection and response",
            "Weekly vulnerability scans and monthly penetration tests",
            "GDPR, HIPAA, PCI-DSS, and ISO 27001 compliance",
            "Security awareness training for employees",
            "Incident response and disaster recovery planning",
            "Dark web monitoring for compromised credentials",
            "Managed firewall, antivirus, and endpoint protection"
        ],
        features: [
            "Next-generation firewall (NGFW) management",
            "Endpoint detection and response (EDR)",
            "Email security and anti-phishing protection",
            "Web application firewall (WAF)",
            "Data loss prevention (DLP)",
            "Multi-factor authentication (MFA) implementation",
            "Security information and event management (SIEM)"
        ],
        useCases: [
            "Financial services and banking compliance",
            "Healthcare data protection (HIPAA)",
            "E-commerce PCI-DSS compliance",
            "Cloud security for AWS, Azure, GCP",
            "Remote workforce security"
        ]
    },
    "Unified Communications": {
        overview: "Unified Communications brings voice, video, messaging, and collaboration tools into a single platform. Improve team productivity, reduce communication silos, and enable seamless collaboration across your organization.",
        benefits: [
            "VoIP phone system with auto-attendant",
            "HD video conferencing and screen sharing",
            "Instant messaging with file sharing",
            "Presence detection and calendar integration",
            "Mobile and desktop apps for anywhere access",
            "Call recording and voicemail-to-email",
            "Integration with CRM (Salesforce, HubSpot)",
            "99.999% uptime with redundant infrastructure"
        ],
        features: [
            "Auto-attendant and call routing",
            "Ring groups and call queues",
            "Conference calling up to 100 participants",
            "Virtual fax receive and send",
            "Analytics dashboard with call metrics",
            "BYOC (Bring Your Own Carrier) support",
            "API access for custom integrations"
        ],
        useCases: [
            "Multi-location businesses needing unified communication",
            "Remote and hybrid teams",
            "Customer service and support centers",
            "Sales teams requiring CRM integration",
            "Healthcare telemedicine consultations"
        ]
    },
    "Contact Center": {
        overview: "Our AI-powered Contact Center solution transforms customer service with intelligent routing, chatbots, sentiment analysis, and omnichannel support. Deliver exceptional experiences across voice, email, chat, and social media.",
        benefits: [
            "Omnichannel queue (voice, email, chat, social)",
            "AI-powered chatbots for instant responses",
            "Sentiment analysis to prioritize upset customers",
            "Real-time dashboards and performance analytics",
            "Skills-based routing to the right agent",
            "Call recording and quality management",
            "Workforce management for shift scheduling",
            "CRM and helpdesk integration (Salesforce, Zendesk)"
        ],
        features: [
            "Interactive voice response (IVR) with NLP",
            "Click-to-call from your website",
            "Callback and voicemail drop features",
            "Co-browsing and screen sharing",
            "Customer satisfaction (CSAT) surveys",
            "Agent scripting and knowledge base",
            "Speech analytics for compliance monitoring"
        ],
        useCases: [
            "E-commerce customer support",
            "Financial services helpdesk",
            "Travel and hospitality reservations",
            "Healthcare appointment scheduling",
            "IT service desk (ITSM)"
        ]
    }
};

// Detailed content for delivery items and work with winze
const deliveryDetailedContent = {
    "End-to-End Solutions": {
        overview: "We provide complete lifecycle management from initial planning and strategy to deployment, training, and ongoing support. Our holistic approach ensures seamless integration, minimal business disruption, and maximum ROI.",
        benefits: ["Strategy consulting and roadmap planning", "Vendor selection and procurement", "Project management and implementation", "User training and change management", "24/7 support and maintenance", "Continuous optimization and upgrades"]
    },
    "Enterprise Excellence": {
        overview: "We guarantee enterprise-grade excellence with 99.9% uptime, comprehensive performance metrics, and measurable business results. Our solutions are designed to scale with your business and deliver consistent value.",
        benefits: ["SLA-backed uptime guarantees", "Real-time performance dashboards", "Regular business reviews", "Continuous improvement programs", "ISO and compliance certifications", "Disaster recovery and business continuity"]
    },
    "Flexible Engagement": {
        overview: "Choose the engagement model that works best for your business - strategic consulting, project-based delivery, or fully managed services. We adapt to your needs, timeline, and budget.",
        benefits: ["Time and material projects", "Fixed-price deliverables", "Dedicated team engagement", "Co-managed IT services", "Fully outsourced IT operations", "Pay-as-you-go options"]
    },
    "Rapid Deployment": {
        overview: "Our accelerated deployment methodology gets your solutions up and running quickly without disrupting daily operations. We use proven frameworks, automation, and best practices to ensure smooth implementation.",
        benefits: ["Agile implementation methodology", "Automated provisioning and configuration", "Minimal downtime during cutover", "Parallel run and testing phase", "Phased rollout options", "Post-deployment hyper-care"]
    },
    "Analytics & Insights": {
        overview: "Gain valuable insights from your data with our advanced analytics solutions. Real-time dashboards, custom reports, and predictive analytics help you make informed business decisions.",
        benefits: ["Real-time data visualization", "Predictive modeling and forecasting", "Custom report builder", "Data warehousing and ETL", "Business intelligence tools (Power BI, Tableau)", "Self-service analytics for business users"]
    },
    "24/7 Premium Support": {
        overview: "Our dedicated support team is available 24/7/365 to assist with any technical issues. We provide proactive monitoring, rapid response times, and premium support services to keep your business running smoothly.",
        benefits: ["24/7 phone, chat, and email support", "15-minute response SLA for critical issues", "Dedicated account manager", "Quarterly business reviews", "Proactive monitoring and alerting", "Root cause analysis and preventive actions"]
    }
};

const workDetailedContent = {
    "Strategic Partnership": {
        overview: "As a strategic partner, we align our goals with yours. We invest time to understand your business challenges and work collaboratively to develop solutions that drive growth and innovation.",
        benefits: ["Dedicated strategic advisor", "Quarterly strategy sessions", "Innovation roadmap planning", "Co-investment in new capabilities", "Long-term commercial flexibility", "Joint go-to-market opportunities"]
    },
    "Enterprise Value": {
        overview: "We measure our success by your success. Every project is executed with a focus on delivering measurable business value, ROI, and long-term benefits for your enterprise.",
        benefits: ["ROI guarantee on qualified projects", "Value-based pricing options", "Outcome-focused KPIs", "Regular value realization reviews", "Cost optimization recommendations", "Competitive benchmarking"]
    },
    "Innovation First": {
        overview: "We continuously invest in research and development to bring you the latest technologies and innovative solutions. Stay competitive with our future-ready approach.",
        benefits: ["Dedicated R&D team", "Early access to beta technologies", "Innovation workshops and hackathons", "Technology watch and trend reports", "Proof of concept (POC) at no cost", "Patent and IP collaboration"]
    },
    "Client Success": {
        overview: "Our track record speaks for itself. With over 100 successful deployments, 500+ satisfied clients, and 16+ years of excellence, we have the expertise and experience to deliver results.",
        benefits: ["Case studies and reference calls", "Client success manager assigned", "Annual user conferences and events", "Client advisory board participation", "Loyalty rewards and discounts", "Referral program benefits"]
    }
};

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
    
    // Modal states for landing pages
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

    const openLandingPage = (item, type = 'solution') => {
        let detailedContent = null;
        
        if (type === 'solution') {
            detailedContent = solutionDetailedContent[item.title];
        } else if (type === 'delivery') {
            detailedContent = deliveryDetailedContent[item.title];
        } else if (type === 'work') {
            detailedContent = workDetailedContent[item.title];
        }
        
        setLandingData({
            ...item,
            type: type,
            detailedContent: detailedContent
        });
        setLandingModalOpen(true);
        handleTrackClick(item.title || item.name, 'landing_page_view');
    };

    const closeLandingPage = () => {
        setLandingModalOpen(false);
        setLandingData(null);
    };

    const openQuoteModalForItem = (itemName) => {
        setFormData(prev => ({ ...prev, service: itemName }));
        setShowQuoteModal(true);
        closeLandingPage();
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

    // Updated solutions array with reordered cards
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

    // Landing Page Modal Component with Request Quote Form
    const LandingPage = ({ item, onClose, onRequestQuote }) => {
        if (!item) return null;
        
        const content = item.detailedContent;
        const [showInnerQuoteForm, setShowInnerQuoteForm] = useState(false);
        const [innerFormData, setInnerFormData] = useState({
            name: '',
            email: '',
            phone: '',
            message: ''
        });

        const handleInnerInputChange = (e) => {
            const { name, value } = e.target;
            setInnerFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleInnerSubmit = async (e) => {
            e.preventDefault();
            await handleTrackClick(`Landing Page Quote - ${item.title} from ${innerFormData.name}`, 'landing_quote');
            setShowInnerQuoteForm(false);
            setInnerFormData({ name: '', email: '', phone: '', message: '' });
            alert(`Thank you! We'll contact you about ${item.title} within 24 hours.`);
        };
        
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
                cursor: 'pointer',
                overflow: 'auto',
                padding: '20px'
            }} onClick={onClose}>
                <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    maxWidth: '1000px',
                    width: '100%',
                    cursor: 'default',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    position: 'relative'
                }} onClick={(e) => e.stopPropagation()}>
                    <button onClick={onClose} style={{
                        position: 'sticky',
                        top: '20px',
                        right: '20px',
                        float: 'right',
                        background: '#667eea',
                        border: 'none',
                        fontSize: '18px',
                        cursor: 'pointer',
                        color: 'white',
                        width: '35px',
                        height: '35px',
                        borderRadius: '50%',
                        marginTop: '20px',
                        marginRight: '20px',
                        zIndex: 10
                    }}>×</button>
                    
                    <div style={{ padding: '40px', paddingTop: '20px' }}>
                        {item.img && (
                            <img 
                                src={item.img} 
                                alt={item.title || item.name}
                                style={{ 
                                    width: '100%', 
                                    height: '300px', 
                                    objectFit: 'cover', 
                                    borderRadius: '15px',
                                    marginBottom: '30px'
                                }}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://placehold.co/1200x400/667eea/white?text=' + encodeURIComponent(item.title || item.name);
                                }}
                            />
                        )}
                        
                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <FontAwesomeIcon icon={item.icon} style={{ fontSize: '60px', color: '#667eea', marginBottom: '20px' }} />
                            <h1 style={{ color: '#1a1a2e', marginBottom: '15px', fontSize: '36px' }}>{item.title || item.name}</h1>
                            <p style={{ color: '#666', fontSize: '18px', maxWidth: '800px', margin: '0 auto' }}>
                                {content?.overview || "Enterprise-grade solution designed to transform your business operations."}
                            </p>
                        </div>
                        
                        {content && content.benefits && (
                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{ color: '#333', marginBottom: '20px', fontSize: '24px', borderLeft: '4px solid #667eea', paddingLeft: '15px' }}>Key Benefits</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                                    {content.benefits.map((benefit, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#f8f9ff', borderRadius: '10px' }}>
                                            <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#667eea', fontSize: '18px' }} />
                                            <span style={{ color: '#555' }}>{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {content && content.features && (
                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{ color: '#333', marginBottom: '20px', fontSize: '24px', borderLeft: '4px solid #667eea', paddingLeft: '15px' }}>Key Features</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                                    {content.features.map((feature, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#f8f9ff', borderRadius: '10px' }}>
                                            <FontAwesomeIcon icon={faStar} style={{ color: '#FFD700', fontSize: '18px' }} />
                                            <span style={{ color: '#555' }}>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {content && content.useCases && (
                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{ color: '#333', marginBottom: '20px', fontSize: '24px', borderLeft: '4px solid #667eea', paddingLeft: '15px' }}>Use Cases</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {content.useCases.map((useCase, idx) => (
                                        <span key={idx} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '8px 20px', borderRadius: '30px', fontSize: '14px' }}>
                                            {useCase}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {!showInnerQuoteForm ? (
                            <div style={{ textAlign: 'center', marginTop: '40px', padding: '30px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '15px' }}>
                                <h3 style={{ color: 'white', marginBottom: '15px', fontSize: '22px' }}>Ready to get started with {item.title}?</h3>
                                <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '20px' }}>Get a personalized quote tailored to your specific requirements.</p>
                                <button 
                                    onClick={() => setShowInnerQuoteForm(true)}
                                    style={{
                                        padding: '14px 40px',
                                        background: 'white',
                                        color: '#667eea',
                                        border: 'none',
                                        borderRadius: '50px',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'scale(1.05)';
                                        e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'scale(1)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    Request a Quote for {item.title} →
                                </button>
                            </div>
                        ) : (
                            <div style={{ marginTop: '40px', padding: '30px', background: '#f8f9ff', borderRadius: '15px' }}>
                                <h3 style={{ color: '#333', marginBottom: '20px', textAlign: 'center' }}>
                                    Request a Quote for <span style={{ color: '#667eea' }}>{item.title}</span>
                                </h3>
                                <form onSubmit={handleInnerSubmit}>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        placeholder="Full Name" 
                                        required 
                                        value={innerFormData.name}
                                        onChange={handleInnerInputChange}
                                        style={{ 
                                            width: '100%', 
                                            padding: '14px', 
                                            marginBottom: '15px', 
                                            borderRadius: '10px', 
                                            border: '1px solid #ddd',
                                            fontSize: '15px',
                                            boxSizing: 'border-box'
                                        }} 
                                    />
                                    <input 
                                        type="email" 
                                        name="email" 
                                        placeholder="Email Address" 
                                        required 
                                        value={innerFormData.email}
                                        onChange={handleInnerInputChange}
                                        style={{ 
                                            width: '100%', 
                                            padding: '14px', 
                                            marginBottom: '15px', 
                                            borderRadius: '10px', 
                                            border: '1px solid #ddd',
                                            fontSize: '15px',
                                            boxSizing: 'border-box'
                                        }} 
                                    />
                                    <input 
                                        type="tel" 
                                        name="phone" 
                                        placeholder="Phone Number" 
                                        required 
                                        value={innerFormData.phone}
                                        onChange={handleInnerInputChange}
                                        style={{ 
                                            width: '100%', 
                                            padding: '14px', 
                                            marginBottom: '15px', 
                                            borderRadius: '10px', 
                                            border: '1px solid #ddd',
                                            fontSize: '15px',
                                            boxSizing: 'border-box'
                                        }} 
                                    />
                                    <textarea 
                                        name="message" 
                                        placeholder="Tell us about your specific requirements..." 
                                        rows="4" 
                                        value={innerFormData.message}
                                        onChange={handleInnerInputChange}
                                        style={{ 
                                            width: '100%', 
                                            padding: '14px', 
                                            marginBottom: '20px', 
                                            borderRadius: '10px', 
                                            border: '1px solid #ddd',
                                            fontSize: '15px',
                                            boxSizing: 'border-box',
                                            resize: 'vertical'
                                        }} 
                                    ></textarea>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <button 
                                            type="button"
                                            onClick={() => setShowInnerQuoteForm(false)}
                                            style={{
                                                flex: 1,
                                                padding: '14px',
                                                background: '#ccc',
                                                color: '#333',
                                                border: 'none',
                                                borderRadius: '10px',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                fontWeight: '600'
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit"
                                            style={{
                                                flex: 1,
                                                padding: '14px',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '10px',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                fontWeight: '600'
                                            }}
                                        >
                                            Submit Request →
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
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
                                    <FontAwesomeIcon icon={item.icon} className="icon" style={{ fontSize: '50px', marginBottom: '20px', color: hoveredCard === i ? 'white' : '#667eea' }} />
                                    <h3 style={{ marginBottom: '15px', color: hoveredCard === i ? 'white' : '#1a1a2e', fontSize: '1.3rem', fontWeight: '700' }}>{item.title}</h3>
                                    <p style={{ color: hoveredCard === i ? 'rgba(255,255,255,0.9)' : '#666', lineHeight: '1.5' }}>{item.desc}</p>
                                    <button 
                                        className="learn-more-btn"
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
                                            openLandingPage(item, 'delivery');
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
                                    onMouseEnter={() => setHoveredCard(`sol-${idx}`)} 
                                    onMouseLeave={() => setHoveredCard(null)} 
                                >
                                    <img 
                                        src={solution.img} 
                                        alt={solution.title} 
                                        className="solution-card-image"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://placehold.co/600x400/667eea/white?text=' + encodeURIComponent(solution.title);
                                        }}
                                    />
                                    <div className="solution-card-content">
                                        <FontAwesomeIcon icon={solution.icon} className="icon" style={{ fontSize: '40px', marginBottom: '15px', color: '#667eea' }} />
                                        <h3 style={{ marginBottom: '12px', color: '#1a1a2e', fontSize: '1.2rem', fontWeight: '700' }}>{solution.title}</h3>
                                        <p style={{ color: '#666', lineHeight: '1.5', marginBottom: '20px' }}>{solution.desc}</p>
                                        <button 
                                            className="learn-more-btn"
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
                                                marginTop: '10px',
                                                border: 'none'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#764ba2'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
                                            onClick={() => {
                                                handleTrackClick(solution.title, 'solution');
                                                openLandingPage(solution, 'solution');
                                            }}
                                        >
                                            Learn More →
                                        </button>
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
                                        <button 
                                            className="learn-more-btn"
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
                                                marginTop: '10px',
                                                border: 'none'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#764ba2'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
                                            onClick={() => {
                                                handleTrackClick(industry.name, 'industry');
                                                openLandingPage(industry, 'industry');
                                            }}
                                        >
                                            Learn More →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Our Trusted Partners Section */}
                <section ref={partnersRef} id="partners" style={{
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
                                {[...partnerLogos, ...partnerLogos, ...partnerLogos].map((partner, idx) => (
                                    <div 
                                        key={idx}
                                        className="partner-logo-item"
                                        onClick={() => handleTrackClick(partner.name, 'partner')}
                                        style={{ background: 'white' }}
                                    >
                                        <div className="partner-logo-img">
                                            <img 
                                                src={partner.url} 
                                                alt={partner.name}
                                                style={{ filter: 'none' }}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = `https://placehold.co/100x100/667eea/white?text=${partner.name.charAt(0)}`;
                                                }}
                                            />
                                        </div>
                                        <h3 style={{ color: '#333', fontSize: '0.9rem', margin: 0, fontWeight: '600' }}>{partner.name}</h3>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Valued Clients Section - Only the requested clients */}
                <section ref={clientsRef} id="clients" style={{
                    padding: '80px 5%',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #1a1a3e 0%, #2d2d5e 100%)'
                }}>
                    <div className="section-content" style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
                        <h2 style={{ fontSize: '3rem', color: 'white', marginBottom: '15px', fontFamily: "'Playfair Display', serif", fontWeight: '800' }}>Our Valued Clients</h2>
                        <p style={{ color: '#FFD700', marginBottom: '50px', fontSize: '1.1rem' }}>Trusted by industry leaders across India</p>
                        
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
                                    <button 
                                        className="learn-more-btn"
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
                                            marginTop: '10px',
                                            border: 'none'
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#764ba2'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
                                        onClick={() => {
                                            handleTrackClick(item.title, 'workwith');
                                            openLandingPage(item, 'work');
                                        }}
                                    >
                                        Learn More →
                                    </button>
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
                    <div style={{ 
                        position: 'fixed', 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        bottom: 0, 
                        background: 'rgba(0,0,0,0.95)', 
                        backdropFilter: 'blur(10px)', 
                        zIndex: 2000, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        padding: '20px' 
                    }} onClick={() => setShowQuoteModal(false)}>
                        <div style={{ 
                            background: 'linear-gradient(135deg, #1a1a3e 0%, #2d2d5e 100%)', 
                            borderRadius: '20px', 
                            padding: '45px', 
                            maxWidth: '550px', 
                            width: '100%', 
                            position: 'relative', 
                            border: '1px solid rgba(255,255,255,0.2)',
                            maxHeight: '85vh',
                            overflow: 'auto'
                        }} onClick={(e) => e.stopPropagation()}>
                            <button 
                                onClick={() => setShowQuoteModal(false)} 
                                style={{ 
                                    position: 'absolute', 
                                    top: '20px', 
                                    right: '25px', 
                                    background: 'rgba(255,255,255,0.1)', 
                                    border: 'none', 
                                    fontSize: '24px', 
                                    cursor: 'pointer', 
                                    color: 'white', 
                                    width: '35px', 
                                    height: '35px', 
                                    borderRadius: '50%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center' 
                                }}
                            >×</button>
                            <h2 style={{ color: 'white', marginBottom: '25px', textAlign: 'center' }}>✨ Request a Quote</h2>
                            <p style={{ color: '#ccc', textAlign: 'center', marginBottom: '30px', fontSize: '14px' }}>Fill out the form and our team will contact you within 24 hours</p>
                            
                            <form onSubmit={handleSubmitQuote}>
                                <input 
                                    type="text" 
                                    name="name" 
                                    placeholder="Full Name" 
                                    required 
                                    onChange={handleInputChange} 
                                    style={{ 
                                        width: '100%', 
                                        padding: '14px', 
                                        marginBottom: '15px', 
                                        borderRadius: '12px', 
                                        border: '1px solid rgba(255,255,255,0.2)', 
                                        background: 'rgba(255,255,255,0.1)', 
                                        color: 'white', 
                                        fontSize: '15px',
                                        boxSizing: 'border-box'
                                    }} 
                                />
                                <input 
                                    type="email" 
                                    name="email" 
                                    placeholder="Email Address" 
                                    required 
                                    onChange={handleInputChange} 
                                    style={{ 
                                        width: '100%', 
                                        padding: '14px', 
                                        marginBottom: '15px', 
                                        borderRadius: '12px', 
                                        border: '1px solid rgba(255,255,255,0.2)', 
                                        background: 'rgba(255,255,255,0.1)', 
                                        color: 'white', 
                                        fontSize: '15px',
                                        boxSizing: 'border-box'
                                    }} 
                                />
                                <input 
                                    type="tel" 
                                    name="phone" 
                                    placeholder="Phone Number" 
                                    required 
                                    onChange={handleInputChange} 
                                    style={{ 
                                        width: '100%', 
                                        padding: '14px', 
                                        marginBottom: '15px', 
                                        borderRadius: '12px', 
                                        border: '1px solid rgba(255,255,255,0.2)', 
                                        background: 'rgba(255,255,255,0.1)', 
                                        color: 'white', 
                                        fontSize: '15px',
                                        boxSizing: 'border-box'
                                    }} 
                                />
                                
                                <div style={{ position: 'relative', marginBottom: '15px' }}>
                                    <select 
                                        name="service" 
                                        required
                                        value={formData.service}
                                        onChange={handleInputChange} 
                                        style={{ 
                                            width: '100%', 
                                            padding: '14px', 
                                            borderRadius: '12px', 
                                            border: '1px solid rgba(255,255,255,0.2)', 
                                            background: 'rgba(255,255,255,0.1)', 
                                            color: 'white', 
                                            fontSize: '15px',
                                            boxSizing: 'border-box',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="" style={{ background: '#1a1a3e', color: 'white' }}>Select a Service</option>
                                        {solutions.map((s, idx) => (
                                            <option key={idx} value={s.title} style={{ background: '#1a1a3e', color: 'white', padding: '10px' }}>
                                                {s.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <textarea 
                                    name="message" 
                                    placeholder="Tell us about your requirements..." 
                                    rows="4" 
                                    onChange={handleInputChange} 
                                    style={{ 
                                        width: '100%', 
                                        padding: '14px', 
                                        marginBottom: '20px', 
                                        borderRadius: '12px', 
                                        border: '1px solid rgba(255,255,255,0.2)', 
                                        background: 'rgba(255,255,255,0.1)', 
                                        color: 'white', 
                                        fontSize: '15px',
                                        boxSizing: 'border-box',
                                        resize: 'vertical'
                                    }} 
                                ></textarea>
                                
                                <button 
                                    type="submit" 
                                    style={{ 
                                        width: '100%', 
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                                        color: 'white', 
                                        padding: '14px', 
                                        border: 'none', 
                                        borderRadius: '12px', 
                                        fontSize: '16px', 
                                        fontWeight: '600', 
                                        cursor: 'pointer', 
                                        transition: 'all 0.3s' 
                                    }}
                                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                >
                                    Submit Request →
                                </button>
                            </form>
                        </div>
                    </div>
                )}
                
                {/* Landing Page Modal */}
                <LandingPage 
                    item={landingData} 
                    onClose={closeLandingPage} 
                    onRequestQuote={openQuoteModalForItem}
                />

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
                                <p style={{ color: '#aaa', marginBottom: '12px' }}>📧 arunnsales@winzetech.com</p>
                                <p style={{ color: '#aaa', marginBottom: '12px' }}>📞 +91 95500 10417</p>
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

// Add missing icon imports at the top
import { faCheckCircle, faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';

export default WinzePage;