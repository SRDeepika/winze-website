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
    faChevronLeft, faChevronRight, faTimes, faArrowRight, faCheckCircle,
    faCamera, faNetworkWired, faBroadcastTower, faBell, faPhoneAlt
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
    emergency: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=2070&auto=format"
};

// Industry Images for Cards
const industryImages = {
    healthcare: "/images/healthcare.jpg",
    manufacturing: "/images/manufacturing.jpg",
    education: "/images/education.jpg",
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

const clientLogos = [
    { name: "Toshiba", url: "/images/toshiba.png" },
    { name: "Toyota", url: "/images/toyota.png" },
    { name: "Starpacks", url: "/images/starpacks.png" },
    { name: "Athma", url: "/images/athma.png" },
    { name: "Utthunga", url: "/images/utthunga.png" },
    { name: "Sun Bright", url: "/images/sun-bright.png" },
    { name: "CKPC", url: "/images/ckpc.png" },
    { name: "Kyyba", url: "/images/kyyba.png" },
    { name: "Skidata", url: "/images/skidata.png" }
];

// Extended content for solution cards (5+ extra points)
const getSolutionExtraPoints = (title) => {
    const pointsMap = {
        "Video Conferencing": [
            "4K Ultra HD video with automatic lighting adjustment",
            "End-to-end encryption for secure communications",
            "Supports up to 500 participants per meeting",
            "Screen sharing, virtual backgrounds & breakout rooms",
            "Integration with Slack, Teams, Zoom & Google Workspace",
            "AI-powered recording summaries & transcription"
        ],
        "Smart Eye AI": [
            "Real-time threat detection with 99.5% accuracy",
            "Facial recognition with watchlist alerts",
            "Automatic number plate recognition (ANPR)",
            "Abandoned object & loitering detection",
            "Crowd density monitoring & social distancing alerts",
            "Fire and smoke detection from video feeds"
        ],
        "Rental IT Infrastructure": [
            "Pay only for what you use - daily/weekly/monthly",
            "Latest generation laptops, desktops & servers",
            "Free delivery, setup & on-site support",
            "4-hour faulty equipment replacement SLA",
            "Scale up/down based on project requirements",
            "No long-term commitment or capital expenditure"
        ],
        "SaaS Products": [
            "Subscription-based pricing with no upfront costs",
            "Automatic updates & maintenance included",
            "99.99% uptime SLA with multi-region redundancy",
            "GDPR and SOC2 compliant data handling",
            "Customizable to match your business processes",
            "Integration APIs for third-party apps"
        ],
        "Enterprise Software Licensing": [
            "Volume licensing discounts up to 40% off retail",
            "Centralized license management across organization",
            "Compliance audits to prevent penalties",
            "Flexible payment terms (monthly/quarterly/annually)",
            "Dedicated licensing specialist assigned",
            "Software asset management (SAM) services"
        ],
        "IT Infrastructure": [
            "99.999% uptime with redundant architecture",
            "24/7 proactive monitoring and alerting",
            "Scalable design that grows with your business",
            "On-premise, cloud, or hybrid deployment",
            "Energy-efficient hardware reduces costs",
            "Disaster recovery and backup solutions included"
        ],
        "CCTV Services": [
            "24/7 recording with 30-day cloud storage",
            "Remote viewing from any device",
            "Motion-triggered alerts & email notifications",
            "AI-powered people counting & heat mapping",
            "License plate recognition for parking",
            "Tamper detection & camera health monitoring"
        ],
        "Cabling Services": [
            "Cat6, Cat6a, Cat7 & Cat8 copper cabling",
            "Single-mode & multi-mode fiber optics",
            "Cable management & labeling for easy maintenance",
            "Fluke testing & certification for every drop",
            "Greenfield & brownfield project experience",
            "Minimum 25-year warranty on cabling components"
        ],
        "WiFi as a Service": [
            "Predictive monthly subscription pricing",
            "Access points, controllers & licenses included",
            "Guest WiFi with social login & captive portal",
            "Bandwidth management & traffic shaping",
            "Usage analytics & heat mapping",
            "Automatic firmware updates & security patches"
        ],
        "Smart Live Classroom": [
            "Live HD video classes with recording option",
            "Interactive digital whiteboard with annotations",
            "Automated attendance tracking & reporting",
            "Assignment submission & grading system",
            "Parent portal for progress monitoring",
            "Breakout rooms for group activities"
        ],
        "Web & Mobile Development": [
            "End-to-end development from concept to deployment",
            "Agile methodology with 2-week sprints",
            "Responsive design for all screen sizes",
            "API development & third-party integrations",
            "SEO-optimized architecture",
            "Ongoing maintenance & support"
        ],
        "Cyber Security": [
            "24/7 security operations center (SOC) monitoring",
            "Automated threat detection & response",
            "Weekly vulnerability scans & monthly penetration tests",
            "GDPR, HIPAA, PCI-DSS & ISO 27001 compliance",
            "Security awareness training for employees",
            "Incident response & disaster recovery planning"
        ],
        "Unified Communications": [
            "VoIP phone system with auto-attendant",
            "HD video conferencing & screen sharing",
            "Instant messaging with file sharing",
            "Presence detection & calendar integration",
            "Mobile & desktop apps for anywhere access",
            "Call recording & voicemail-to-email"
        ],
        "Contact Center": [
            "Omnichannel queue (voice, email, chat, social)",
            "AI-powered chatbots for instant responses",
            "Sentiment analysis to prioritize upset customers",
            "Real-time dashboards & performance analytics",
            "Skills-based routing to the right agent",
            "Call recording & quality management"
        ],
        "Emergency Notification": [
            "Two-way emergency response coordination with live agent routing",
            "Geo-fencing & indoor positioning technology for精准 alerts",
            "Integration with fire alarm, CCTV & safety systems",
            "Crisis communication templates with one-click activation",
            "Real-time incident tracking with automated number logging"
        ]
    };
    return pointsMap[title] || [
        "Enterprise-grade reliability & performance",
        "24/7 dedicated support team",
        "Scalable architecture for growth",
        "Industry compliance certified",
        "Seamless integration capabilities",
        "Regular updates & improvements"
    ];
};

// Detailed content for solution cards (for landing page)
const solutionDetailedContent = {
    "Video Conferencing": {
        overview: "Our Video Conferencing solution provides enterprise-grade virtual meeting capabilities with crystal-clear HD video, advanced security features, and seamless integration with your existing workflow.",
        benefits: getSolutionExtraPoints("Video Conferencing"),
        features: [
            "Smart gallery view that highlights active speakers",
            "Virtual hand raise, polls, and Q&A sessions",
            "Calendar integration for one-click meeting joins",
            "Custom branding for enterprise accounts",
            "Analytics dashboard with meeting insights"
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
        overview: "Smart Eye AI is an advanced video analytics platform that transforms ordinary CCTV cameras into intelligent security systems.",
        benefits: getSolutionExtraPoints("Smart Eye AI"),
        features: [
            "Centralized dashboard for multiple camera feeds",
            "Mobile app notifications for instant alerts",
            "Search by face, vehicle, or object across recorded footage",
            "Integration with existing CCTV infrastructure",
            "Cloud-based or on-premise deployment options"
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
        overview: "Rental IT Infrastructure provides cost-effective, flexible hardware solutions for businesses of all sizes.",
        benefits: getSolutionExtraPoints("Rental IT Infrastructure"),
        features: [
            "Enterprise-grade laptops (Dell, HP, Lenovo)",
            "High-performance desktops and workstations",
            "Servers and networking equipment",
            "AV equipment including projectors and speakers",
            "Printers, scanners, and peripherals"
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
        overview: "Our custom SaaS products are designed to solve specific business challenges with scalable, cloud-native architecture.",
        benefits: getSolutionExtraPoints("SaaS Products"),
        features: [
            "White-label options for your brand",
            "Role-based access control and permissions",
            "Real-time analytics and custom reports",
            "Mobile-responsive design for on-the-go access",
            "24/7 technical support via chat, email, and phone"
        ],
        useCases: [
            "Small to medium business automation",
            "Enterprise workflow management",
            "Startup MVPs and product launches",
            "Industry-specific solutions",
            "Legacy system modernization"
        ]
    },
    "Enterprise Software Licensing": {
        overview: "We simplify enterprise software licensing by offering volume discounts, compliance management, and dedicated account support.",
        benefits: getSolutionExtraPoints("Enterprise Software Licensing"),
        features: [
            "Microsoft 365 and Azure licensing",
            "Adobe Creative Cloud and Document Cloud",
            "Oracle Database and ERP licenses",
            "SAP S/4HANA and Business Suite",
            "VMware virtualization licenses"
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
        overview: "Our IT Infrastructure solutions provide enterprise-grade networking, server, and storage systems designed for optimal performance.",
        benefits: getSolutionExtraPoints("IT Infrastructure"),
        features: [
            "Hyper-converged infrastructure (HCI)",
            "Enterprise switches, routers, and firewalls",
            "SAN and NAS storage systems",
            "Virtualization with VMware or Hyper-V",
            "Cloud integration (AWS, Azure, GCP)"
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
        overview: "Our comprehensive CCTV services include site survey, camera installation, configuration, cloud storage, and ongoing maintenance.",
        benefits: getSolutionExtraPoints("CCTV Services"),
        features: [
            "4MP and 8MP HD cameras",
            "PTZ (Pan-Tilt-Zoom) cameras for active monitoring",
            "Explosion-proof cameras for hazardous areas",
            "Thermal cameras for perimeter security",
            "Video management software (VMS)"
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
        overview: "We provide professional structured cabling solutions for data centers, offices, and industrial facilities.",
        benefits: getSolutionExtraPoints("Cabling Services"),
        features: [
            "Rack mounting and cable tray installation",
            "Patch panel termination and testing",
            "Fiber splicing and connectorization",
            "Cable pathway design (overhead and underfloor)",
            "Grounding and bonding for safety"
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
        overview: "WiFi as a Service delivers enterprise-grade wireless networking without the capital expense.",
        benefits: getSolutionExtraPoints("WiFi as a Service"),
        features: [
            "WiFi 6 (802.11ax) access points for high density",
            "Cloud-based or on-premise controller options",
            "Captive portal customization for branding",
            "Integration with Active Directory and RADIUS",
            "Self-service onboarding for guests"
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
        overview: "Smart Live Classroom is an interactive virtual learning platform that brings teachers and students together in an engaging digital environment.",
        benefits: getSolutionExtraPoints("Smart Live Classroom"),
        features: [
            "Quiz and poll creation for real-time assessment",
            "Class recordings accessible anytime",
            "Digital library for course materials",
            "Discussion forums and chat moderation",
            "Certificate generation upon course completion"
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
        overview: "Our Web & Mobile Development team builds custom applications using modern technologies like React, Node.js, Flutter, and React Native.",
        benefits: getSolutionExtraPoints("Web & Mobile Development"),
        features: [
            "Frontend: React, Angular, Vue.js",
            "Backend: Node.js, Python, Java, PHP",
            "Mobile: Flutter, React Native, Swift, Kotlin",
            "Database: MySQL, PostgreSQL, MongoDB",
            "DevOps: CI/CD, Docker, Kubernetes"
        ],
        useCases: [
            "E-commerce and marketplace platforms",
            "Enterprise resource planning (ERP) systems",
            "Customer relationship management (CRM)",
            "On-demand service apps",
            "Healthcare and telemedicine portals"
        ]
    },
    "Cyber Security": {
        overview: "Our comprehensive cyber security services protect your business from evolving threats.",
        benefits: getSolutionExtraPoints("Cyber Security"),
        features: [
            "Next-generation firewall (NGFW) management",
            "Endpoint detection and response (EDR)",
            "Email security and anti-phishing protection",
            "Web application firewall (WAF)",
            "Data loss prevention (DLP)"
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
        overview: "Unified Communications brings voice, video, messaging, and collaboration tools into a single platform.",
        benefits: getSolutionExtraPoints("Unified Communications"),
        features: [
            "Auto-attendant and call routing",
            "Ring groups and call queues",
            "Conference calling up to 100 participants",
            "Virtual fax receive and send",
            "Analytics dashboard with call metrics"
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
        overview: "Our AI-powered Contact Center solution transforms customer service with intelligent routing, chatbots, sentiment analysis, and omnichannel support.",
        benefits: getSolutionExtraPoints("Contact Center"),
        features: [
            "Interactive voice response (IVR) with NLP",
            "Click-to-call from your website",
            "Callback and voicemail drop features",
            "Co-browsing and screen sharing",
            "Customer satisfaction (CSAT) surveys"
        ],
        useCases: [
            "E-commerce customer support",
            "Financial services helpdesk",
            "Travel and hospitality reservations",
            "Healthcare appointment scheduling",
            "IT service desk (ITSM)"
        ]
    },
    "Emergency Notification": {
        overview: "Emergency Notification System provides real-time mass alerts and crisis communication. When users click alerts, calls are routed directly to the emergency response center with automatic caller ID tracking.",
        benefits: getSolutionExtraPoints("Emergency Notification"),
        features: [
            "Multi-channel alert delivery (SMS, Email, Push, Voice)",
            "Real-time incident tracking dashboard with number logging",
            "Automated escalation procedures with click-to-call routing",
            "Two-way communication with responders",
            "Integration with existing safety systems and CCTV",
            "Emergency broadcast with automatic number capture"
        ],
        useCases: [
            "Corporate emergency response & evacuation with caller tracking",
            "Healthcare facility emergency alerts with staff routing",
            "Educational campus safety notifications",
            "Industrial plant emergency management",
            "Public venue security & crowd control with response coordination"
        ]
    }
};

// Extended content for delivery items (5+ extra points)
const getDeliveryExtraPoints = (title) => {
    const pointsMap = {
        "End-to-End Solutions": [
            "Strategy consulting and roadmap planning",
            "Vendor selection and procurement",
            "Project management and implementation",
            "User training and change management",
            "24/7 support and maintenance",
            "Continuous optimization and upgrades"
        ],
        "Enterprise Excellence": [
            "SLA-backed uptime guarantees (99.9%)",
            "Real-time performance dashboards",
            "Regular business reviews",
            "Continuous improvement programs",
            "ISO and compliance certifications",
            "Disaster recovery and business continuity"
        ],
        "Flexible Engagement": [
            "Time and material projects",
            "Fixed-price deliverables",
            "Dedicated team engagement",
            "Co-managed IT services",
            "Fully outsourced IT operations",
            "Pay-as-you-go options"
        ],
        "Rapid Deployment": [
            "Agile implementation methodology",
            "Automated provisioning and configuration",
            "Minimal downtime during cutover",
            "Parallel run and testing phase",
            "Phased rollout options",
            "Post-deployment hyper-care"
        ],
        "Analytics & Insights": [
            "Real-time data visualization",
            "Predictive modeling and forecasting",
            "Custom report builder",
            "Data warehousing and ETL",
            "Business intelligence tools (Power BI, Tableau)",
            "Self-service analytics for business users"
        ],
        "24/7 Premium Support": [
            "24/7 phone, chat, and email support",
            "15-minute response SLA for critical issues",
            "Dedicated account manager",
            "Quarterly business reviews",
            "Proactive monitoring and alerting",
            "Root cause analysis and preventive actions"
        ]
    };
    return pointsMap[title] || [
        "Professional service delivery",
        "Quality assurance processes",
        "Risk management framework",
        "Stakeholder communication",
        "Knowledge transfer sessions",
        "Post-implementation review"
    ];
};

// Detailed content for delivery items
const deliveryDetailedContent = {
    "End-to-End Solutions": {
        overview: "We provide complete lifecycle management from initial planning and strategy to deployment, training, and ongoing support.",
        benefits: getDeliveryExtraPoints("End-to-End Solutions")
    },
    "Enterprise Excellence": {
        overview: "We guarantee enterprise-grade excellence with 99.9% uptime, comprehensive performance metrics, and measurable business results.",
        benefits: getDeliveryExtraPoints("Enterprise Excellence")
    },
    "Flexible Engagement": {
        overview: "Choose the engagement model that works best for your business - strategic consulting, project-based delivery, or fully managed services.",
        benefits: getDeliveryExtraPoints("Flexible Engagement")
    },
    "Rapid Deployment": {
        overview: "Our accelerated deployment methodology gets your solutions up and running quickly without disrupting daily operations.",
        benefits: getDeliveryExtraPoints("Rapid Deployment")
    },
    "Analytics & Insights": {
        overview: "Gain valuable insights from your data with our advanced analytics solutions.",
        benefits: getDeliveryExtraPoints("Analytics & Insights")
    },
    "24/7 Premium Support": {
        overview: "Our dedicated support team is available 24/7/365 to assist with any technical issues.",
        benefits: getDeliveryExtraPoints("24/7 Premium Support")
    }
};

// Extended content for work with winze (5+ extra points)
const getWorkExtraPoints = (title) => {
    const pointsMap = {
        "Strategic Partnership": [
            "Dedicated strategic advisor",
            "Quarterly strategy sessions",
            "Innovation roadmap planning",
            "Co-investment in new capabilities",
            "Long-term commercial flexibility",
            "Joint go-to-market opportunities"
        ],
        "Enterprise Value": [
            "ROI guarantee on qualified projects",
            "Value-based pricing options",
            "Outcome-focused KPIs",
            "Regular value realization reviews",
            "Cost optimization recommendations",
            "Competitive benchmarking"
        ],
        "Innovation First": [
            "Dedicated R&D team",
            "Early access to beta technologies",
            "Innovation workshops and hackathons",
            "Technology watch and trend reports",
            "Proof of concept (POC) at no cost",
            "Patent and IP collaboration"
        ],
        "Client Success": [
            "Case studies and reference calls",
            "Client success manager assigned",
            "Annual user conferences and events",
            "Client advisory board participation",
            "Loyalty rewards and discounts",
            "Referral program benefits"
        ]
    };
    return pointsMap[title] || [
        "Trusted partnership approach",
        "Transparent communication",
        "Shared goals & objectives",
        "Regular progress reviews",
        "Continuous feedback loop",
        "Long-term relationship focus"
    ];
};

const workDetailedContent = {
    "Strategic Partnership": {
        overview: "As a strategic partner, we align our goals with yours. We invest time to understand your business challenges and work collaboratively.",
        benefits: getWorkExtraPoints("Strategic Partnership")
    },
    "Enterprise Value": {
        overview: "We measure our success by your success. Every project is executed with a focus on delivering measurable business value.",
        benefits: getWorkExtraPoints("Enterprise Value")
    },
    "Innovation First": {
        overview: "We continuously invest in research and development to bring you the latest technologies and innovative solutions.",
        benefits: getWorkExtraPoints("Innovation First")
    },
    "Client Success": {
        overview: "Our track record speaks for itself. With over 100 successful deployments, 500+ satisfied clients, and 16+ years of excellence.",
        benefits: getWorkExtraPoints("Client Success")
    }
};

// Extended content for industries (5+ extra points) - Updated Healthcare content
const getIndustryExtraPoints = (name) => {
    const pointsMap = {
        "Healthcare": [
            "Advanced telemedicine platforms with multi-specialty support",
            "Integrated Electronic Health Records (EHR) with AI diagnostics",
            "Secure patient portals with 24/7 access to medical records",
            "Remote patient monitoring with real-time vitals tracking",
            "HIPAA-compliant messaging for care team collaboration",
            "Pharmacy management and e-prescription systems"
        ],
        "Manufacturing": [
            "IoT sensors and SCADA systems for real-time monitoring",
            "Predictive maintenance algorithms to reduce downtime",
            "Real-time production monitoring and quality control",
            "Supply chain integration with automated inventory",
            "Digital twin simulation for process optimization",
            "Energy management and sustainability tracking"
        ],
        "Education": [
            "Virtual classrooms with interactive whiteboard capabilities",
            "Comprehensive Learning Management Systems (LMS)",
            "Student information systems for admissions and grading",
            "Parent portal for real-time progress monitoring",
            "Digital library with AI-powered content recommendations",
            "Exam proctoring and anti-cheating solutions"
        ],
        "Logistics & Supply Chain": [
            "Real-time GPS tracking with geofencing alerts",
            "AI-powered route optimization for fuel efficiency",
            "Warehouse management with automated picking systems",
            "Inventory forecasting using machine learning",
            "Last-mile delivery optimization with live tracking",
            "Cross-border compliance and customs documentation"
        ]
    };
    return pointsMap[name] || [
        "Industry-specific compliance certifications",
        "Tailored solution architecture for unique needs",
        "Domain expert consulting and support",
        "Seamless integration with legacy systems",
        "Scalable infrastructure for business growth",
        "24/7 operational support and monitoring"
    ];
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
        } else if (type === 'industry') {
            detailedContent = {
                overview: item.detailedDesc || `Comprehensive ${item.name} solutions tailored for your business needs.`,
                benefits: getIndustryExtraPoints(item.name)
            };
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
        alert(`Thank you ${formData.name}! We'll contact you within 24 hours about ${formData.service}.`);
    };

    const scrollToSection = (ref, sectionName) => {
        handleTrackClick(`Navigation - ${sectionName}`, 'nav');
        if (ref && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Solutions with differentiated icons - Emergency Notification (updated points)
    const solutions = [
        { title: "Video Conferencing", desc: "High-definition virtual meetings with advanced security features.", icon: faVideo, img: solutionImages.video },
        { title: "Smart Eye AI", desc: "Advanced video analytics for proactive security monitoring.", icon: faRobot, img: solutionImages.ai },
        { title: "Rental IT Infrastructure", desc: "Cost-effective hardware rental for projects and events.", icon: faLaptop, img: solutionImages.rental },
        { title: "SaaS Products", desc: "Scalable cloud solutions customized for your business needs.", icon: faCloud, img: solutionImages.saas },
        { title: "Enterprise Software Licensing", desc: "Flexible licensing options for major enterprise software.", icon: faFileAlt, img: solutionImages.software },
        { title: "IT Infrastructure", desc: "Enterprise-grade networking and server solutions for optimal performance.", icon: faServer, img: solutionImages.it },
        { title: "CCTV Services", desc: "End-to-end surveillance solutions with H.265 HD cameras, cloud storage, and AI-powered video analytics.", icon: faCamera, img: "/images/cctv-services.jpg" },
        { title: "Cabling Services", desc: "Active & Passive Cabling solutions including Greenfield projects.", icon: faNetworkWired, img: "/images/cabling-services.jpg" },
        { title: "WiFi as a Service", desc: "Managed wireless solutions for seamless connectivity anywhere.", icon: faBroadcastTower, img: solutionImages.wifi },
        { title: "Smart Live Classroom", desc: "Interactive virtual learning platform with parent access features.", icon: faChalkboard, img: solutionImages.classroom },
        { title: "Web & Mobile Development", desc: "Custom web and mobile applications for your business needs.", icon: faMobileAlt, img: solutionImages.webMobile },
        { title: "Cyber Security", desc: "Advanced threat protection and security compliance solutions.", icon: faLock, img: solutionImages.cyberSecurity },
        { title: "Unified Communications", desc: "Seamless integration of voice, video, and messaging for enterprise collaboration.", icon: faChartLine, img: solutionImages.unified },
        { title: "Contact Center", desc: "AI-powered customer service solutions for enhanced agent productivity.", icon: faHeadset, img: solutionImages.contact },
        { title: "Emergency Notification", desc: "Real-time mass alerts and crisis communication. Calls route directly to emergency response center with automatic number tracking.", icon: faBell, img: solutionImages.emergency }
    ];

    // Industries - removed Banking & Finance and Retail & E-commerce
    const industries = [
        { name: "Healthcare", desc: "Comprehensive healthcare IT solutions including telemedicine, EHR systems, patient portals, and remote patient monitoring.", icon: faHospital, img: industryImages.healthcare, detailedDesc: "End-to-end healthcare technology solutions including AI-powered telemedicine platforms, integrated Electronic Health Records (EHR), secure patient communication portals, remote patient monitoring with IoT devices, pharmacy management systems, and compliance with HIPAA and healthcare regulations." },
        { name: "Manufacturing", desc: "IoT and automation solutions for Industry 4.0 transformation.", icon: faIndustry, img: industryImages.manufacturing, detailedDesc: "Industry 4.0 solutions including IoT sensors, SCADA systems, predictive maintenance, real-time production monitoring, and supply chain integration for smart manufacturing." },
        { name: "Education", desc: "Digital learning platforms for institutions of all sizes.", icon: faGraduationCap, img: industryImages.education, detailedDesc: "Digital learning platforms with virtual classrooms, learning management systems, student information systems, parent portals, and analytics for K-12 and higher education." },
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

    // Card color gradients for different sections
    const getCardGradient = (index, type) => {
        const gradients = {
            delivery: [
                'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb4d)',
                'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
                'linear-gradient(135deg, #23074d, #cc5333)',
                'linear-gradient(135deg, #1f1c2c, #928dab)',
                'linear-gradient(135deg, #000000, #434343)',
                'linear-gradient(135deg, #134e5e, #71b280)'
            ],
            solution: [
                'linear-gradient(135deg, #2b1b4e, #4a2c7a, #7b4c9e)',
                'linear-gradient(135deg, #1a3c2c, #2d6a4f, #40916c)',
                'linear-gradient(135deg, #4a0e4e, #8a2387, #e94057)',
                'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
                'linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b)',
                'linear-gradient(135deg, #004e92, #000428)',
                'linear-gradient(135deg, #2b1b4e, #4a2c7a, #7b4c9e)',
                'linear-gradient(135deg, #1a3c2c, #2d6a4f, #40916c)',
                'linear-gradient(135deg, #4a0e4e, #8a2387, #e94057)',
                'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
                'linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b)',
                'linear-gradient(135deg, #004e92, #000428)',
                'linear-gradient(135deg, #2b1b4e, #4a2c7a, #7b4c9e)',
                'linear-gradient(135deg, #1a3c2c, #2d6a4f, #40916c)',
                'linear-gradient(135deg, #4a0e4e, #8a2387, #e94057)'
            ],
            industry: [
                'linear-gradient(135deg, #0f3443, #34e89e)',
                'linear-gradient(135deg, #f12711, #f5af19)',
                'linear-gradient(135deg, #4b6cb7, #182848)',
                'linear-gradient(135deg, #ff6a00, #ee0979)'
            ],
            work: [
                'linear-gradient(135deg, #360033, #0b8793)',
                'linear-gradient(135deg, #2193b0, #6dd5ed)',
                'linear-gradient(135deg, #7f00ff, #e100ff)',
                'linear-gradient(135deg, #1f4037, #99f2c8)'
            ]
        };
        
        if (type === 'delivery') return gradients.delivery[index % gradients.delivery.length];
        if (type === 'solution') return gradients.solution[index % gradients.solution.length];
        if (type === 'industry') return gradients.industry[index % gradients.industry.length];
        if (type === 'work') return gradients.work[index % gradients.work.length];
        return 'linear-gradient(135deg, #667eea, #764ba2)';
    };

    // Landing Page Modal Component
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
        
        const royalGradient = 'linear-gradient(145deg, #1a1a2e, #16213e, #0f3460)';
        
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.96)',
                zIndex: 10000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                overflow: 'auto',
                padding: '20px'
            }} onClick={onClose}>
                <div style={{
                    background: royalGradient,
                    borderRadius: '28px',
                    maxWidth: '1000px',
                    width: '100%',
                    cursor: 'default',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    position: 'relative',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,215,0,0.3)'
                }} onClick={(e) => e.stopPropagation()}>
                    <button onClick={onClose} style={{
                        position: 'sticky',
                        top: '20px',
                        right: '20px',
                        float: 'right',
                        background: '#FFD700',
                        border: 'none',
                        fontSize: '20px',
                        cursor: 'pointer',
                        color: '#1a1a2e',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        marginTop: '20px',
                        marginRight: '20px',
                        zIndex: 10,
                        fontWeight: 'bold'
                    }}>×</button>
                    
                    <div style={{ padding: '40px', paddingTop: '20px' }}>
                        {item.img && (
                            <img 
                                src={item.img} 
                                alt={item.title || item.name}
                                style={{ 
                                    width: '100%', 
                                    height: '280px', 
                                    objectFit: 'cover', 
                                    borderRadius: '20px',
                                    marginBottom: '30px',
                                    boxShadow: '0 15px 35px rgba(0,0,0,0.3)'
                                }}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://placehold.co/1200x400/FFD700/1a1a2e?text=' + encodeURIComponent(item.title || item.name);
                                }}
                            />
                        )}
                        
                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <FontAwesomeIcon icon={item.icon} style={{ fontSize: '60px', color: '#FFD700', marginBottom: '20px' }} />
                            <h1 style={{ color: 'white', marginBottom: '15px', fontSize: '36px', fontWeight: '800' }}>{item.title || item.name}</h1>
                            <p style={{ color: '#ccc', fontSize: '18px', maxWidth: '800px', margin: '0 auto' }}>
                                {content?.overview || "Enterprise-grade solution designed to transform your business operations."}
                            </p>
                        </div>
                        
                        {content && content.benefits && (
                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{ color: '#FFD700', marginBottom: '20px', fontSize: '24px', borderLeft: '4px solid #FFD700', paddingLeft: '15px' }}>Key Benefits</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                                    {content.benefits.map((benefit, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '15px', backdropFilter: 'blur(5px)' }}>
                                            <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#FFD700', fontSize: '18px' }} />
                                            <span style={{ color: '#eee' }}>{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {content && content.features && (
                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{ color: '#FFD700', marginBottom: '20px', fontSize: '24px', borderLeft: '4px solid #FFD700', paddingLeft: '15px' }}>Key Features</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                                    {content.features.map((feature, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'rgba(255,255,255,0.08)', borderRadius: '15px' }}>
                                            <FontAwesomeIcon icon={faStar} style={{ color: '#FFD700', fontSize: '18px' }} />
                                            <span style={{ color: '#ddd' }}>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {content && content.useCases && (
                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{ color: '#FFD700', marginBottom: '20px', fontSize: '24px', borderLeft: '4px solid #FFD700', paddingLeft: '15px' }}>Use Cases</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                    {content.useCases.map((useCase, idx) => (
                                        <span key={idx} style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#1a1a2e', padding: '8px 20px', borderRadius: '30px', fontSize: '14px', fontWeight: '600' }}>
                                            {useCase}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {!showInnerQuoteForm ? (
                            <div style={{ textAlign: 'center', marginTop: '40px', padding: '35px', background: 'rgba(255,215,0,0.15)', borderRadius: '20px', border: '1px solid rgba(255,215,0,0.3)' }}>
                                <h3 style={{ color: '#FFD700', marginBottom: '15px', fontSize: '22px' }}>Ready to get started with {item.title}?</h3>
                                <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '25px' }}>Get a personalized quote tailored to your specific requirements.</p>
                                <button 
                                    onClick={() => setShowInnerQuoteForm(true)}
                                    style={{
                                        padding: '14px 45px',
                                        background: '#FFD700',
                                        color: '#1a1a2e',
                                        border: 'none',
                                        borderRadius: '50px',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'scale(1.05)';
                                        e.target.style.boxShadow = '0 8px 25px rgba(255,215,0,0.4)';
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
                            <div style={{ marginTop: '40px', padding: '30px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', backdropFilter: 'blur(10px)' }}>
                                <h3 style={{ color: '#FFD700', marginBottom: '20px', textAlign: 'center' }}>
                                    Request a Quote for <span style={{ color: '#FFD700' }}>{item.title}</span>
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
                                            borderRadius: '12px', 
                                            border: '1px solid rgba(255,215,0,0.3)',
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
                                        value={innerFormData.email}
                                        onChange={handleInnerInputChange}
                                        style={{ 
                                            width: '100%', 
                                            padding: '14px', 
                                            marginBottom: '15px', 
                                            borderRadius: '12px', 
                                            border: '1px solid rgba(255,215,0,0.3)',
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
                                        value={innerFormData.phone}
                                        onChange={handleInnerInputChange}
                                        style={{ 
                                            width: '100%', 
                                            padding: '14px', 
                                            marginBottom: '15px', 
                                            borderRadius: '12px', 
                                            border: '1px solid rgba(255,215,0,0.3)',
                                            background: 'rgba(255,255,255,0.1)',
                                            color: 'white',
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
                                            borderRadius: '12px', 
                                            border: '1px solid rgba(255,215,0,0.3)',
                                            background: 'rgba(255,255,255,0.1)',
                                            color: 'white',
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
                                                background: 'rgba(255,255,255,0.2)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
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
                                                background: '#FFD700',
                                                color: '#1a1a2e',
                                                border: 'none',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                fontWeight: '700'
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
                background: 'linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.75) 100%)'
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
                    0% { box-shadow: 0 0 10px rgba(255,215,0,0.3), 0 0 20px rgba(255,215,0,0.2); filter: brightness(1); transform: translateY(0px); }
                    30% { box-shadow: 0 0 40px rgba(255,215,0,0.5), 0 0 60px rgba(255,215,0,0.4); filter: brightness(1.05); transform: translateY(-5px); }
                    60% { box-shadow: 0 0 60px rgba(255,215,0,0.7), 0 0 80px rgba(255,215,0,0.6); filter: brightness(1.08); transform: translateY(-8px); }
                    100% { box-shadow: 0 0 10px rgba(255,215,0,0.3), 0 0 20px rgba(255,215,0,0.2); filter: brightness(1); transform: translateY(0px); }
                }
                
                /* Different floating animations for each section */
                
                /* Delivery Section - Bounce Up & Down */
                @keyframes floatDelivery {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-12px); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
                }
                .delivery-card-animate {
                    animation: floatDelivery 3.5s ease-in-out infinite;
                }
                .delivery-card-animate:nth-child(even) {
                    animation: floatDelivery 4s ease-in-out infinite;
                    animation-delay: 0.5s;
                }
                .delivery-card-animate:nth-child(3n) {
                    animation: floatDelivery 3s ease-in-out infinite;
                    animation-delay: 0.2s;
                }
                
                /* Solutions Section - Slide Left/Right */
                @keyframes floatSolutions {
                    0%, 100% { transform: translateX(0px); }
                    25% { transform: translateX(-6px); }
                    75% { transform: translateX(6px); }
                }
                .solution-card-animate {
                    animation: floatSolutions 4s ease-in-out infinite;
                }
                .solution-card-animate:nth-child(odd) {
                    animation: floatSolutions 3.5s ease-in-out infinite;
                    animation-delay: 0.3s;
                }
                .solution-card-animate:nth-child(3n) {
                    animation: floatSolutions 4.5s ease-in-out infinite;
                    animation-delay: 0.6s;
                }
                
                /* Industries Section - Rotate & Scale subtle */
                @keyframes floatIndustries {
                    0%, 100% { transform: rotate(0deg) scale(1); }
                    50% { transform: rotate(1deg) scale(1.02); box-shadow: 0 25px 45px rgba(0,0,0,0.35); }
                }
                .industry-card-animate {
                    animation: floatIndustries 3.8s ease-in-out infinite;
                }
                .industry-card-animate:nth-child(2) {
                    animation: floatIndustries 4.2s ease-in-out infinite;
                    animation-delay: 0.4s;
                }
                
                /* Work Section - Pulse Glow Effect */
                @keyframes floatWork {
                    0%, 100% { box-shadow: 0 10px 30px rgba(255,215,0,0.1), 0 0 10px rgba(255,215,0,0.2); transform: translateY(0px); }
                    50% { box-shadow: 0 20px 50px rgba(255,215,0,0.3), 0 0 25px rgba(255,215,0,0.4); transform: translateY(-8px); }
                }
                .work-card-animate {
                    animation: floatWork 3.2s ease-in-out infinite;
                }
                .work-card-animate:nth-child(3) {
                    animation: floatWork 3.8s ease-in-out infinite;
                    animation-delay: 0.3s;
                }
                .work-card-animate:nth-child(4) {
                    animation: floatWork 4s ease-in-out infinite;
                    animation-delay: 0.6s;
                }
                
                /* Card glow pulse animation for all cards */
                @keyframes glowPulse {
                    0% { border-color: rgba(255,215,0,0.15); box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
                    50% { border-color: rgba(255,215,0,0.5); box-shadow: 0 15px 35px rgba(255,215,0,0.2); }
                    100% { border-color: rgba(255,215,0,0.15); box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
                }
                
                .marquee-container { width: 100%; overflow: hidden; position: relative; }
                .marquee-content { display: flex; gap: 20px; padding: 20px 10px; width: fit-content; animation: marqueeScroll 25s linear infinite; }
                .marquee-container:hover .marquee-content { animation-play-state: paused; }
                section { position: relative; z-index: 1; }
                .section-content { position: relative; z-index: 2; }
                
                /* Modern Card Styles with Continuous Animations */
                .modern-card {
                    background: linear-gradient(145deg, #1a1a2e, #16213e);
                    border-radius: 24px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    overflow: hidden;
                    backdrop-filter: blur(2px);
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    border: 1px solid rgba(255,215,0,0.2);
                    animation: glowPulse 3s ease-in-out infinite;
                }
                .modern-card:hover {
                    transform: translateY(-15px) scale(1.02);
                    transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
                    border-color: rgba(255,215,0,0.8);
                    box-shadow: 0 30px 50px rgba(0,0,0,0.4);
                }
                .card-inner {
                    padding: 28px 24px 32px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
                .extra-points {
                    margin-top: 20px;
                    border-top: 1px solid rgba(255,215,0,0.2);
                    padding-top: 16px;
                }
                .point-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 10px;
                    font-size: 0.85rem;
                    font-weight: 500;
                }
                .card-image {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }
                .modern-card:hover .card-image {
                    transform: scale(1.05);
                }
                .btn-learn {
                    background: rgba(255,215,0,0.2);
                    backdrop-filter: blur(4px);
                    border: 1px solid rgba(255,215,0,0.5);
                    padding: 10px 24px;
                    border-radius: 40px;
                    font-weight: 600;
                    font-size: 0.85rem;
                    transition: 0.3s;
                    cursor: pointer;
                    width: fit-content;
                    margin-top: 20px;
                    color: #FFD700;
                }
                .btn-learn:hover {
                    background: #FFD700;
                    color: #1a1a2e;
                    border-color: #FFD700;
                    transform: scale(1.05);
                }
                .client-logo-item, .partner-logo-item {
                    background: white; 
                    padding: 20px; 
                    border-radius: 16px; 
                    text-align: center; 
                    cursor: pointer;
                    transition: all 0.3s ease; 
                    box-shadow: 0 4px 15px rgba(0,0,0,0.08); 
                    min-width: 150px;
                    border: 1px solid rgba(0,0,0,0.05); 
                    flex-shrink: 0;
                }
                .client-logo-item:hover, .partner-logo-item:hover { 
                    transform: translateY(-5px); 
                    box-shadow: 0 15px 30px rgba(0,0,0,0.15); 
                    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); 
                }
                .client-logo-item:hover h3, .partner-logo-item:hover h3 { color: #1a1a2e; }
                .client-logo-img, .partner-logo-img { width: 80px; height: 80px; margin: 0 auto 12px; display: flex; align-items: center; justifyContent: center; }
                .client-logo-img img, .partner-logo-img img { width: 100%; height: 100%; object-fit: contain; }
                
                /* Stats Cards Style with vibrant gradients */
                .stat-card {
                    padding: 30px 20px;
                    border-radius: 15px;
                    text-align: center;
                    transition: all 0.3s ease;
                    animation: fadeInUp 0.6s ease-out;
                }
                .stat-card:hover {
                    transform: translateY(-8px);
                }
                
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                /* Logo styling - no button background */
                .logo-clean {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                    background: transparent;
                }
                .logo-image {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    object-fit: contain;
                    background: white;
                    padding: 6px;
                }
            `}</style>
            
            <SEO 
                title="Winze Technologies | Enterprise Communication, Security & AI"
                description="Winze Technologies delivers unified communications, AI security, SaaS products, and IT infrastructure with 16+ years of enterprise expertise."
                keywords="unified communications, contact center, video conferencing, IT infrastructure, AI security, SaaS products, enterprise software, careers"
                url="https://www.winzetech.com"
                image="/og-image.jpg"
                type="website"
            />
            
            <div style={{ fontFamily: "'Poppins', 'Montserrat', sans-serif", overflowX: 'hidden', position: 'relative', background: '#0a0a1a' }}>
                
                <SocialLinks />
                
                {/* Navigation Bar - Clean logo without button background */}
                <nav style={{
                    position: 'sticky',
                    top: 0,
                    left: 0,
                    right: 0,
                    background: scrolled ? 'rgba(10,10,26,0.98)' : 'rgba(10,10,26,0.95)',
                    backdropFilter: 'blur(20px)',
                    padding: '12px 5%',
                    zIndex: 1000,
                    transition: 'all 0.3s',
                    boxShadow: scrolled ? '0 2px 30px rgba(0,0,0,0.3)' : 'none',
                    borderBottom: '1px solid rgba(255,215,0,0.1)'
                }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                        <div 
                            className="logo-clean"
                            onClick={() => setShowLogoModal(true)}
                        >
                            <img 
                                src="/winze-logo.jpg" 
                                alt="Winze Technologies Logo" 
                                className="logo-image"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = '<div style="width:48px;height:48px;background:#FFD700;border-radius:12px;display:flex;align-items:center;justify-content:center;"><span style="color:#1a1a2e;font-size:24px;font-weight:bold">W</span></div><span style="font-weight:800;font-size:1.4rem;background:linear-gradient(135deg,#FFD700 0%,#FFA500 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Winze Technologies</span>';
                                }}
                            />
                            <span style={{ 
                                fontWeight: '800', 
                                fontSize: '1.4rem', 
                                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontFamily: "'Playfair Display', serif",
                                letterSpacing: '-0.5px'
                            }}>Winze Technologies</span>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
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
                                        padding: '8px 18px',
                                        borderRadius: '30px',
                                        transition: 'all 0.3s',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontFamily: "'Poppins', sans-serif",
                                        border: 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)';
                                        e.target.style.color = '#1a1a2e';
                                        e.target.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'transparent';
                                        e.target.style.color = '#ddd';
                                        e.target.style.transform = 'translateY(0)';
                                    }}
                                >
                                    {item.name}
                                </button>
                            ))}
                            <button onClick={(e) => { e.stopPropagation(); setShowQuoteModal(true); handleTrackClick('Get Quote Button', 'cta'); }} style={{
                                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                color: '#1a1a2e',
                                border: 'none',
                                padding: '8px 24px',
                                borderRadius: '30px',
                                cursor: 'pointer',
                                fontWeight: '700',
                                transition: 'all 0.3s',
                                fontFamily: "'Poppins', sans-serif",
                                boxShadow: '0 4px 15px rgba(255,215,0,0.3)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.05)';
                                e.target.style.boxShadow = '0 8px 25px rgba(255,215,0,0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)';
                                e.target.style.boxShadow = '0 4px 15px rgba(255,215,0,0.3)';
                            }}
                            >✨ Get a Quote</button>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section ref={homeRef} id="home" style={{
                    minHeight: '90vh',
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
                                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                                    <span style={{ 
                                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                        padding: '6px 20px',
                                        borderRadius: '30px',
                                        fontSize: '13px',
                                        color: '#1a1a2e',
                                        display: 'inline-block',
                                        fontWeight: '700',
                                        boxShadow: '0 4px 15px rgba(255,215,0,0.3)'
                                    }}>🏆 16+ Years of Excellence</span>
                                    <h1 style={{ 
                                        fontSize: '2.2rem', 
                                        color: 'white', 
                                        display: 'inline-block',
                                        fontFamily: "'Playfair Display', serif", 
                                        fontWeight: '700',
                                        margin: 0,
                                        letterSpacing: '-0.5px'
                                    }}>Winze Technologies</h1>
                                </div>
                                <p style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#ddd', lineHeight: '1.6' }}>Leading Enterprise Communication, Security, and AI Technology Solutions Provider</p>
                                <p style={{ marginBottom: '30px', color: '#aaa', lineHeight: '1.7' }}>With over 16 years of industry experience, Winze Technologies Pvt Ltd specializes in designing, deploying, and supporting integrated technology ecosystems for enterprises across India.</p>
                                
                                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                    <button onClick={(e) => { e.stopPropagation(); setShowQuoteModal(true); handleTrackClick('Free Consultation', 'cta'); }} style={{
                                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                        color: '#1a1a2e',
                                        border: 'none',
                                        padding: '14px 40px',
                                        borderRadius: '50px',
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        boxShadow: '0 4px 15px rgba(255,215,0,0.3)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 8px 25px rgba(255,215,0,0.5)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 15px rgba(255,215,0,0.3)';
                                    }}>✨ Get a Free Consultation →</button>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        handleTrackClick('Explore Solutions', 'cta');
                                        if (solutionsRef.current) {
                                            solutionsRef.current.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }} style={{
                                        background: 'transparent',
                                        color: '#FFD700',
                                        border: '2px solid #FFD700',
                                        padding: '14px 40px',
                                        borderRadius: '50px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'rgba(255,215,0,0.1)';
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
                                        background: 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,165,0,0.1))',
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
                                            border: '2px solid rgba(255,215,0,0.5)',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            display: 'block'
                                        }} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What We Deliver Section - Bounce Up & Down Animation */}
                <section id="delivery" style={{ padding: '100px 5%', position: 'relative', overflow: 'hidden' }}>
                    <DarkBackgroundImage imageSrc={bgImages.delivery} />
                    <div className="section-content" style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                        <h2 style={{ textAlign: 'center', fontSize: '3rem', color: 'white', marginBottom: '15px', fontWeight: '800' }}>What We Deliver</h2>
                        <p style={{ textAlign: 'center', color: '#FFD700', marginBottom: '60px', fontSize: '1.1rem' }}>Comprehensive lifecycle for technology integration</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '35px' }}>
                            {deliveryItems.map((item, i) => {
                                const extraPoints = getDeliveryExtraPoints(item.title);
                                return (
                                    <div 
                                        key={i} 
                                        className="modern-card delivery-card-animate"
                                        style={{ background: getCardGradient(i, 'delivery') }}
                                    >
                                        <div className="card-inner">
                                            <FontAwesomeIcon icon={item.icon} style={{ fontSize: '50px', marginBottom: '20px', color: '#FFD700' }} />
                                            <h3 style={{ marginBottom: '15px', color: 'white', fontSize: '1.4rem', fontWeight: '700' }}>{item.title}</h3>
                                            <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: '1.5', marginBottom: '15px' }}>{item.desc}</p>
                                            <div className="extra-points">
                                                {extraPoints.slice(0,5).map((point, idx) => (
                                                    <div key={idx} className="point-item">
                                                        <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#FFD700', fontSize: '14px' }} />
                                                        <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px' }}>{point}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <button 
                                                className="btn-learn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleTrackClick(item.title, 'delivery');
                                                    openLandingPage(item, 'delivery');
                                                }}
                                            >
                                                Learn More →
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Solutions Portfolio Section - Slide Left/Right Animation */}
                <section ref={solutionsRef} id="solutions" style={{ padding: '100px 5%', position: 'relative', overflow: 'hidden' }}>
                    <BackgroundImage imageSrc={bgImages.solutions} />
                    <div className="section-content" style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                        <h2 style={{ textAlign: 'center', fontSize: '3rem', color: 'white', marginBottom: '15px', fontWeight: '800' }}>Our Solutions Portfolio</h2>
                        <p style={{ textAlign: 'center', color: '#FFD700', marginBottom: '10px', fontSize: '1.2rem', fontStyle: 'italic', fontWeight: '600' }}>Our SOLUTIONS — Practical Action, Bold Ambition, Endless Possibilities</p>
                        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.8)', marginBottom: '60px', fontSize: '1rem' }}>Enterprise-grade technology solutions for modern businesses</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
                            {solutions.map((solution, idx) => {
                                const extraPoints = getSolutionExtraPoints(solution.title);
                                return (
                                    <div 
                                        key={idx} 
                                        className="modern-card solution-card-animate"
                                        style={{ background: getCardGradient(idx, 'solution') }}
                                    >
                                        <img 
                                            src={solution.img} 
                                            alt={solution.title} 
                                            className="card-image"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://placehold.co/600x400/FFD700/1a1a2e?text=' + encodeURIComponent(solution.title);
                                            }}
                                        />
                                        <div className="card-inner">
                                            <FontAwesomeIcon icon={solution.icon} style={{ fontSize: '40px', marginBottom: '15px', color: '#FFD700' }} />
                                            <h3 style={{ marginBottom: '12px', color: 'white', fontSize: '1.2rem', fontWeight: '700' }}>{solution.title}</h3>
                                            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.5', marginBottom: '15px', fontSize: '14px' }}>{solution.desc}</p>
                                            <div className="extra-points">
                                                {extraPoints.slice(0,4).map((point, pid) => (
                                                    <div key={pid} className="point-item">
                                                        <FontAwesomeIcon icon={faStar} style={{ color: '#FFD700', fontSize: '12px' }} />
                                                        <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px' }}>{point}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <button 
                                                className="btn-learn"
                                                onClick={() => {
                                                    handleTrackClick(solution.title, 'solution');
                                                    openLandingPage(solution, 'solution');
                                                }}
                                            >
                                                Learn More →
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Industries Section - Rotate & Scale Animation */}
                <section ref={industriesRef} id="industries" style={{ padding: '100px 5%', position: 'relative', overflow: 'hidden' }}>
                    <DarkBackgroundImage imageSrc={bgImages.industries} />
                    <div className="section-content" style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                        <h2 style={{ textAlign: 'center', fontSize: '3rem', color: 'white', marginBottom: '15px', fontWeight: '800' }}>Industries We Serve</h2>
                        <p style={{ textAlign: 'center', color: '#FFD700', marginBottom: '60px', fontSize: '1.1rem' }}>Transforming businesses across sectors with innovative solutions</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '35px' }}>
                            {industries.map((industry, idx) => {
                                const extraPoints = getIndustryExtraPoints(industry.name);
                                return (
                                    <div 
                                        key={idx} 
                                        className="modern-card industry-card-animate"
                                        style={{ background: getCardGradient(idx, 'industry') }}
                                    >
                                        <img src={industry.img} alt={industry.name} className="card-image" />
                                        <div className="card-inner">
                                            <FontAwesomeIcon icon={industry.icon} style={{ fontSize: '45px', marginBottom: '15px', color: '#FFD700' }} />
                                            <h3 style={{ marginBottom: '10px', color: 'white', fontSize: '1.3rem', fontWeight: '700' }}>{industry.name}</h3>
                                            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.5', fontSize: '0.9rem', marginBottom: '15px' }}>{industry.desc}</p>
                                            <div className="extra-points">
                                                {extraPoints.slice(0,5).map((point, pid) => (
                                                    <div key={pid} className="point-item">
                                                        <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#FFD700', fontSize: '12px' }} />
                                                        <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px' }}>{point}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <button 
                                                className="btn-learn"
                                                onClick={() => {
                                                    handleTrackClick(industry.name, 'industry');
                                                    openLandingPage(industry, 'industry');
                                                }}
                                            >
                                                Learn More →
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Our Trusted Partners Section */}
                <section ref={partnersRef} id="partners" style={{
                    padding: '80px 5%',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
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
                                                    e.target.src = `https://placehold.co/100x100/FFD700/1a1a2e?text=${partner.name.charAt(0)}`;
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

                {/* Our Valued Clients Section */}
                <section ref={clientsRef} id="clients" style={{
                    padding: '80px 5%',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)'
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
                                                    e.target.src = `https://placehold.co/100x100/FFD700/1a1a2e?text=${client.name.charAt(0)}`;
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

                {/* Work With Winze Section - Pulse Glow Animation */}
                <section ref={workwithRef} id="workwith" style={{ padding: '100px 5%', position: 'relative', overflow: 'hidden' }}>
                    <DarkBackgroundImage imageSrc={bgImages.workwith} />
                    <div className="section-content" style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
                        <h2 style={{ fontSize: '3rem', color: 'white', marginBottom: '15px', fontFamily: "'Playfair Display', serif", fontWeight: '800' }}>Why Work With Winze?</h2>
                        <p style={{ color: '#FFD700', marginBottom: '50px', fontSize: '1.1rem' }}>Partner with us for a transformative technology experience</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '35px' }}>
                            {workWithWinze.map((item, idx) => {
                                const extraPoints = getWorkExtraPoints(item.title);
                                return (
                                    <div 
                                        key={idx}
                                        className="modern-card work-card-animate"
                                        style={{ background: getCardGradient(idx, 'work') }}
                                    >
                                        <div className="card-inner">
                                            <FontAwesomeIcon icon={item.icon} style={{ fontSize: '55px', marginBottom: '20px', color: '#FFD700' }} />
                                            <h3 style={{ marginBottom: '15px', color: 'white', fontSize: '1.4rem', fontWeight: '700' }}>{item.title}</h3>
                                            <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: '1.5', marginBottom: '15px' }}>{item.desc}</p>
                                            <div className="extra-points">
                                                {extraPoints.slice(0,5).map((point, pid) => (
                                                    <div key={pid} className="point-item">
                                                        <FontAwesomeIcon icon={faGem} style={{ color: '#FFD700', fontSize: '12px' }} />
                                                        <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px' }}>{point}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <button 
                                                className="btn-learn"
                                                onClick={() => {
                                                    handleTrackClick(item.title, 'workwith');
                                                    openLandingPage(item, 'work');
                                                }}
                                            >
                                                Learn More →
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Our Impact in Numbers Section - Original colorful style */}
                <section ref={statsRef} style={{ padding: '100px 5%', position: 'relative', overflow: 'hidden' }}>
                    <BackgroundImage imageSrc={bgImages.stats} />
                    <div className="section-content" style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
                        <h2 style={{ fontSize: '3rem', color: 'white', marginBottom: '15px', fontFamily: "'Playfair Display', serif", fontWeight: '800' }}>Our Impact in Numbers</h2>
                        <p style={{ color: '#FFD700', marginBottom: '50px', fontSize: '1.2rem', fontStyle: 'italic', fontWeight: '600' }}>Delivering excellence through measurable results and proven success</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
                            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: '1px solid rgba(255,255,255,0.3)', animation: 'pulse 2s infinite' }}>
                                <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'white', marginBottom: '15px' }}>{counters.years}+</div>
                                <h3 style={{ fontSize: '1.3rem', color: 'white', marginBottom: '10px', fontWeight: 'bold' }}>Years in Business</h3>
                                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', lineHeight: '1.4' }}>Extensive Experience in delivering IT Solutions & Services</p>
                            </div>

                            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', border: '1px solid rgba(255,255,255,0.3)', animation: 'pulse 2s infinite 0.3s' }}>
                                <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'white', marginBottom: '15px' }}>{counters.expertise}+</div>
                                <h3 style={{ fontSize: '1.3rem', color: 'white', marginBottom: '10px', fontWeight: 'bold' }}>Expertise</h3>
                                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', lineHeight: '1.4' }}>Domain experts delivering cutting-edge solutions</p>
                            </div>

                            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', border: '1px solid rgba(255,255,255,0.3)', animation: 'pulse 2s infinite 0.6s' }}>
                                <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'white', marginBottom: '15px' }}>{counters.clients}+</div>
                                <h3 style={{ fontSize: '1.3rem', color: 'white', marginBottom: '10px', fontWeight: 'bold' }}>Clients</h3>
                                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', lineHeight: '1.4' }}>Trusted by businesses across the globe</p>
                            </div>

                            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', border: '1px solid rgba(255,255,255,0.3)', animation: 'pulse 2s infinite 0.9s' }}>
                                <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'white', marginBottom: '15px' }}>{counters.awards}+</div>
                                <h3 style={{ fontSize: '1.3rem', color: 'white', marginBottom: '10px', fontWeight: 'bold' }}>Awards</h3>
                                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', lineHeight: '1.4' }}>Industry recognition for excellence & innovation</p>
                            </div>

                            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', border: '1px solid rgba(255,255,255,0.3)', animation: 'pulse 2s infinite 1.2s' }}>
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
                                position: 'absolute', top: '-50px', right: '-50px', background: '#FFD700', border: 'none',
                                fontSize: '30px', cursor: 'pointer', color: '#1a1a2e', width: '40px', height: '40px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', fontWeight: 'bold'
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
                            background: 'linear-gradient(145deg, #1a1a2e, #16213e)', 
                            borderRadius: '28px', 
                            padding: '45px', 
                            maxWidth: '550px', 
                            width: '100%', 
                            position: 'relative', 
                            border: '1px solid rgba(255,215,0,0.3)',
                            maxHeight: '85vh',
                            overflow: 'auto'
                        }} onClick={(e) => e.stopPropagation()}>
                            <button 
                                onClick={() => setShowQuoteModal(false)} 
                                style={{ 
                                    position: 'absolute', 
                                    top: '20px', 
                                    right: '25px', 
                                    background: '#FFD700', 
                                    border: 'none', 
                                    fontSize: '20px', 
                                    cursor: 'pointer', 
                                    color: '#1a1a2e', 
                                    width: '35px', 
                                    height: '35px', 
                                    borderRadius: '50%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    fontWeight: 'bold'
                                }}
                            >×</button>
                            <h2 style={{ color: '#FFD700', marginBottom: '25px', textAlign: 'center' }}>✨ Request a Quote</h2>
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
                                        border: '1px solid rgba(255,215,0,0.3)', 
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
                                        border: '1px solid rgba(255,215,0,0.3)', 
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
                                        border: '1px solid rgba(255,215,0,0.3)', 
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
                                            border: '1px solid rgba(255,215,0,0.3)', 
                                            background: 'rgba(255,255,255,0.1)', 
                                            color: 'white', 
                                            fontSize: '15px',
                                            boxSizing: 'border-box',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="" style={{ background: '#1a1a2e', color: 'white' }}>Select a Service</option>
                                        {solutions.map((s, idx) => (
                                            <option key={idx} value={s.title} style={{ background: '#1a1a2e', color: 'white', padding: '10px' }}>
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
                                        border: '1px solid rgba(255,215,0,0.3)', 
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
                                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', 
                                        color: '#1a1a2e', 
                                        padding: '14px', 
                                        border: 'none', 
                                        borderRadius: '12px', 
                                        fontSize: '16px', 
                                        fontWeight: '700', 
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
                {landingModalOpen && (
                    <LandingPage 
                        item={landingData} 
                        onClose={closeLandingPage} 
                        onRequestQuote={openQuoteModalForItem}
                    />
                )}

                {/* Footer */}
                <footer style={{ background: '#0a0a1a', color: 'white', padding: '60px 5% 30px', borderTop: '1px solid rgba(255,215,0,0.1)' }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '45px', marginBottom: '45px' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', cursor: 'pointer' }} onClick={() => setShowLogoModal(true)}>
                                    <img src="/winze-logo.jpg" alt="Logo" style={{ width: '45px', height: '45px', objectFit: 'contain', background: 'white', padding: '6px', borderRadius: '10px' }} />
                                    <span style={{ fontWeight: '800', fontSize: '1.2rem', background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Winze Technologies</span>
                                </div>
                                <p style={{ color: '#aaa', lineHeight: '1.6' }}>Driving Innovation through Customer-Centric Technology Solutions.</p>
                            </div>
                            <div>
                                <h4 style={{ marginBottom: '20px', color: '#FFD700', fontSize: '1.1rem' }}>Quick Links</h4>
                                {navItems.map((item) => (
                                    <p key={item.name}>
                                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollToSection(item.ref, item.name); }} style={{ color: '#aaa', background: 'none', border: 'none', display: 'block', marginBottom: '12px', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.3s' }}
                                        onMouseEnter={(e) => e.target.style.color = '#FFD700'}
                                        onMouseLeave={(e) => e.target.style.color = '#aaa'}>
                                            {item.name}
                                        </button>
                                    </p>
                                ))}
                            </div>
                            <div>
                                <h4 style={{ marginBottom: '20px', color: '#FFD700', fontSize: '1.1rem' }}>Contact Info</h4>
                                <p style={{ color: '#aaa', marginBottom: '12px' }}>📧 sales@winzetech.com</p>
                                <p style={{ color: '#aaa', marginBottom: '12px' }}>📞 +91 95500 10417</p>
                                <p style={{ color: '#aaa', marginBottom: '12px' }}>🌐 www.winzetech.com</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'center', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', color: '#666' }}>
                            <p>© 2025 Winze Technologies Pvt Ltd. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
            </>
        </HelmetProvider>
    );
};

export default WinzePage;