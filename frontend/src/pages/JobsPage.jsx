import React, { useState, useEffect } from 'react';
import { getJobs, applyForJob } from '../services/api';
import SEO from '../components/SEO';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faFileAlt, faBriefcase, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';

const JobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        experience: '',
        current_company: '',
        resume: ''  // ✅ Changed from resume_url to resume
    });

    useEffect(() => {
        loadJobs();
        window.scrollTo(0, 0);
    }, []);

    const loadJobs = async () => {
        try {
            const response = await getJobs();
            if (response.success) {
                setJobs(response.jobs);
            }
        } catch (error) {
            console.error('Error loading jobs:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(file.type)) {
                alert('Please upload PDF or DOC/DOCX file only');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('File size should be less than 5MB');
                return;
            }
            setResumeFile(file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, resume: reader.result }));  // ✅ Changed to resume
            };
            reader.readAsDataURL(file);
        }
    };

    const handleApply = (job) => {
        setSelectedJob(job);
        setShowApplicationForm(true);
        setFormData({
            name: '',
            email: '',
            phone: '',
            experience: '',
            current_company: '',
            resume: ''  // ✅ Changed to resume
        });
        setResumeFile(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const applicationData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                experience: formData.experience,
                current_company: formData.current_company,
                resume: formData.resume  // ✅ Changed to resume
            };
            
            const response = await applyForJob(selectedJob.id, applicationData);
            
            if (response.success) {
                alert('Application submitted successfully!');
                setShowApplicationForm(false);
                setSelectedJob(null);
                setResumeFile(null);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    experience: '',
                    current_company: '',
                    resume: ''  // ✅ Changed to resume
                });
            } else {
                alert('Failed to submit application. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error submitting application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Rest of your styles remain the same...
    const styles = {
        container: {
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '60px 5%',
            minHeight: '100vh',
            background: 'radial-gradient(circle at 50% 50%, rgba(0, 191, 165, 0.08) 0%, #020614 100%)'
        },
        header: {
            textAlign: 'center',
            marginBottom: '50px'
        },
        title: {
            fontSize: '3rem',
            color: 'white',
            marginBottom: '15px',
            fontWeight: '800',
            fontFamily: "'Playfair Display', serif",
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        },
        subtitle: {
            fontSize: '1.1rem',
            color: '#aaa',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
        },
        jobsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: '30px',
            marginTop: '40px'
        },
        jobCard: {
            background: 'rgba(10, 5, 25, 0.45)',
            backdropFilter: 'blur(25px)',
            WebkitBackdropFilter: 'blur(25px)',
            borderRadius: '20px',
            padding: '28px',
            transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
            cursor: 'pointer',
            border: '1px solid rgba(255,215,0,0.15)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        },
        jobCardHover: {
            transform: 'translateY(-10px) scale(1.02)',
            borderColor: 'rgba(255,215,0,0.6)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 25px rgba(6,182,212,0.3)'
        },
        jobTitle: {
            fontSize: '1.4rem',
            color: '#FFD700',
            marginBottom: '15px',
            fontWeight: '700',
            fontFamily: "'Playfair Display', serif"
        },
        jobMeta: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px',
            marginBottom: '20px',
            paddingBottom: '15px',
            borderBottom: '1px solid rgba(255,215,0,0.15)'
        },
        metaItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#ccc',
            fontSize: '13px'
        },
        jobDescription: {
            color: 'rgba(255,255,255,0.75)',
            lineHeight: '1.6',
            marginBottom: '20px',
            fontSize: '14px'
        },
        applyBtn: {
            background: 'rgba(255,215,0,0.15)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,215,0,0.3)',
            padding: '12px 28px',
            borderRadius: '40px',
            fontWeight: '600',
            fontSize: '14px',
            transition: '0.3s',
            cursor: 'pointer',
            width: '100%',
            color: '#FFD700',
            fontFamily: "'Poppins', sans-serif"
        },
        modal: {
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
        },
        modalContent: {
            background: 'rgba(10, 5, 25, 0.95)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            borderRadius: '28px',
            padding: '40px',
            maxWidth: '550px',
            width: '100%',
            position: 'relative',
            border: '1px solid rgba(255,215,0,0.35)',
            maxHeight: '85vh',
            overflow: 'auto',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
        },
        closeBtn: {
            position: 'absolute',
            top: '20px',
            right: '25px',
            background: '#FFD700',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#1a0b2e',
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            transition: 'all 0.3s'
        },
        modalTitle: {
            color: '#FFD700',
            marginBottom: '25px',
            textAlign: 'center',
            fontSize: '1.8rem',
            fontFamily: "'Playfair Display', serif"
        },
        input: {
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            borderRadius: '12px',
            border: '1px solid rgba(255,215,0,0.3)',
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            fontSize: '14px',
            boxSizing: 'border-box'
        },
        fileInput: {
            width: '100%',
            padding: '10px',
            marginBottom: '15px',
            borderRadius: '12px',
            border: '1px solid rgba(255,215,0,0.3)',
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            fontSize: '13px',
            boxSizing: 'border-box',
            cursor: 'pointer'
        },
        fileInfo: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 15px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '10px',
            marginBottom: '15px',
            fontSize: '13px',
            color: '#FFD700'
        },
        removeFileBtn: {
            background: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '4px 12px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600'
        },
        submitBtn: {
            width: '100%',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            color: '#1a0b2e',
            padding: '14px',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s'
        },
        noJobs: {
            textAlign: 'center',
            padding: '60px',
            color: '#aaa',
            fontSize: '1.1rem'
        }
    };

    const [hoveredCard, setHoveredCard] = useState(null);

    return (
        <>
            <SEO title="Careers | Winze Technologies" />
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Join Our Team</h1>
                    <p style={styles.subtitle}>Be part of something great. Explore our current opportunities.</p>
                </div>
                
                <div style={styles.jobsGrid}>
                    {jobs.length === 0 ? (
                        <div style={styles.noJobs}>No active job openings at the moment. Please check back later.</div>
                    ) : (
                        jobs.map(job => (
                            <div 
                                key={job.id} 
                                style={{
                                    ...styles.jobCard,
                                    ...(hoveredCard === job.id ? styles.jobCardHover : {})
                                }}
                                onMouseEnter={() => setHoveredCard(job.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <h3 style={styles.jobTitle}>{job.title}</h3>
                                <div style={styles.jobMeta}>
                                    <span style={styles.metaItem}>
                                        <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#FFD700' }} />
                                        {job.location || 'N/A'}
                                    </span>
                                    <span style={styles.metaItem}>
                                        <FontAwesomeIcon icon={faClock} style={{ color: '#FFD700' }} />
                                        {job.type || 'Full-time'}
                                    </span>
                                    <span style={styles.metaItem}>
                                        <FontAwesomeIcon icon={faBriefcase} style={{ color: '#FFD700' }} />
                                        {job.experience || '0'} years exp
                                    </span>
                                </div>
                                <p style={styles.jobDescription}>{job.description}</p>
                                <button 
                                    style={styles.applyBtn}
                                    onClick={() => handleApply(job)}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = '#FFD700';
                                        e.target.style.color = '#1a0b2e';
                                        e.target.style.transform = 'scale(1.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'rgba(255,215,0,0.15)';
                                        e.target.style.color = '#FFD700';
                                        e.target.style.transform = 'scale(1)';
                                    }}
                                >
                                    Apply Now →
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {showApplicationForm && selectedJob && (
                <div style={styles.modal} onClick={() => setShowApplicationForm(false)}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button 
                            style={styles.closeBtn} 
                            onClick={() => setShowApplicationForm(false)}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.1)';
                                e.target.style.background = '#fff';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)';
                                e.target.style.background = '#FFD700';
                            }}
                        >
                            ×
                        </button>
                        <h3 style={styles.modalTitle}>Apply for {selectedJob.title}</h3>
                        <form onSubmit={handleSubmit}>
                            <input type="text" name="name" placeholder="Full Name *" value={formData.name} onChange={handleInputChange} style={styles.input} required />
                            <input type="email" name="email" placeholder="Email Address *" value={formData.email} onChange={handleInputChange} style={styles.input} required />
                            <input type="tel" name="phone" placeholder="Phone Number *" value={formData.phone} onChange={handleInputChange} style={styles.input} required />
                            <input type="text" name="experience" placeholder="Years of Experience" value={formData.experience} onChange={handleInputChange} style={styles.input} />
                            <input type="text" name="current_company" placeholder="Current Company" value={formData.current_company} onChange={handleInputChange} style={styles.input} />
                            
                            {/* Resume Upload */}
                            <div>
                                <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={styles.fileInput} required />
                                {resumeFile && (
                                    <div style={styles.fileInfo}>
                                        <span>📄 {resumeFile.name}</span>
                                        <button type="button" onClick={() => { setResumeFile(null); setFormData(prev => ({ ...prev, resume: '' })); }} style={styles.removeFileBtn}>Remove</button>
                                    </div>
                                )}
                                <small style={{ color: '#aaa', fontSize: '11px', display: 'block', marginBottom: '15px' }}>
                                    Allowed: PDF, DOC, DOCX (Max 5MB)
                                </small>
                            </div>
                            
                            <button type="submit" disabled={loading} style={styles.submitBtn}>
                                {loading ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default JobsPage;