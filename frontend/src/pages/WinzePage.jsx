import SocialLinks from '../components/SocialLinks';
import React, { useState, useEffect, useRef } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import SEO from '../components/SEO';
import { trackClick, submitQuote } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChartLine, faShieldAlt, faHeadset, faVideo, faServer, faRobot, 
    faChalkboard, faCloud, faFileAlt, faLaptop, faWifi, faMobileAlt, 
    faLock, faHospital, faIndustry, faGraduationCap, faBuilding,
    faTruck, faShoppingCart, faHandshake, faStar, faRocket,
    faInfinity, faCrown, faGem, faBolt, faUsers,
    faBriefcase, faTrophy, faGlobe, faLightbulb, faProjectDiagram,
    faChevronLeft, faChevronRight, faTimes, faArrowRight, faCheckCircle,
    faCamera, faNetworkWired, faBroadcastTower, faBell, faPhoneAlt, faPhoneVolume,
    faCar, faParking, faArrowUp
} from '@fortawesome/free-solid-svg-icons';
import { 
    faLinkedin, 
    faWhatsapp, 
    faFacebook, 
    faInstagram,
    faTwitter,
    faYoutube
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

// ========== BACKGROUND VIDEOS (LOCAL AI WITH CDN FALLBACK) ==========
const bgVideos = {
    hero: "/videos/background-video.mp4",
    heroFallback: "https://assets.mixkit.co/videos/preview/mixkit-blockchain-technology-loop-42858-large.mp4"
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
    emergency: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=2070&auto=format",
    boomBarrier: "/images/boom-barrier.jpg" 
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

// Social Links for Footer
const footerSocialLinks = [
    { icon: faLinkedin, url: "https://linkedin.com/company/winze-tech", name: "LinkedIn", color: "#0077B5" },
    { icon: faWhatsapp, url: "https://wa.me/919550010417", name: "WhatsApp", color: "#25D366" },
    { icon: faFacebook, url: "https://facebook.com/winzetech", name: "Facebook", color: "#1877F2" },
    { icon: faInstagram, url: "https://instagram.com/winzetech", name: "Instagram", color: "#E4405F" },
    { icon: faTwitter, url: "https://twitter.com/winzetech", name: "Twitter", color: "#1DA1F2" },
    { icon: faYoutube, url: "https://youtube.com/@winzetech", name: "YouTube", color: "#FF0000" }
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
            "Automated voice broadcast to thousands of numbers simultaneously",
            "Two-way emergency response coordination with live agent routing",
            "Click-to-call integration with automatic number logging",
            "Crisis communication templates with one-click voice activation",
            "Real-time incident tracking with automated call records"
        ],
        "Boom Barrier System": [
            "Automatic vehicle number plate recognition (ANPR) for seamless entry",
            "Remote monitoring & control via mobile app or web dashboard",
            "Integration with RFID, biometrics & access control systems",
            "High-speed boom operation (2-3 seconds for vehicle pass)",
            "Heavy-duty boom arm (2-6 meters length) for various entry widths",
            "Vehicle counting & traffic flow analytics with real-time reports"
        ],
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
        overview: "Emergency Notification System provides automated voice-based mass alerting and crisis communication. When users receive voice alerts, calls are routed directly to the emergency response center with automatic caller ID tracking.",
        benefits: getSolutionExtraPoints("Emergency Notification"),
        features: [
            "Automated voice broadcast to thousands of recipients instantly",
            "Real-time incident tracking dashboard with call logging",
            "Automated escalation procedures with click-to-call routing",
            "Two-way voice communication with emergency responders",
            "Integration with existing PBX and phone systems",
            "Emergency voice broadcast with automatic number capture"
        ],
        useCases: [
            "Corporate emergency response & evacuation with voice alerts",
            "Healthcare facility emergency codes via phone broadcast",
            "Educational campus safety voice notifications",
            "Industrial plant emergency voice communication",
            "Public venue security & crowd control with voice response"
        ]
    },
    "Boom Barrier System": {
        overview: "Our Boom Barrier System provides automated vehicle access control with high-speed operation, ANPR integration, and real-time monitoring. Perfect for residential communities, corporate parks, parking lots, and industrial facilities.",
        benefits: getSolutionExtraPoints("Boom Barrier System"),
        features: [
            "Automatic number plate recognition (ANPR) for vehicle identification",
            "Remote control via mobile app & web dashboard",
            "Integration with RFID cards & biometric systems",
            "Real-time vehicle counting & traffic analytics",
            "Manual operation mode for power backup",
            "LED indicators for entry/exit status",
            "Anti-tailgating & vehicle following detection"
        ],
        useCases: [
            "Residential gated communities & apartments",
            "Corporate office parking management",
            "Shopping mall & retail parking lots",
            "Airport & transport hub access control",
            "Industrial facility & warehouse entry",
            "Hotel & resort vehicle access",
            "Government & defense installations"
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

// Extended content for industries (5+ extra points)
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
    const [showBackToTop, setShowBackToTop] = useState(false);
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

    const [heroMouse, setHeroMouse] = useState({ x: 50, y: 50 });
    const [heroMouseActive, setHeroMouseActive] = useState(false);
    
    const statsRef = useRef(null);
    const homeRef = useRef(null);
    const solutionsRef = useRef(null);
    const industriesRef = useRef(null);
    const partnersRef = useRef(null);
    const clientsRef = useRef(null);
    const workwithRef = useRef(null);

    const handleHeroMouseMove = (e) => {
        if (!homeRef.current) return;
        const rect = homeRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setHeroMouse({ x, y });
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
            setShowBackToTop(window.scrollY > 500);
        };
        
        window.addEventListener('scroll', handleScroll);
        
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

        // Premium dynamic scroll entrance observer
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight) {
                    entry.target.classList.add('active');
                    scrollObserver.unobserve(entry.target); // Stop observing once active for peak frame-rates
                }
            });
        }, { 
            threshold: 0.01,
            rootMargin: '150px 0px 100px 0px' // Triggers early so user does not experience entry lag!
        });

        const timer = setTimeout(() => {
            document.querySelectorAll('.scroll-animate').forEach(el => {
                scrollObserver.observe(el);
            });
        }, 100);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
            scrollObserver.disconnect();
            clearTimeout(timer);
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

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
        
        const quoteData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            service: formData.service,
            message: formData.message,
            source: 'Winze Website Quote Form',
            status: 'pending'
        };
        
        try {
            const response = await submitQuote(quoteData);
            console.log('Quote saved to database:', response);
            alert(`Thank you ${formData.name}! We'll contact you within 24 hours about ${formData.service}.`);
            setShowQuoteModal(false);
            setFormData({ name: '', email: '', phone: '', service: '', message: '' });
        } catch (error) {
            console.error('Quote submission failed:', error);
            alert('There was an error submitting your quote. Please try again later.');
        }
    };

    const scrollToSection = (ref, sectionName, path) => {
        handleTrackClick(`Navigation - ${sectionName}`, 'nav');
        
        if (path) {
            window.location.href = path;
            return;
        }
        
        if (ref && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Solutions
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
        { title: "Emergency Notification", desc: "Automated voice-based mass alerts and crisis communication. Calls route directly to emergency response center with automatic number tracking.", icon: faPhoneVolume, img: solutionImages.emergency },
        { title: "Boom Barrier System", desc: "High-speed automatic vehicle access control with ANPR, RFID integration, and real-time monitoring for secure entry management.", icon: faCar, img: solutionImages.boomBarrier },
    ];

    // Industries
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
        { name: "Work With Winze", ref: workwithRef },
        { name: "Careers", ref: null, path: "/careers" },
        { name: "Blogs", ref: null, path: "/blogs" }
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

    // Enhanced Jewel Spectrum Card Styles with distinct vibrant color mapping per card
    const getCardStyles = (index, sectionType) => {
        // Define a beautiful spectrum of bright jewel gradient colors!
        const spectrum = [
            // 0: Electric Cyan / Aqua Glow
            {
                glow: '#00E5FF',
                glow2: '#00B0FF',
                glowSoft: 'rgba(0, 229, 255, 0.22)',
                rgb: '0, 229, 255'
            },
            // 1: Electric Amethyst Purple Glow
            {
                glow: '#7C4DFF',
                glow2: '#E040FB',
                glowSoft: 'rgba(124, 77, 255, 0.22)',
                rgb: '124, 77, 255'
            },
            // 2: Vivid Emerald Green Glow
            {
                glow: '#00E676',
                glow2: '#B2FF59',
                glowSoft: 'rgba(0, 230, 118, 0.22)',
                rgb: '0, 230, 118'
            },
            // 3: Glowing Sunset Rose Glow
            {
                glow: '#FF1744',
                glow2: '#FF9100',
                glowSoft: 'rgba(255, 23, 68, 0.22)',
                rgb: '255, 23, 68'
            },
            // 4: Oceanic Sapphire Glow
            {
                glow: '#2979FF',
                glow2: '#00E5FF',
                glowSoft: 'rgba(41, 121, 255, 0.22)',
                rgb: '41, 121, 255'
            },
            // 5: Neon Sunfire Glow
            {
                glow: '#FF9100',
                glow2: '#FF3D00',
                glowSoft: 'rgba(255, 145, 0, 0.22)',
                rgb: '255, 145, 0'
            },
            // 6: Deep Cybermint Glow
            {
                glow: '#00B0FF',
                glow2: '#00E676',
                glowSoft: 'rgba(0, 176, 255, 0.22)',
                rgb: '0, 176, 255'
            },
            // 7: Bright Coral Purple Glow
            {
                glow: '#E040FB',
                glow2: '#FF1744',
                glowSoft: 'rgba(224, 64, 251, 0.22)',
                rgb: '224, 64, 251'
            }
        ];

        // Shift index based on sectionType so that sections look distinct and unique!
        let offset = 0;
        if (sectionType === 'delivery') offset = 0;
        else if (sectionType === 'solution') offset = 2;
        else if (sectionType === 'industry') offset = 4;
        else if (sectionType === 'work') offset = 6;

        const theme = spectrum[(index + offset) % spectrum.length];
        return {
            '--card-glow': theme.glow,
            '--card-glow-2': theme.glow2,
            '--card-glow-soft': theme.glowSoft,
            '--card-glow-rgb': theme.rgb
        };
    };

    // Updated Landing Page Modal Component
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
            const quoteData = {
                name: innerFormData.name,
                email: innerFormData.email,
                phone: innerFormData.phone,
                message: innerFormData.message,
                service: item.title || item.name,
                source: 'Landing Page Quote Form',
                status: 'pending'
            };
            
            try {
                const response = await submitQuote(quoteData);
                console.log('Quote saved from landing page:', response);
                alert(`Thank you! We'll contact you about ${item.title || item.name} within 24 hours.`);
                setShowInnerQuoteForm(false);
                setInnerFormData({ name: '', email: '', phone: '', message: '' });
            } catch (error) {
                console.error('Quote submission failed:', error);
                alert('There was an error. Please try again later.');
            }
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
                flexDirection: 'column',
                cursor: 'pointer',
                overflow: 'auto',
                padding: 0
            }} onClick={onClose}>
                <div style={{
                    background: royalGradient,
                    width: '100%',
                    minHeight: '100vh',
                    cursor: 'default',
                    position: 'relative',
                    boxShadow: 'none',
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column'
                }} onClick={(e) => e.stopPropagation()}>
                    <div style={{
                        position: 'sticky',
                        top: 20,
                        right: 20,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        zIndex: 100,
                        padding: '20px 40px 0 0'
                    }}>
                        <button onClick={onClose} style={{
                            background: '#00E5FF',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: '#05020c',
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.background = '#fff';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.background = '#00E5FF';
                        }}>
                            ×
                        </button>
                    </div>
                    
                    {item.img && (
                        <div style={{
                            width: '100%',
                            height: '50vh',
                            minHeight: '350px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <img 
                                src={item.img} 
                                alt={item.title || item.name}
                                style={{ 
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0
                                }}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://placehold.co/1920x600/FFD700/1a1a2e?text=' + encodeURIComponent(item.title || item.name);
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: 'linear-gradient(to top, #1a1a2e 0%, transparent 100%)',
                                padding: '60px 40px 30px'
                            }} />
                        </div>
                    )}
                    
                    <div style={{ 
                        maxWidth: '1200px', 
                        margin: '0 auto', 
                        padding: showInnerQuoteForm ? '20px 40px 60px' : '0 40px 80px',
                        width: '100%'
                    }}>
                        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                            <FontAwesomeIcon icon={item.icon} style={{ fontSize: '70px', color: '#00E5FF', marginBottom: '20px' }} />
                            <h1 style={{ color: 'white', marginBottom: '20px', fontSize: '48px', fontWeight: '800', fontFamily: "'Playfair Display', serif" }}>
                                {item.title || item.name}
                            </h1>
                            <div style={{ 
                                width: '80px', 
                                height: '4px', 
                                background: '#00E5FF', 
                                margin: '0 auto 25px',
                                borderRadius: '2px'
                            }} />
                            <p style={{ color: '#ddd', fontSize: '18px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
                                {content?.overview || "Enterprise-grade solution designed to transform your business operations."}
                            </p>
                        </div>
                        
                        {content && content.benefits && (
                            <div style={{ marginBottom: '50px' }}>
                                <h2 style={{ 
                                    color: '#00E5FF', 
                                    marginBottom: '30px', 
                                    fontSize: '32px',
                                    fontWeight: '700',
                                    borderLeft: '4px solid #00E5FF',
                                    paddingLeft: '20px'
                                }}>
                                    Key Benefits
                                </h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                                    {content.benefits.map((benefit, idx) => (
                                        <div key={idx} style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '15px', 
                                            padding: '18px', 
                                            background: 'rgba(255,255,255,0.08)', 
                                            borderRadius: '16px',
                                            transition: 'transform 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                                        >
                                            <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#00E5FF', fontSize: '22px', minWidth: '24px' }} />
                                            <span style={{ color: '#eee', fontSize: '15px', lineHeight: '1.5' }}>{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {content && content.features && (
                            <div style={{ marginBottom: '50px' }}>
                                <h2 style={{ 
                                    color: '#00E5FF', 
                                    marginBottom: '30px', 
                                    fontSize: '32px',
                                    fontWeight: '700',
                                    borderLeft: '4px solid #00E5FF',
                                    paddingLeft: '20px'
                                }}>
                                    Key Features
                                </h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                                    {content.features.map((feature, idx) => (
                                        <div key={idx} style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '15px', 
                                            padding: '18px', 
                                            background: 'rgba(255,255,255,0.05)', 
                                            borderRadius: '16px',
                                            border: '1px solid rgba(0,229,255,0.15)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(0,229,255,0.1)';
                                            e.currentTarget.style.borderColor = 'rgba(0,229,255,0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                            e.currentTarget.style.borderColor = 'rgba(0,229,255,0.15)';
                                        }}
                                        >
                                            <FontAwesomeIcon icon={faStar} style={{ color: '#00E5FF', fontSize: '20px', minWidth: '22px' }} />
                                            <span style={{ color: '#ddd', fontSize: '15px' }}>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {content && content.useCases && (
                            <div style={{ marginBottom: '60px' }}>
                                <h2 style={{ 
                                    color: '#00E5FF', 
                                    marginBottom: '30px', 
                                    fontSize: '32px',
                                    fontWeight: '700',
                                    borderLeft: '4px solid #00E5FF',
                                    paddingLeft: '20px'
                                }}>
                                    Use Cases
                                </h2>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                                    {content.useCases.map((useCase, idx) => (
                                        <span key={idx} style={{ 
                                            background: 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,176,255,0.15))',
                                            color: '#00E5FF',
                                            padding: '10px 24px',
                                            borderRadius: '40px',
                                            fontSize: '15px',
                                            fontWeight: '500',
                                            border: '1px solid rgba(0,229,255,0.3)'
                                        }}>
                                            {useCase}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {!showInnerQuoteForm ? (
                            <div style={{ 
                                textAlign: 'center', 
                                marginTop: '40px', 
                                padding: '50px 40px', 
                                background: 'linear-gradient(135deg, rgba(0,229,255,0.1), rgba(0,176,255,0.05))',
                                borderRadius: '24px',
                                border: '1px solid rgba(0,229,255,0.2)'
                            }}>
                                <h3 style={{ color: '#00E5FF', marginBottom: '15px', fontSize: '28px', fontWeight: '700' }}>
                                    Ready to get started with {item.title || item.name}?
                                </h3>
                                <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '30px', fontSize: '16px', maxWidth: '600px', margin: '0 auto 30px' }}>
                                    Get a personalized quote tailored to your specific requirements.
                                </p>
                                <button 
                                    onClick={() => setShowInnerQuoteForm(true)}
                                    style={{
                                        padding: '16px 50px',
                                        background: '#00E5FF',
                                        color: '#05020c',
                                        border: 'none',
                                        borderRadius: '50px',
                                        cursor: 'pointer',
                                        fontSize: '18px',
                                        fontWeight: '700',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 15px rgba(0,229,255,0.3)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'scale(1.05)';
                                        e.target.style.boxShadow = '0 8px 25px rgba(0,229,255,0.5)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'scale(1)';
                                        e.target.style.boxShadow = '0 4px 15px rgba(0,229,255,0.3)';
                                    }}
                                >
                                    Request a Quote for {item.title || item.name} →
                                </button>
                            </div>
                        ) : (
                            <div style={{ 
                                marginTop: '40px', 
                                padding: '45px', 
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(0,0,0,0.3))',
                                borderRadius: '28px',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(0,229,255,0.3)',
                                maxWidth: '700px',
                                margin: '40px auto 0'
                            }}>
                                <h3 style={{ color: '#00E5FF', marginBottom: '25px', textAlign: 'center', fontSize: '28px', fontWeight: '700' }}>
                                    Request a Quote for <span style={{ color: '#00E5FF' }}>{item.title || item.name}</span>
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
                                            padding: '16px', 
                                            marginBottom: '18px', 
                                            borderRadius: '14px', 
                                            border: '1px solid rgba(0,229,255,0.3)',
                                            background: 'rgba(255,255,255,0.1)',
                                            color: 'white',
                                            fontSize: '16px',
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
                                            padding: '16px', 
                                            marginBottom: '18px', 
                                            borderRadius: '14px', 
                                            border: '1px solid rgba(0,229,255,0.3)',
                                            background: 'rgba(255,255,255,0.1)',
                                            color: 'white',
                                            fontSize: '16px',
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
                                            padding: '16px', 
                                            marginBottom: '18px', 
                                            borderRadius: '14px', 
                                            border: '1px solid rgba(0,229,255,0.3)',
                                            background: 'rgba(255,255,255,0.1)',
                                            color: 'white',
                                            fontSize: '16px',
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
                                            padding: '16px', 
                                            marginBottom: '25px', 
                                            borderRadius: '14px', 
                                            border: '1px solid rgba(0,229,255,0.3)',
                                            background: 'rgba(255,255,255,0.1)',
                                            color: 'white',
                                            fontSize: '16px',
                                            boxSizing: 'border-box',
                                            resize: 'vertical'
                                        }} 
                                    />
                                    <div style={{ display: 'flex', gap: '20px' }}>
                                        <button 
                                            type="button"
                                            onClick={() => setShowInnerQuoteForm(false)}
                                            style={{
                                                flex: 1,
                                                padding: '14px',
                                                background: 'rgba(255,255,255,0.15)',
                                                color: 'white',
                                                border: '1px solid rgba(255,255,255,0.3)',
                                                borderRadius: '14px',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                fontWeight: '600',
                                                transition: 'all 0.3s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.25)'}
                                            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit"
                                            style={{
                                                flex: 1,
                                                padding: '14px',
                                                background: '#00E5FF',
                                                color: '#05020c',
                                                border: 'none',
                                                borderRadius: '14px',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                fontWeight: '700',
                                                transition: 'all 0.3s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.transform = 'scale(1.02)';
                                                e.target.style.boxShadow = '0 4px 15px rgba(0,229,255,0.4)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.transform = 'scale(1)';
                                                e.target.style.boxShadow = 'none';
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

    const BackgroundVideo = ({ videoSrc, fallbackVideo }) => (
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
            <video 
                autoPlay 
                loop 
                muted 
                playsInline
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: 0.78
                }}
            >
                <source src={videoSrc} type="video/mp4" />
                {fallbackVideo && <source src={fallbackVideo} type="video/mp4" />}
            </video>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(5, 3, 20, 0.82) 0%, rgba(18, 7, 44, 0.52) 50%, rgba(5, 3, 20, 0.88) 100%)',
                mixBlendMode: 'multiply'
            }} />
        </div>
    );

    return (
        <HelmetProvider>
            <>
             <style>{`
                @keyframes techScanline {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                @keyframes radarPulse {
                    0% { transform: scale(0.9); opacity: 0.3; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                    100% { transform: scale(0.9); opacity: 0.3; }
                }
                @keyframes floatSubtle {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-6px) rotate(0.5deg); }
                }
                @keyframes gridRotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes scrollBounce {
                    0%, 100% { transform: translateY(0); opacity: 0.5; }
                    50% { transform: translateY(10px); opacity: 1; }
                }
                
                .tech-grid {
                    background-image: 
                        radial-gradient(rgba(0, 229, 255, 0.12) 1.5px, transparent 1.5px),
                        linear-gradient(rgba(0, 229, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 229, 255, 0.03) 1px, transparent 1px);
                    background-size: 30px 30px, 60px 60px, 60px 60px;
                    background-position: 0 0, 0 0, 0 0;
                    pointer-events: none;
                }
                
                .hero-text-glass {
                    background: transparent;
                    backdrop-filter: none;
                    -webkit-backdrop-filter: none;
                    border: none;
                    border-left: none;
                    border-radius: 0;
                    padding: 0;
                    box-shadow: none;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .hero-text-glass:hover {
                    border-color: transparent;
                    box-shadow: none;
                    transform: none;
                }
                
                .cyber-hud-dashboard {
                    background: rgba(12, 5, 30, 0.48);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(124, 77, 255, 0.25);
                    border-radius: 28px;
                    padding: 30px;
                    box-shadow: 0 25px 55px rgba(0,0,0,0.6), 0 0 20px rgba(124,77,255,0.12);
                    position: relative;
                    overflow: hidden;
                    height: 480px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    animation: floatSubtle 6s ease-in-out infinite;
                    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .cyber-hud-dashboard:hover {
                    border-color: rgba(0, 229, 255, 0.45);
                    box-shadow: 0 30px 70px rgba(0,0,0,0.7), 0 0 35px rgba(0,229,255,0.3);
                    transform: translateY(-6px);
                }
                .hud-grid-ring {
                    position: absolute;
                    width: 280px;
                    height: 280px;
                    border-radius: 50%;
                    border: 1px dashed rgba(0, 229, 255, 0.22);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: gridRotate 25s linear infinite;
                    pointer-events: none;
                }
                .hud-grid-ring-inner {
                    position: absolute;
                    width: 200px;
                    height: 200px;
                    border-radius: 50%;
                    border: 1px solid rgba(124, 77, 255, 0.32);
                    animation: gridRotate 12s linear infinite reverse;
                }
                .hud-core-pulse {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(0, 229, 255, 0.3) 0%, rgba(124, 77, 255, 0.05) 70%);
                    border: 2px solid #00E5FF;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 0 30px rgba(0, 229, 255, 0.5);
                    animation: radarPulse 3s infinite ease-in-out;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .hud-core-pulse:hover {
                    transform: scale(1.12);
                    box-shadow: 0 0 45px rgba(0, 229, 255, 0.8), 0 0 12px #7C4DFF;
                    background: radial-gradient(circle, rgba(0, 229, 255, 0.45) 0%, rgba(124, 77, 255, 0.15) 70%);
                }
                .telemetry-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 14px;
                    background: rgba(255, 255, 255, 0.04);
                    border-left: 3px solid rgba(124, 77, 255, 0.45);
                    border-radius: 6px;
                    margin-bottom: 9px;
                    font-family: 'Courier New', monospace;
                    font-size: 11px;
                    color: rgba(255, 255, 255, 0.85);
                    transition: all 0.3s ease;
                }
                .telemetry-row:hover {
                    background: rgba(0, 229, 255, 0.08);
                    border-left-color: #00E5FF;
                    transform: translateX(4px);
                    color: #ffffff;
                }
                .status-grid {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: 8px;
                    margin-top: 15px;
                }
                .status-node {
                    height: 18px;
                    border-radius: 4px;
                    background: rgba(255, 255, 255, 0.08);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                }
                .status-node::after {
                    content: '';
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    right: 2px;
                    bottom: 2px;
                    border-radius: 2px;
                    opacity: 0.6;
                    transition: all 0.3s;
                }
                .status-node.cyan::after { background: #00E5FF; box-shadow: 0 0 6px #00E5FF; }
                .status-node.purple::after { background: #7C4DFF; box-shadow: 0 0 6px #7C4DFF; }
                .status-node.green::after { background: #00E676; box-shadow: 0 0 6px #00E676; }
                .status-node.rose::after { background: #FF1744; box-shadow: 0 0 6px #FF1744; }
                .status-node:hover {
                    transform: scale(1.18);
                    border-color: rgba(255,255,255,0.4);
                    z-index: 5;
                }
                .status-node:hover::after {
                    opacity: 1;
                }

                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.02); opacity: 0.95; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes marqueeScroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes neonGlow {
                    0% { box-shadow: 0 0 5px rgba(255,215,0,0.3), 0 0 10px rgba(255,215,0,0.2); }
                    50% { box-shadow: 0 0 20px rgba(255,215,0,0.6), 0 0 30px rgba(255,215,0,0.4); }
                    100% { box-shadow: 0 0 5px rgba(255,215,0,0.3), 0 0 10px rgba(255,215,0,0.2); }
                }
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-80px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(80px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideInUp {
                    from { opacity: 0; transform: translateY(60px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes rotateIn {
                    from { opacity: 0; transform: rotate(-180deg) scale(0.5); }
                    to { opacity: 1; transform: rotate(0deg) scale(1); }
                }
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes rotateGlow {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes shimmerSweep {
                    0% { left: -150%; }
                    100% { left: 150%; }
                }
                @keyframes titlePulse {
                    0%, 100% { filter: drop-shadow(0 2px 10px rgba(0, 229, 255, 0.25)); }
                    50% { filter: drop-shadow(0 2px 25px rgba(0, 229, 255, 0.5)); }
                }
                
                /* Card entrance scroll-triggered animations */
                /* Card entrance scroll-triggered animations - Cinematic Focal Blur-In & Scale */
                .scroll-animate {
                    opacity: 0 !important;
                    filter: blur(10px);
                    transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                                filter 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                                transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) !important;
                }
                .scroll-animate.slide-left {
                    transform: translateX(-40px);
                }
                .scroll-animate.slide-right {
                    transform: translateX(40px);
                }
                .scroll-animate.slide-up {
                    transform: translateY(40px);
                }
                .scroll-animate.drop-in {
                    transform: translateY(-40px) scale(0.95);
                }
                .scroll-animate.rotate-in {
                    transform: translateY(40px);
                }
                
                /* Trigger active state with custom staggered delays */
                .scroll-animate.active {
                    opacity: 1 !important;
                    filter: blur(0px) !important;
                    transform: translate(0) rotate(0) scale(1) !important;
                }
                
                /* Staggered transition delays for fluid scroll waves */
                .delay-1 { transition-delay: 0.1s !important; }
                .delay-2 { transition-delay: 0.2s !important; }
                .delay-3 { transition-delay: 0.3s !important; }
                .delay-4 { transition-delay: 0.4s !important; }
                .delay-5 { transition-delay: 0.5s !important; }
                .delay-6 { transition-delay: 0.6s !important; }
                .delay-7 { transition-delay: 0.7s !important; }
                .delay-8 { transition-delay: 0.8s !important; }
                
                /* Back to Top Button Animation */
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                
                .back-to-top {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(135deg, #00E5FF, #7C4DFF);
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 999;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0,229,255,0.3);
                    animation: bounce 2s ease-in-out infinite;
                }
                
                .back-to-top:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 25px rgba(0,229,255,0.5);
                }
                
                /* Card Image Styling */
                .card-image {
                    margin: 1.5px 1.5px 0;
                    width: calc(100% - 3px) !important;
                    height: 220px;
                    object-fit: cover;
                    border-radius: 19px 19px 0 0;
                    transition: transform 0.5s ease, filter 0.3s ease;
                    position: relative;
                    z-index: 2;
                }
                .modern-card:hover .card-image {
                    transform: scale(1.04);
                    filter: brightness(1.1);
                }
                
                /* Advanced Running Glowing Border on Hover */
                .modern-card {
                     border-radius: 24px;
                     transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                     cursor: pointer;
                     overflow: hidden;
                     height: 100%;
                     display: flex;
                     flex-direction: column;
                     border: 1px solid rgba(255, 255, 255, 0.06);
                     border-top: 4px solid var(--card-glow, #00E5FF); /* Dynamic Jewel Colored Accent Top Border */
                     box-shadow: 0 10px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1);
                     position: relative;
                     z-index: 1;
                     background: rgba(10, 6, 25, 0.6); /* Premium Dark Obsidian Backdrop */
                     backdrop-filter: blur(20px);
                     -webkit-backdrop-filter: blur(20px);
                     transform-style: preserve-3d;
                     perspective: 1000px;
                 }
                 
                 /* Subtle premium background gradient overlay */
                 .modern-card::before {
                     content: '';
                     position: absolute;
                     top: -50%;
                     left: -50%;
                     width: 200%;
                     height: 200%;
                     background: radial-gradient(circle, rgba(var(--card-glow-rgb, 0, 229, 255), 0.15) 0%, transparent 65%);
                     z-index: 0;
                     transform: scale(0.5);
                     transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease;
                     opacity: 0;
                 }
                 
                 /* Fast High-Speed Diagonal Reflex Shimmer */
                 .modern-card::after {
                     content: '';
                     position: absolute;
                     top: 0;
                     left: -150%;
                     width: 50%;
                     height: 100%;
                     background: linear-gradient(
                         90deg,
                         transparent,
                         rgba(255, 255, 255, 0.22),
                         transparent
                     );
                     transform: skewX(-25deg);
                     z-index: 5;
                     pointer-events: none;
                     transition: none;
                 }
                 
                 .modern-card:hover::before {
                     transform: scale(1);
                     opacity: 1;
                 }
                 .modern-card:hover::after {
                     animation: shimmerSweep 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                 }
                 .modern-card:hover {
                     transform: perspective(1000px) rotateX(4.5deg) rotateY(-4.5deg) translateY(-16px) scale(1.045);
                     box-shadow: 0 40px 80px rgba(0,0,0,0.92), 0 0 50px var(--card-glow-soft), inset 0 0 35px var(--card-glow-soft);
                     border-color: var(--card-glow, #00E5FF) !important;
                     animation-play-state: paused !important;
                 }
                 .modern-card:hover .card-inner {
                     background: rgba(8, 4, 22, 0.3) !important;
                     border-color: var(--card-glow-soft, rgba(0, 229, 255, 0.2)) !important;
                 }
                 @keyframes floatIcon {
                     0% { transform: translateY(0px) scale(1); }
                     50% { transform: translateY(-5px) scale(1.08) rotate(5deg); }
                     100% { transform: translateY(0px) scale(1); }
                 }
                 .modern-card:hover .icon-cyber-ring {
                     animation: floatIcon 2s ease-in-out infinite alternate;
                     background: var(--card-glow-soft) !important;
                     border-color: var(--card-glow) !important;
                     box-shadow: 0 0 20px var(--card-glow-soft);
                 }
                
                /* section h2 tags with glows */
                h2 {
                    text-shadow: 0 0 15px rgba(0,229,255,0.25);
                }
                
                /* Beautiful metallic header title */
                .hero-title {
                    background: linear-gradient(135deg, #E0F7FA 0%, #00E5FF 45%, #7C4DFF 75%, #00B0FF 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    display: inline-block;
                    animation: titlePulse 4s ease-in-out infinite;
                }
                
                .btn-consultation-glow {
                    position: relative;
                    overflow: hidden;
                    transition: all 0.4s ease !important;
                }
                .btn-consultation-glow::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent);
                    transition: left 0.6s ease;
                }
                .btn-consultation-glow:hover::before {
                    left: 100%;
                }
                .btn-consultation-glow:hover {
                    transform: translateY(-4px) scale(1.03) !important;
                    box-shadow: 0 15px 35px rgba(0, 229, 255, 0.45), 0 0 20px rgba(0, 229, 255, 0.3) !important;
                }
                
                /* Smooth Scroll Behavior */
                html {
                    scroll-behavior: smooth;
                }
                
                /* Floating animations for cards */
                @keyframes float1 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
                @keyframes float2 { 0%, 100% { transform: translateX(0px); } 50% { transform: translateX(-6px); } }
                @keyframes float3 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
                @keyframes float4 { 0%, 100% { transform: translateX(0px); } 50% { transform: translateX(6px); } }
                
                .float-1 { animation: float1 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
                .float-2 { animation: float2 4s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
                .float-3 { animation: float3 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
                .float-4 { animation: float4 3.8s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
                
                /* Logo styling */
                .logo-image {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    object-fit: contain;
                    background: transparent;
                    transition: all 0.3s ease;
                }
                .logo-image:hover {
                    transform: rotate(5deg) scale(1.05);
                    filter: drop-shadow(0 0 10px rgba(0,229,255,0.5));
                }
                
                .logo-clean {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                    background: transparent;
                }
                
                .marquee-container { 
                    width: 100%; 
                    overflow: hidden; 
                    position: relative;
                    mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                }
                .marquee-content { display: flex; gap: 20px; padding: 20px 10px; width: fit-content; animation: marqueeScroll 25s linear infinite; }
                .marquee-container:hover .marquee-content { animation-play-state: paused; }
                section { position: relative; z-index: 1; }
                .section-content { position: relative; z-index: 2; }
                
                .card-inner {
                    padding: 28px 24px 32px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    background: rgba(10, 5, 25, 0.45);
                    backdrop-filter: blur(25px);
                    -webkit-backdrop-filter: blur(25px);
                    border-radius: 19px;
                    margin: 1.5px;
                    position: relative;
                    z-index: 2;
                    border: 1px solid rgba(255,255,255,0.08);
                    transition: all 0.4s ease;
                }
                .modern-card:hover .card-inner {
                    background: rgba(5, 2, 15, 0.25);
                    border-color: var(--card-glow, rgba(0, 229, 255, 0.35));
                }
                .extra-points {
                    margin-top: 20px;
                    border-top: 1px solid rgba(0, 229, 255, 0.15);
                    padding-top: 16px;
                }
                .point-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 10px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    transition: transform 0.2s ease;
                }
                .point-item:hover {
                    transform: translateX(5px);
                }
                .btn-learn {
                    background: rgba(var(--card-glow-rgb, 0, 229, 255), 0.08);
                    backdrop-filter: blur(4px);
                    border: 1px solid rgba(var(--card-glow-rgb, 0, 229, 255), 0.3);
                    padding: 10px 24px;
                    border-radius: 40px;
                    font-weight: 600;
                    font-size: 0.85rem;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    width: fit-content;
                    margin-top: auto;
                    color: var(--card-glow, #00E5FF);
                    position: relative;
                    overflow: hidden;
                    z-index: 3;
                }
                .btn-learn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    transition: left 0.5s ease;
                }
                .btn-learn:hover::before {
                    left: 100%;
                }
                .btn-learn:hover {
                    background: var(--card-glow, #00E5FF);
                    color: #05020c !important;
                    border-color: var(--card-glow, #00E5FF);
                    transform: scale(1.05);
                    box-shadow: 0 0 20px var(--card-glow-soft);
                }
                 .client-logo-item {
                     background: #ffffff; 
                     padding: 20px; 
                     border-radius: 16px; 
                     text-align: center; 
                     cursor: pointer;
                     transition: all 0.3s ease; 
                     box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); 
                     min-width: 150px;
                     border: 1px solid rgba(0, 0, 0, 0.05); 
                     flex-shrink: 0;
                     position: relative;
                     overflow: hidden;
                 }
                 .client-logo-item h3 {
                     color: #333344;
                 }
                 .partner-logo-item {
                     background: rgba(255, 255, 255, 0.06); 
                     padding: 20px; 
                     border-radius: 16px; 
                     text-align: center; 
                     cursor: pointer;
                     transition: all 0.3s ease; 
                     box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); 
                     min-width: 150px;
                     border: 1px solid rgba(0, 0, 0, 0.05); 
                     flex-shrink: 0;
                     position: relative;
                     overflow: hidden;
                     backdrop-filter: blur(10px);
                     -webkit-backdrop-filter: blur(10px);
                 }
                 .partner-logo-item h3 {
                     color: rgba(255, 255, 255, 0.9);
                 }
                 .client-logo-item::before, .partner-logo-item::before {
                     content: '';
                     position: absolute;
                     top: 0;
                     left: -100%;
                     width: 100%;
                     height: 100%;
                     background: linear-gradient(90deg, transparent, rgba(0,229,255,0.2), transparent);
                     transition: left 0.5s ease;
                 }
                 .client-logo-item:hover::before, .partner-logo-item:hover::before {
                     left: 100%;
                 }
                 .client-logo-item:hover, .partner-logo-item:hover { 
                     transform: translateY(-8px) scale(1.03); 
                     box-shadow: 0 20px 35px rgba(0,0,0,0.2); 
                     background: linear-gradient(135deg, #00E5FF 0%, #7C4DFF 100%); 
                     border-color: #00E5FF;
                 }
                 .client-logo-item:hover h3, .partner-logo-item:hover h3 { color: #ffffff !important; }
                 .client-logo-img, .partner-logo-img { 
                     width: 85px; 
                     height: 85px; 
                     margin: 0 auto 12px; 
                     display: flex; 
                     align-items: center; 
                     justify-content: center; 
                     background: white; 
                     padding: 8px; 
                     border-radius: 12px; 
                     box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.08);
                 }
                 .client-logo-img img, .partner-logo-img img { width: 100%; height: 100%; object-fit: contain; transition: transform 0.3s ease; }
                 .client-logo-item:hover img, .partner-logo-item:hover img { transform: scale(1.1); }
                
                .stat-card {
                    padding: 30px 20px;
                    border-radius: 24px;
                    text-align: center;
                    transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    background: rgba(10, 6, 25, 0.65); /* Rich Dark Obsidian Glass */
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-top: 4px solid var(--stat-glow, #00E5FF); /* Dynamic Glowing top stripe */
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1);
                }
                .stat-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: radial-gradient(circle at 50% 0%, var(--stat-glow-soft) 0%, transparent 70%);
                    transition: all 0.45s ease;
                    opacity: 0.8;
                }
                .stat-card:hover {
                    transform: translateY(-10px) scale(1.03);
                    box-shadow: 0 25px 50px rgba(0,0,0,0.7), 0 0 35px var(--stat-glow-soft), inset 0 0 20px var(--stat-glow-soft);
                    border-color: var(--stat-glow, #00E5FF) !important;
                    background: rgba(15, 8, 35, 0.8) !important;
                }
 
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                /* Navbar styling - Royal Burgundy with Glow */
                .nav-button {
                    background: transparent;
                    color: rgba(255, 255, 255, 0.8) !important;
                    font-weight: 500;
                    padding: 8px 16px;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    font-size: 13.5px;
                    font-family: 'Poppins', sans-serif;
                    border: 1px solid transparent;
                    position: relative;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    display: inline-block;
                }
                .nav-button::after {
                    content: '';
                    position: absolute;
                    bottom: 2px;
                    left: 20%;
                    width: 0%;
                    height: 2px;
                    background: linear-gradient(90deg, #00E5FF, #7C4DFF);
                    transition: width 0.35s cubic-bezier(0.25, 0.8, 0.25, 1), left 0.35s ease;
                    box-shadow: 0 0 8px rgba(0, 229, 255, 0.8);
                }
                .nav-button:hover::after {
                    width: 60%;
                    left: 20%;
                }
                .nav-button:hover {
                    background: rgba(255, 255, 255, 0.07);
                    color: #00E5FF !important;
                    transform: translateY(-1px);
                }
                
                .quote-button {
                    background: linear-gradient(135deg, #00E5FF 0%, #7C4DFF 100%);
                    color: #ffffff;
                    border: none;
                    padding: 10px 28px;
                    border-radius: 40px;
                    cursor: pointer;
                    font-weight: 700;
                    transition: all 0.4s ease;
                    font-family: 'Poppins', sans-serif;
                    box-shadow: 0 4px 15px rgba(0,229,255,0.3);
                    position: relative;
                    overflow: hidden;
                }
                .quote-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
                    transition: left 0.5s ease;
                }
                .quote-button:hover::before {
                    left: 100%;
                }
                .quote-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0,229,255,0.5);
                    background: linear-gradient(135deg, #00E5FF 0%, #7C4DFF 100%);
                }
                
                /* Section background gradients - Balanced Multi-Color Accent System */
                .bg-delivery { 
                    background: radial-gradient(circle at 15% 20%, rgba(255, 167, 38, 0.15) 0%, transparent 60%), radial-gradient(circle at 85% 80%, rgba(124, 77, 255, 0.08) 0%, #06040b 100%); 
                    background-size: 200% 200%;
                    animation: gradientShift 22s ease infinite;
                }
                .bg-solutions { 
                    background: radial-gradient(circle at 80% 20%, rgba(0, 229, 255, 0.18) 0%, transparent 55%), radial-gradient(circle at 20% 80%, rgba(124, 77, 255, 0.14) 0%, #08031a 100%); 
                    background-size: 200% 200%;
                    animation: gradientShift 25s ease infinite;
                }
                .bg-industries { 
                    background: radial-gradient(circle at 20% 30%, rgba(0, 230, 118, 0.16) 0%, transparent 65%), radial-gradient(circle at 80% 70%, rgba(0, 229, 255, 0.06) 0%, #010704 100%); 
                    background-size: 200% 200%;
                    animation: gradientShift 24s ease infinite;
                }
                .bg-partners { 
                    background: radial-gradient(circle at 50% 50%, rgba(0, 229, 255, 0.12) 0%, transparent 75%), #050209; 
                    background-size: 200% 200%;
                    animation: gradientShift 30s ease infinite;
                }
                .bg-clients { background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); }
                .bg-work { 
                    background: radial-gradient(circle at 85% 20%, rgba(255, 23, 68, 0.14) 0%, transparent 60%), radial-gradient(circle at 15% 80%, rgba(124, 77, 255, 0.06) 0%, #060105 100%); 
                    background-size: 200% 200%;
                    animation: gradientShift 28s ease infinite;
                }
                
                /* Subtle grid patterns overlay for tech sections */
                .bg-delivery::before, .bg-solutions::before, .bg-industries::before, .bg-work::before, .bg-partners::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-image: linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
                    background-size: 40px 40px;
                    pointer-events: none;
                    opacity: 0.7;
                    z-index: 0;
                }
                
                @media (min-width: 1024px) {
                    .hero-grid-responsive {
                        grid-template-columns: 1.15fr 0.85fr !important;
                    }
                }
                @media (max-width: 1023px) {
                    .hud-column {
                        display: none !important;
                    }
                }
                

                @keyframes heroReveal {
                    0% {
                        opacity: 0;
                        transform: translateY(35px) scale(0.97);
                        filter: blur(15px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                        filter: blur(0px);
                    }
                }
                .hero-reveal-banner {
                    opacity: 0;
                    animation: heroReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
                }
                .hero-reveal-title {
                    opacity: 0;
                    animation: heroReveal 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
                }
                .hero-reveal-desc1 {
                    opacity: 0;
                    animation: heroReveal 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards;
                }
                .hero-reveal-desc2 {
                    opacity: 0;
                    animation: heroReveal 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards;
                }
                .hero-reveal-ctas {
                    opacity: 0;
                    animation: heroReveal 2.0s cubic-bezier(0.16, 1, 0.3, 1) 1.0s forwards;
                }
                
                /* Section Entrance Scroll-Triggered animations */
                .scroll-animate.section-slide-left {
                    transform: translateX(-150px) scale(0.97);
                    opacity: 0 !important;
                    filter: blur(15px);
                }
                .scroll-animate.section-slide-right {
                    transform: translateX(150px) scale(0.97);
                    opacity: 0 !important;
                    filter: blur(15px);
                }
                .scroll-animate.section-slide-down {
                    transform: translateY(-120px) scale(0.97);
                    opacity: 0 !important;
                    filter: blur(15px);
                }
                .scroll-animate.section-slide-up {
                    transform: translateY(120px) scale(0.97);
                    opacity: 0 !important;
                    filter: blur(15px);
                }
                
                .scroll-animate.section-slide-left,
                .scroll-animate.section-slide-right,
                .scroll-animate.section-slide-down,
                .scroll-animate.section-slide-up {
                    transition: opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1),
                                filter 1.4s cubic-bezier(0.16, 1, 0.3, 1),
                                transform 1.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
                }
                
                .scroll-animate.section-slide-left.active,
                .scroll-animate.section-slide-right.active,
                .scroll-animate.section-slide-down.active,
                .scroll-animate.section-slide-up.active {
                    opacity: 1 !important;
                    filter: blur(0px) !important;
                    transform: translate(0) scale(1) !important;
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
                
                {/* Back to Top Button */}
                {showBackToTop && (
                    <button onClick={scrollToTop} className="back-to-top" aria-label="Back to top">
                        <FontAwesomeIcon icon={faArrowUp} style={{ fontSize: '24px', color: '#4a0e4e' }} />
                    </button>
                )}
                
                {/* Navigation Bar - Royal Burgundy with Gold Accents */}
                <nav style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    background: scrolled ? 'rgba(6, 3, 20, 0.92)' : 'rgba(8, 4, 25, 0.75)',
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                    padding: scrolled ? '10px 5%' : '15px 5%',
                    zIndex: 1000,
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: scrolled ? '0 10px 40px rgba(0,0,0,0.9), 0 4px 20px rgba(0, 229, 255, 0.2)' : '0 4px 25px rgba(0, 0, 0, 0.3)',
                    borderBottom: scrolled ? '3px solid #00E5FF' : '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                        <div className="logo-clean" onClick={() => setShowLogoModal(true)}>
                            <img src="/images/winze-logo.jpg" alt="Winze Technologies Logo" className="logo-image" 
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://placehold.co/48x48/00E5FF/05020c?text=W";
                                }} 
                            />
                            <span style={{ fontWeight: '800', fontSize: '1.4rem', color: '#ffffff', textShadow: '0 0 10px rgba(0, 229, 255, 0.5)', fontFamily: "'Playfair Display', serif", letterSpacing: '-0.5px' }}>Winze Technologies</span>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                            {navItems.map((item) => (
                                <button 
                                    key={item.name} 
                                    className="nav-button"
                                    onClick={(e) => { 
                                        e.preventDefault(); 
                                        e.stopPropagation(); 
                                        if (item.path) {
                                            handleTrackClick(`${item.name} Page Visit`, 'navigation');
                                            window.location.href = item.path;
                                        } else {
                                            scrollToSection(item.ref, item.name);
                                        }
                                    }}
                                >
                                    {item.name}
                                </button>
                            ))}
                            <button 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setShowQuoteModal(true); 
                                    handleTrackClick('Get Quote Button', 'cta'); 
                                }} 
                                className="quote-button"
                            >
                                ✨ Get a Quote
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section 
                    id="home" 
                    ref={homeRef} 
                    onMouseMove={handleHeroMouseMove}
                    onMouseEnter={() => setHeroMouseActive(true)}
                    onMouseLeave={() => setHeroMouseActive(false)}
                    style={{ 
                        minHeight: '100vh', 
                        position: 'relative', 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '100px 5% 120px', 
                        overflow: 'hidden',
                        background: '#040209'
                    }}
                >
                    <BackgroundVideo videoSrc={bgVideos.hero} fallbackVideo={bgVideos.heroFallback} />

                    {/* Cyber Overlay: Tech Grid */}
                    <div className="tech-grid" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1, opacity: 0.15 }} />

                    {/* Cyber Overlay: Interactive Mouse Cursor Spotlight */}
                    <div 
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 1,
                            pointerEvents: 'none',
                            opacity: heroMouseActive ? 1 : 0,
                            transition: 'opacity 0.8s ease',
                            background: `radial-gradient(circle at ${heroMouse.x}% ${heroMouse.y}%, rgba(0, 229, 255, 0.16) 0%, rgba(124, 77, 255, 0.08) 35%, transparent 65%)`
                        }} 
                    />

                    {/* Subtle digital scanning lines overlay */}
                    <div 
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 1,
                            pointerEvents: 'none',
                            background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
                            backgroundSize: '100% 4px'
                        }}
                    />

                    <div className="section-content" style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center' }}>
                        {/* Centered clean text glass panel */}
                        <div style={{ maxWidth: '950px', width: '100%', textAlign: 'center' }}>
                            <div className="hero-text-glass" style={{ borderLeft: 'none' }}>
                                <div style={{ marginBottom: '22px' }}>
                                    <span style={{ 
                                        background: 'rgba(0, 229, 255, 0.12)', 
                                        padding: '6px 18px', 
                                        borderRadius: '30px', 
                                        fontSize: '11px', 
                                        color: '#00E5FF', 
                                        display: 'inline-block', 
                                        fontWeight: '700', 
                                        letterSpacing: '1.5px', 
                                        border: '1px solid rgba(0,229,255,0.3)',
                                        textTransform: 'uppercase',
                                        boxShadow: '0 0 15px rgba(0, 229, 255, 0.1)'
                                    }} className="hero-reveal-banner">
                                        ⚡ 16+ Years of Enterprise Excellence
                                    </span>
                                    <h1 className="hero-title hero-reveal-title" style={{ 
                                        fontSize: '4.2rem', 
                                        marginTop: '22px', 
                                        fontFamily: "'Playfair Display', serif", 
                                        fontWeight: '800', 
                                        marginBottom: '20px', 
                                        lineHeight: '1.2',
                                        letterSpacing: '-0.5px'
                                    }}>
                                        Winze Technologies
                                    </h1>
                                </div>
                                <p style={{ fontSize: '1.35rem', marginBottom: '20px', color: '#ffffff', lineHeight: '1.6', fontWeight: '500' }} className="hero-reveal-desc1">
                                    Leading Enterprise Communication, Security, and AI Technology Solutions Provider
                                </p>
                                <p style={{ marginBottom: '35px', color: 'rgba(255, 255, 255, 0.75)', lineHeight: '1.75', fontSize: '1.05rem', maxWidth: '800px', margin: '0 auto 35px' }} className="hero-reveal-desc2">
                                    With over 16 years of industry experience, Winze Technologies specializes in designing, deploying, and supporting integrated technology ecosystems for enterprises across India.
                                </p>
                                
                                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }} className="hero-reveal-ctas">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setShowQuoteModal(true); handleTrackClick('Free Consultation', 'cta'); }} 
                                        className="btn-consultation-glow" 
                                        style={{ 
                                            background: 'linear-gradient(135deg, #00E5FF 0%, #7C4DFF 100%)', 
                                            color: '#ffffff', 
                                            border: 'none', 
                                            padding: '16px 42px', 
                                            borderRadius: '50px', 
                                            fontSize: '15px', 
                                            fontWeight: '700', 
                                            cursor: 'pointer', 
                                            boxShadow: '0 8px 25px rgba(0,229,255,0.35)' 
                                        }}
                                    >
                                        Get Free Consultation →
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleTrackClick('Explore Solutions', 'cta'); if (solutionsRef.current) { solutionsRef.current.scrollIntoView({ behavior: 'smooth' }); } }} 
                                        style={{ 
                                            background: 'rgba(0, 229, 255, 0.05)', 
                                            color: '#00E5FF', 
                                            border: '2px solid rgba(0, 229, 255, 0.6)', 
                                            padding: '14px 38px', 
                                            borderRadius: '50px', 
                                            fontSize: '15px', 
                                            fontWeight: '600', 
                                            cursor: 'pointer', 
                                            transition: 'all 0.4s ease',
                                            backdropFilter: 'blur(5px)'
                                        }}
                                        onMouseEnter={(e) => { 
                                            e.target.style.background = 'rgba(0,229,255,0.2)'; 
                                            e.target.style.transform = 'translateY(-3px)'; 
                                            e.target.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.4)'; 
                                            e.target.style.borderColor = '#00E5FF';
                                        }}
                                        onMouseLeave={(e) => { 
                                            e.target.style.background = 'rgba(0, 229, 255, 0.05)'; 
                                            e.target.style.transform = 'translateY(0)'; 
                                            e.target.style.boxShadow = 'none'; 
                                            e.target.style.borderColor = 'rgba(0, 229, 255, 0.6)';
                                        }}
                                    >
                                        Explore Solutions
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="delivery" style={{ padding: '80px 5%', position: 'relative', overflow: 'hidden' }} className="bg-delivery scroll-animate section-slide-left">
                    <div className="section-content" style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', color: 'white', marginBottom: '15px', fontWeight: '700' }} className="scroll-animate slide-up delay-1">What We Deliver</h2>
                        <p style={{ textAlign: 'center', color: '#00E5FF', marginBottom: '50px', fontSize: '1rem', letterSpacing: '1px' }} className="scroll-animate slide-up delay-2">COMPREHENSIVE TECHNOLOGY LIFECYCLE</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '30px' }}>
                            {deliveryItems.map((item, i) => {
                                const extraPoints = getDeliveryExtraPoints(item.title);
                                const floatClass = `float-${(i % 4) + 1}`;
                                return (
                                    <div key={i} className={`modern-card style-delivery custom-card-base ${floatClass} scroll-animate ${i % 2 === 0 ? 'slide-left' : 'slide-right'} delay-${Math.min(i + 1, 8)}`} style={getCardStyles(i, 'delivery')}>
                                        <div className="card-inner">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                                <div style={{
                                                    width: '64px',
                                                    height: '64px',
                                                    borderRadius: '16px',
                                                    background: 'rgba(var(--card-glow-rgb), 0.08)',
                                                    border: '1px solid rgba(var(--card-glow-rgb), 0.25)',
                                                    boxShadow: '0 0 15px rgba(var(--card-glow-rgb), 0.15)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.3s ease'
                                                }} className="icon-cyber-ring">
                                                    <FontAwesomeIcon icon={item.icon} style={{ fontSize: '28px', color: 'var(--card-glow)' }} />
                                                </div>
                                            </div>
                                            <h3 style={{ marginBottom: '12px', color: 'white', fontSize: '1.3rem', fontWeight: '700' }}>{item.title}</h3>
                                            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.5', marginBottom: '15px', fontSize: '14px' }}>{item.desc}</p>
                                            <div className="extra-points">
                                                {extraPoints.slice(0,4).map((point, idx) => (
                                                    <div key={idx} className="point-item">
                                                        <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'var(--card-glow)', fontSize: '12px' }} />
                                                        <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px' }}>{point}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <button className="btn-learn" onClick={(e) => { e.stopPropagation(); handleTrackClick(item.title, 'delivery'); openLandingPage(item, 'delivery'); }}>Learn More →</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section id="solutions" ref={solutionsRef} style={{ padding: '80px 5%', position: 'relative', overflow: 'hidden' }} className="bg-solutions scroll-animate section-slide-right">
                    <div className="section-content" style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', color: 'white', marginBottom: '15px', fontWeight: '700' }} className="scroll-animate slide-up delay-1">Our Solutions Portfolio</h2>
                        <p style={{ textAlign: 'center', color: '#00E5FF', marginBottom: '10px', fontSize: '1rem', letterSpacing: '1px', fontWeight: '600' }} className="scroll-animate slide-up delay-2">PRACTICAL ACTION. BOLD AMBITION. ENDLESS POSSIBILITIES.</p>
                        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.75)', marginBottom: '50px', fontSize: '14px', fontWeight: '500' }} className="scroll-animate slide-up delay-3">Enterprise-grade technology solutions for modern businesses</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '30px' }}>
                            {solutions.map((solution, idx) => {
                                const extraPoints = getSolutionExtraPoints(solution.title);
                                const floatClass = `float-${(idx % 4) + 1}`;
                                return (
                                    <div key={idx} className={`modern-card style-solutions custom-card-base ${floatClass} scroll-animate drop-in delay-${Math.min(idx % 8 + 1, 8)}`} style={getCardStyles(idx, 'solution')}>
                                        <img src={solution.img} alt={solution.title} className="card-image" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/2a3a5f/00E5FF?text=' + encodeURIComponent(solution.title); }} />
                                        <div className="card-inner">
                                            <div style={{
                                                width: '54px',
                                                height: '54px',
                                                borderRadius: '14px',
                                                background: 'rgba(var(--card-glow-rgb), 0.08)',
                                                border: '1px solid rgba(var(--card-glow-rgb), 0.25)',
                                                boxShadow: '0 0 15px rgba(var(--card-glow-rgb), 0.15)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginBottom: '15px',
                                                transition: 'all 0.3s ease'
                                            }} className="icon-cyber-ring">
                                                <FontAwesomeIcon icon={solution.icon} style={{ fontSize: '24px', color: 'var(--card-glow)' }} />
                                            </div>
                                            <h3 style={{ marginBottom: '10px', color: 'white', fontSize: '1.15rem', fontWeight: '700' }}>{solution.title}</h3>
                                            <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: '1.45', marginBottom: '15px', fontSize: '13px' }}>{solution.desc}</p>
                                            <div className="extra-points">
                                                {extraPoints.slice(0,3).map((point, pid) => (
                                                    <div key={pid} className="point-item">
                                                        <FontAwesomeIcon icon={faStar} style={{ color: 'var(--card-glow)', fontSize: '11px' }} />
                                                        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}>{point}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <button className="btn-learn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleTrackClick(solution.title, 'solution'); openLandingPage(solution, 'solution'); }}>Learn More →</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section id="industries" ref={industriesRef} style={{ padding: '80px 5%', position: 'relative', overflow: 'hidden' }} className="bg-industries scroll-animate section-slide-down">
                    <div className="section-content" style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', color: 'white', marginBottom: '15px', fontWeight: '700' }} className="scroll-animate slide-up delay-1">Industries We Serve</h2>
                        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.8)', marginBottom: '50px', fontSize: '1rem', letterSpacing: '1px' }} className="scroll-animate slide-up delay-2">TRANSFORMING BUSINESSES ACROSS SECTORS</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '30px' }}>
                            {industries.map((industry, idx) => {
                                const extraPoints = getIndustryExtraPoints(industry.name);
                                const floatClass = `float-${(idx % 4) + 1}`;
                                return (
                                    <div key={idx} className={`modern-card style-industries custom-card-base ${floatClass} scroll-animate slide-up delay-${Math.min(idx + 1, 8)}`} style={getCardStyles(idx, 'industry')}>
                                        <img src={industry.img} alt={industry.name} className="card-image" />
                                        <div className="card-inner">
                                            <div style={{
                                                width: '56px',
                                                height: '56px',
                                                borderRadius: '14px',
                                                background: 'rgba(var(--card-glow-rgb), 0.08)',
                                                border: '1px solid rgba(var(--card-glow-rgb), 0.25)',
                                                boxShadow: '0 0 15px rgba(var(--card-glow-rgb), 0.15)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginBottom: '15px',
                                                transition: 'all 0.3s ease'
                                            }} className="icon-cyber-ring">
                                                <FontAwesomeIcon icon={industry.icon} style={{ fontSize: '24px', color: 'var(--card-glow)' }} />
                                            </div>
                                            <h3 style={{ marginBottom: '10px', color: 'white', fontSize: '1.25rem', fontWeight: '700' }}>{industry.name}</h3>
                                            <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: '1.45', fontSize: '13px', marginBottom: '15px' }}>{industry.desc}</p>
                                            <div className="extra-points">
                                                {extraPoints.slice(0,4).map((point, pid) => (
                                                    <div key={pid} className="point-item">
                                                        <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'var(--card-glow)', fontSize: '11px' }} />
                                                        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}>{point}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <button className="btn-learn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleTrackClick(industry.name, 'industry'); openLandingPage(industry, 'industry'); }}>Learn More →</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section id="partners" ref={partnersRef} style={{ padding: '80px 5%', position: 'relative', overflow: 'hidden' }} className="bg-partners scroll-animate section-slide-up">
                    <div className="section-content" style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
                        <h2 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '15px', fontWeight: '700' }} className="scroll-animate slide-up delay-1">Our Trusted Partners</h2>
                        <p style={{ color: '#00E5FF', marginBottom: '20px', fontSize: '1rem', letterSpacing: '1px', fontWeight: '600' }} className="scroll-animate slide-up delay-2">INNOVATION. EXCELLENCE. TRUST.</p>
                        <p style={{ color: '#aaa', marginBottom: '40px', fontSize: '14px', fontWeight: '500' }} className="scroll-animate slide-up delay-3">Partnering with industry leaders to deliver world-class technology solutions</p>
                        <div className="marquee-container scroll-animate slide-up delay-4"><div className="marquee-content">{[...partnerLogos, ...partnerLogos, ...partnerLogos].map((partner, idx) => (<div key={idx} className="partner-logo-item rotate-hover" onClick={() => handleTrackClick(partner.name, 'partner')}><div className="partner-logo-img"><img src={partner.url} alt={partner.name} onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/100x100/00E5FF/05020c?text=${partner.name.charAt(0)}`; }} /></div><h3 style={{ fontSize: '0.85rem', margin: 0, fontWeight: '600' }}>{partner.name}</h3></div>))}</div></div>
                    </div>
                </section>

                {/* Clients Section */}
                <section id="clients" ref={clientsRef} style={{ padding: '60px 5%', position: 'relative', overflow: 'hidden' }} className="bg-clients scroll-animate section-slide-left">
                    <div className="section-content" style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
                        <h2 style={{ fontSize: '2.5rem', color: '#0c0a24', marginBottom: '15px', fontWeight: '700' }} className="scroll-animate slide-up delay-1">Our Valued Clients</h2>
                        <p style={{ color: '#555566', marginBottom: '40px', fontSize: '1rem', letterSpacing: '1px', fontWeight: '600' }} className="scroll-animate slide-up delay-2">TRUSTED BY INDUSTRY LEADERS ACROSS INDIA</p>
                        <div className="marquee-container scroll-animate slide-up delay-3"><div className="marquee-content">{[...clientLogos, ...clientLogos, ...clientLogos].map((client, idx) => (<div key={idx} className="client-logo-item rotate-hover" onClick={() => handleTrackClick(client.name, 'client')}><div className="client-logo-img"><img src={client.url} alt={client.name} onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/100x100/00E5FF/1a1a2e?text=${client.name.charAt(0)}`; }} /></div><h3 style={{ color: '#333', fontSize: '0.85rem', margin: 0, fontWeight: '600' }}>{client.name}</h3></div>))}</div></div>
                    </div>
                </section>

                <section id="workwith" ref={workwithRef} style={{ padding: '80px 5%', position: 'relative', overflow: 'hidden' }} className="bg-work scroll-animate section-slide-right">
                    <div className="section-content" style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
                        <h2 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '15px', fontWeight: '700' }} className="scroll-animate slide-up delay-1">Why Work With Winze?</h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '50px', fontSize: '1rem', letterSpacing: '1px' }} className="scroll-animate slide-up delay-2">PARTNER WITH US FOR A TRANSFORMATIVE EXPERIENCE</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                            {workWithWinze.map((item, idx) => {
                                const extraPoints = getWorkExtraPoints(item.title);
                                const floatClass = `float-${(idx % 4) + 1}`;
                                return (
                                    <div key={idx} className={`modern-card style-work custom-card-base ${floatClass} scroll-animate ${idx % 3 === 0 ? 'slide-left' : idx % 3 === 1 ? 'drop-in' : 'slide-right'} delay-${Math.min(idx + 1, 8)}`} style={getCardStyles(idx, 'work')}>
                                        <div className="card-inner">
                                            <div style={{
                                                width: '64px',
                                                height: '64px',
                                                borderRadius: '16px',
                                                background: 'rgba(var(--card-glow-rgb), 0.08)',
                                                border: '1px solid rgba(var(--card-glow-rgb), 0.25)',
                                                boxShadow: '0 0 15px rgba(var(--card-glow-rgb), 0.15)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginBottom: '20px',
                                                transition: 'all 0.3s ease'
                                            }} className="icon-cyber-ring">
                                                <FontAwesomeIcon icon={item.icon} style={{ fontSize: '28px', color: 'var(--card-glow)' }} />
                                            </div>
                                            <h3 style={{ marginBottom: '12px', color: 'white', fontSize: '1.3rem', fontWeight: '700' }}>{item.title}</h3>
                                            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.5', marginBottom: '15px', fontSize: '14px' }}>{item.desc}</p>
                                            <div className="extra-points">
                                                {extraPoints.slice(0,4).map((point, pid) => (
                                                    <div key={pid} className="point-item">
                                                        <FontAwesomeIcon icon={faGem} style={{ color: 'var(--card-glow)', fontSize: '11px' }} />
                                                        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}>{point}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <button className="btn-learn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleTrackClick(item.title, 'workwith'); openLandingPage(item, 'work'); }}>Learn More →</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section ref={statsRef} style={{ padding: '80px 5%', position: 'relative', overflow: 'hidden', background: 'radial-gradient(circle at 50% 50%, rgba(124, 77, 255, 0.18) 0%, #06020f 100%)' }}>
                    <div className="section-content" style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
                        <h2 style={{ fontSize: '2.5rem', color: '#00E5FF', marginBottom: '15px', fontWeight: '700' }} className="scroll-animate slide-up delay-1">Our Impact in Numbers</h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '50px', fontSize: '1rem', letterSpacing: '1px' }} className="scroll-animate slide-up delay-2">DELIVERING EXCELLENCE THROUGH MEASURABLE RESULTS</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '25px' }}>
                            <div className="stat-card scroll-animate slide-left delay-1" style={{ '--stat-glow': '#FFD700', '--stat-glow-soft': 'rgba(255, 215, 0, 0.2)' }}>
                                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ffffff', textShadow: '0 0 15px rgba(255, 215, 0, 0.6)', marginBottom: '10px' }}>{counters.years}+</div>
                                <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '8px', fontWeight: 'bold' }}>Years in Business</h3>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>Industry Experience</p>
                            </div>
                            <div className="stat-card scroll-animate drop-in delay-2" style={{ '--stat-glow': '#7C4DFF', '--stat-glow-soft': 'rgba(124, 77, 255, 0.2)' }}>
                                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ffffff', textShadow: '0 0 15px rgba(124, 77, 255, 0.6)', marginBottom: '10px' }}>{counters.expertise}+</div>
                                <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '8px', fontWeight: 'bold' }}>Expertise</h3>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>Domain Specialists</p>
                            </div>
                            <div className="stat-card scroll-animate slide-up delay-3" style={{ '--stat-glow': '#00E676', '--stat-glow-soft': 'rgba(0, 230, 118, 0.2)' }}>
                                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ffffff', textShadow: '0 0 15px rgba(0, 230, 118, 0.6)', marginBottom: '10px' }}>{counters.clients}+</div>
                                <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '8px', fontWeight: 'bold' }}>Clients</h3>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>Satisfied Customers</p>
                            </div>
                            <div className="stat-card scroll-animate drop-in delay-4" style={{ '--stat-glow': '#FF9100', '--stat-glow-soft': 'rgba(255, 145, 0, 0.2)' }}>
                                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ffffff', textShadow: '0 0 15px rgba(255, 145, 0, 0.6)', marginBottom: '10px' }}>{counters.awards}+</div>
                                <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '8px', fontWeight: 'bold' }}>Awards</h3>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>Industry Recognition</p>
                            </div>
                            <div className="stat-card scroll-animate slide-right delay-5" style={{ '--stat-glow': '#FF1744', '--stat-glow-soft': 'rgba(255, 23, 68, 0.2)' }}>
                                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ffffff', textShadow: '0 0 15px rgba(255, 23, 68, 0.6)', marginBottom: '10px' }}>{counters.projects}+</div>
                                <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '8px', fontWeight: 'bold' }}>Projects</h3>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>Successfully Delivered</p>
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
                    }} 
                    onClick={() => setShowLogoModal(false)}>
                        <div style={{ 
                            maxWidth: '90vw', 
                            maxHeight: '90vh', 
                            position: 'relative' 
                        }} 
                        onClick={(e) => e.stopPropagation()}>
                            <button 
                                onClick={() => setShowLogoModal(false)} 
                                style={{ 
                                    position: 'absolute', 
                                    top: '-50px', 
                                    right: '-50px', 
                                    background: '#00E5FF', 
                                    border: 'none', 
                                    fontSize: '30px', 
                                    cursor: 'pointer', 
                                    color: '#05020c', 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '50%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    transition: 'all 0.3s', 
                                    fontWeight: 'bold' 
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'scale(1.1)';
                                    e.target.style.background = '#fff';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'scale(1)';
                                    e.target.style.background = '#00E5FF';
                                }}
                            >
                                ×
                            </button>
                            <img 
                                src="/images/winze-logo.jpg" 
                                alt="Winze Technologies Logo" 
                                style={{ 
                                    maxWidth: '70vw', 
                                    maxHeight: '70vh', 
                                    objectFit: 'contain',
                                    background: 'transparent',
                                    boxShadow: '0 0 30px rgba(0,229,255,0.3)',
                                    borderRadius: '20px'
                                }} 
                            />
                        </div>
                    </div>
                )}

                {/* Quote Modal */}
                {showQuoteModal && (<div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5, 3, 10, 0.75)', backdropFilter: 'blur(20px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowQuoteModal(false)}><div style={{ background: 'rgba(16, 8, 30, 0.9)', borderRadius: '28px', padding: '40px', maxWidth: '520px', width: '100%', position: 'relative', border: '2px solid rgba(0,229,255,0.35)', boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(0,229,255,0.15)', maxHeight: '85vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}><button onClick={() => setShowQuoteModal(false)} style={{ position: 'absolute', top: '20px', right: '25px', background: '#00E5FF', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#05020c', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', transition: 'all 0.3s' }}>×</button><h2 style={{ color: '#00E5FF', marginBottom: '20px', textAlign: 'center', fontSize: '1.8rem', fontWeight: '700', textShadow: '0 0 15px rgba(0,229,255,0.2)' }}>Request a Quote</h2><p style={{ color: '#ccc', textAlign: 'center', marginBottom: '25px', fontSize: '13px' }}>Fill out the form and our team will contact you within 24 hours</p>
                <form onSubmit={handleSubmitQuote}>
                    <input type="text" name="name" placeholder="Full Name" required onChange={handleInputChange} className="quote-form-input" style={{ width: '100%', padding: '14px', marginBottom: '16px', borderRadius: '12px', border: '1px solid rgba(0,229,255,0.25)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                    <input type="email" name="email" placeholder="Email Address" required onChange={handleInputChange} className="quote-form-input" style={{ width: '100%', padding: '14px', marginBottom: '16px', borderRadius: '12px', border: '1px solid rgba(0,229,255,0.25)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                    <input type="tel" name="phone" placeholder="Phone Number" required onChange={handleInputChange} className="quote-form-input" style={{ width: '100%', padding: '14px', marginBottom: '16px', borderRadius: '12px', border: '1px solid rgba(0,229,255,0.25)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                    <div style={{ position: 'relative', marginBottom: '16px' }}><select name="service" required value={formData.service} onChange={handleInputChange} className="quote-form-input" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(0,229,255,0.25)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '14px', boxSizing: 'border-box', cursor: 'pointer' }}><option value="" style={{ background: '#1c0f2b', color: 'white' }}>Select a Service</option>{solutions.map((s, idx) => (<option key={idx} value={s.title} style={{ background: '#1c0f2b', color: 'white', padding: '10px' }}>{s.title}</option>))}</select></div>
                    <textarea name="message" placeholder="Tell us about your requirements..." rows="3" onChange={handleInputChange} className="quote-form-input" style={{ width: '100%', padding: '14px', marginBottom: '24px', borderRadius: '12px', border: '1px solid rgba(0,229,255,0.25)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }}></textarea>
                    <button type="submit" className="btn-consultation-glow" style={{ width: '100%', background: 'linear-gradient(135deg, #00E5FF 0%, #7C4DFF 100%)', color: '#ffffff', padding: '14px', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 20px rgba(0,229,255,0.2)' }}>Submit Request →</button>
                </form></div></div>)}

                {/* Landing Page Modal */}
                {landingModalOpen && (<LandingPage item={landingData} onClose={closeLandingPage} onRequestQuote={openQuoteModalForItem} />)}

                {/* Footer */}
                <footer style={{ background: '#0a0a1a', color: 'white', padding: '50px 5% 25px', borderTop: '1px solid rgba(0,229,255,0.1)' }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '40px' }}>
                            <div className="scroll-animate slide-up delay-1">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', cursor: 'pointer' }} onClick={() => setShowLogoModal(true)}>
                                    <img src="/images/winze-logo.jpg" alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'contain', background: 'transparent', borderRadius: '8px' }} />
                                    <span style={{ fontWeight: '700', fontSize: '1.1rem', background: 'linear-gradient(135deg, #00E5FF 0%, #7C4DFF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Winze Technologies</span>
                                </div>
                                <p style={{ color: '#aaa', lineHeight: '1.6', fontSize: '13px' }}>Driving Innovation through Customer-Centric Technology Solutions.</p>
                            </div>
                            <div className="scroll-animate slide-up delay-2">
                                <h4 style={{ marginBottom: '18px', color: '#00E5FF', fontSize: '1rem' }}>Quick Links</h4>
                                {navItems.map((item) => (
                                    <p key={item.name} style={{ margin: 0 }}>
                                        <button 
                                            onClick={(e) => { 
                                                e.preventDefault(); 
                                                e.stopPropagation(); 
                                                if (item.path) { 
                                                    handleTrackClick(`${item.name} Page Visit`, 'footer'); 
                                                    window.location.href = item.path; 
                                                } else { 
                                                    scrollToSection(item.ref, item.name); 
                                                } 
                                            }} 
                                            style={{ color: '#aaa', background: 'none', border: 'none', display: 'block', marginBottom: '10px', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)', fontSize: '13px', outline: 'none' }} 
                                            onMouseEnter={(e) => {
                                                e.target.style.color = '#00E5FF';
                                                e.target.style.transform = 'translateX(8px)';
                                                e.target.style.textShadow = '0 0 10px rgba(0, 229, 255, 0.5)';
                                            }} 
                                            onMouseLeave={(e) => {
                                                e.target.style.color = '#aaa';
                                                e.target.style.transform = 'translateX(0)';
                                                e.target.style.textShadow = 'none';
                                            }}
                                        >
                                            {item.name}
                                        </button>
                                    </p>
                                ))}
                            </div>
                            <div className="scroll-animate slide-up delay-3">
                                <h4 style={{ marginBottom: '18px', color: '#00E5FF', fontSize: '1rem' }}>Contact Info</h4>
                                <p style={{ color: '#aaa', marginBottom: '10px', fontSize: '13px' }}>📧 <a href="mailto:sales@winzetech.com" style={{ color: '#aaa', textDecoration: 'none' }}>sales@winzetech.com</a></p>
                                <p style={{ color: '#aaa', marginBottom: '10px', fontSize: '13px' }}>📞 <a href="tel:+919550010417" style={{ color: '#aaa', textDecoration: 'none' }}>+91 95500 10417</a></p>
                                <p style={{ color: '#aaa', marginBottom: '10px', fontSize: '13px' }}>🌐 www.winzetech.com</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'center', paddingTop: '25px', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#666', fontSize: '12px' }} className="scroll-animate slide-up delay-4">
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