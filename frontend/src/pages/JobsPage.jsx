import React, { useState, useEffect } from 'react';
import { getJobs, applyForJob } from '../services/api';
import SEO from '../components/SEO';

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
        resume_url: ''
    });

    useEffect(() => {
        loadJobs();
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
                setFormData(prev => ({ ...prev, resume_url: reader.result }));
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
            resume_url: ''
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
                resume_url: formData.resume_url
            };
            
            const response = await applyForJob(selectedJob.id, applicationData);
            
            if (response.success) {
                alert('Application submitted successfully!');
                setShowApplicationForm(false);
                setSelectedJob(null);
                setResumeFile(null);
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

    const styles = {
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '40px 20px'
        },
        title: {
            fontSize: '2.5rem',
            marginBottom: '10px',
            color: '#333'
        },
        subtitle: {
            fontSize: '1.1rem',
            color: '#666',
            marginBottom: '40px'
        },
        jobCard: {
            background: 'white',
            borderRadius: '10px',
            padding: '25px',
            marginBottom: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            border: '1px solid #eee'
        },
        jobTitle: {
            fontSize: '1.3rem',
            marginBottom: '10px',
            color: '#333'
        },
        jobMeta: {
            color: '#667eea',
            marginBottom: '15px',
            fontSize: '14px'
        },
        jobDesc: {
            color: '#666',
            marginBottom: '20px',
            lineHeight: '1.6'
        },
        applyBtn: {
            background: '#667eea',
            color: 'white',
            border: 'none',
            padding: '10px 25px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
        },
        modal: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        },
        modalContent: {
            background: 'white',
            borderRadius: '15px',
            padding: '30px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '85vh',
            overflow: 'auto',
            position: 'relative'
        },
        closeBtn: {
            position: 'absolute',
            top: '15px',
            right: '20px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#999'
        },
        input: {
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '14px',
            boxSizing: 'border-box'
        },
        fileInput: {
            width: '100%',
            padding: '10px',
            marginBottom: '15px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            background: '#f9f9f9',
            fontSize: '14px',
            boxSizing: 'border-box'
        },
        fileInfo: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            background: '#f0f0f0',
            borderRadius: '8px',
            marginBottom: '15px',
            fontSize: '13px'
        },
        removeFileBtn: {
            background: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '4px 10px',
            cursor: 'pointer',
            fontSize: '12px'
        },
        submitBtn: {
            width: '100%',
            padding: '12px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
        }
    };

    return (
        <>
            <SEO title="Careers | Winze Technologies" />
            <div style={styles.container}>
                <h1 style={styles.title}>Join Our Team</h1>
                <p style={styles.subtitle}>Be part of something great. Explore our current opportunities.</p>
                
                <div>
                    {jobs.map(job => (
                        <div key={job.id} style={styles.jobCard}>
                            <h3 style={styles.jobTitle}>{job.title}</h3>
                            <div style={styles.jobMeta}>
                                {job.location} | {job.type} | {job.experience} years exp
                            </div>
                            <p style={styles.jobDesc}>{job.description}</p>
                            <button style={styles.applyBtn} onClick={() => handleApply(job)}>Apply Now →</button>
                        </div>
                    ))}
                </div>
            </div>

            {showApplicationForm && selectedJob && (
                <div style={styles.modal} onClick={() => setShowApplicationForm(false)}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button style={styles.closeBtn} onClick={() => setShowApplicationForm(false)}>×</button>
                        <h3 style={{ marginBottom: '20px' }}>Apply for {selectedJob.title}</h3>
                        <form onSubmit={handleSubmit}>
                            <input type="text" name="name" placeholder="Full Name *" value={formData.name} onChange={handleInputChange} style={styles.input} required />
                            <input type="email" name="email" placeholder="Email Address *" value={formData.email} onChange={handleInputChange} style={styles.input} required />
                            <input type="tel" name="phone" placeholder="Phone Number *" value={formData.phone} onChange={handleInputChange} style={styles.input} required />
                            <input type="text" name="experience" placeholder="Years of Experience" value={formData.experience} onChange={handleInputChange} style={styles.input} />
                            <input type="text" name="current_company" placeholder="Current Company" value={formData.current_company} onChange={handleInputChange} style={styles.input} />
                            
                            {/* Resume Upload - No cover letter */}
                            <div>
                                <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={styles.fileInput} required />
                                {resumeFile && (
                                    <div style={styles.fileInfo}>
                                        <span>📄 {resumeFile.name}</span>
                                        <button type="button" onClick={() => { setResumeFile(null); setFormData(prev => ({ ...prev, resume_url: '' })); }} style={styles.removeFileBtn}>Remove</button>
                                    </div>
                                )}
                                <small style={{ color: '#666', fontSize: '11px', display: 'block', marginBottom: '15px' }}>
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