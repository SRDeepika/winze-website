import React, { useState, useEffect } from 'react';
import { getJobs, applyForJob } from '../services/api';

const JobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showApplyForm, setShowApplyForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', experience: '',
        current_company: '', cover_letter: '', resume: null
    });

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            const res = await getJobs();
            if (res.success) setJobs(res.jobs);
        } catch (error) {
            console.error('Error loading jobs:', error);
        }
    };

    const handleApply = (job) => {
        setSelectedJob(job);
        setShowApplyForm(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, resume: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('experience', formData.experience);
        formDataToSend.append('current_company', formData.current_company);
        formDataToSend.append('cover_letter', formData.cover_letter);
        if (formData.resume) formDataToSend.append('resume', formData.resume);
        formDataToSend.append('job_id', selectedJob.id);
        formDataToSend.append('job_title', selectedJob.title);

        try {
            await applyForJob(selectedJob.id, formDataToSend);
            alert('Application submitted successfully! We will contact you soon.');
            setShowApplyForm(false);
            setFormData({ name: '', email: '', phone: '', experience: '', current_company: '', cover_letter: '', resume: null });
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('There was an error submitting your application. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const activeJobs = jobs.filter(job => job.status === 'active');

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Careers at Winze Technologies</h1>
                <p style={styles.subtitle}>Join our team and be part of innovation</p>
            </div>

            {activeJobs.length === 0 ? (
                <div style={styles.noJobs}>
                    <p>No open positions at the moment. Please check back later!</p>
                </div>
            ) : (
                <div style={styles.jobsGrid}>
                    {activeJobs.map(job => (
                        <div key={job.id} style={styles.jobCard}>
                            <h2 style={styles.jobTitle}>{job.title}</h2>
                            <div style={styles.jobMeta}>
                                <span style={styles.badge}>{job.department}</span>
                                <span style={styles.badge}>{job.location}</span>
                                <span style={styles.badge}>{job.type}</span>
                            </div>
                            <p style={styles.jobDesc}>{job.description?.substring(0, 150)}...</p>
                            <div style={styles.jobFooter}>
                                <span style={styles.salary}>{job.salary}</span>
                                <button onClick={() => handleApply(job)} style={styles.applyBtn}>Apply Now →</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Application Modal */}
            {showApplyForm && selectedJob && (
                <div style={styles.modal} onClick={() => setShowApplyForm(false)}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2>Apply for {selectedJob.title}</h2>
                        <form onSubmit={handleSubmit}>
                            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} style={styles.input} required />
                            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} style={styles.input} required />
                            <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} style={styles.input} required />
                            <input type="text" name="experience" placeholder="Years of Experience" value={formData.experience} onChange={handleInputChange} style={styles.input} />
                            <input type="text" name="current_company" placeholder="Current Company" value={formData.current_company} onChange={handleInputChange} style={styles.input} />
                            <textarea name="cover_letter" placeholder="Cover Letter / Why do you want to join?" rows="4" value={formData.cover_letter} onChange={handleInputChange} style={styles.textarea}></textarea>
                            <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={styles.fileInput} />
                            <small style={styles.fileHint}>Upload your resume (PDF, DOC, DOCX)</small>
                            <div style={styles.modalButtons}>
                                <button type="button" onClick={() => setShowApplyForm(false)} style={styles.cancelBtn}>Cancel</button>
                                <button type="submit" disabled={submitting} style={styles.submitBtn}>{submitting ? 'Submitting...' : 'Submit Application'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { padding: '100px 5% 80px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', background: '#f5f6fa' },
    header: { textAlign: 'center', marginBottom: '50px' },
    title: { fontSize: '2.5rem', color: '#1a1a2e', marginBottom: '15px' },
    subtitle: { fontSize: '1.1rem', color: '#666' },
    jobsGrid: { display: 'grid', gap: '25px' },
    jobCard: { background: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #eee', transition: '0.3s' },
    jobTitle: { fontSize: '1.4rem', color: '#1a1a2e', marginBottom: '12px' },
    jobMeta: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' },
    badge: { background: '#f0f0f0', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#555' },
    jobDesc: { color: '#666', lineHeight: '1.5', marginBottom: '20px' },
    jobFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' },
    salary: { color: '#667eea', fontWeight: '600' },
    applyBtn: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '30px', cursor: 'pointer', fontWeight: '600' },
    noJobs: { textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px', color: '#666' },
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
    modalContent: { background: 'white', borderRadius: '20px', padding: '30px', maxWidth: '600px', width: '100%', maxHeight: '85vh', overflow: 'auto' },
    input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' },
    fileInput: { width: '100%', padding: '10px', marginBottom: '10px', border: '1px dashed #ddd', borderRadius: '8px' },
    fileHint: { display: 'block', color: '#999', fontSize: '12px', marginBottom: '15px' },
    modalButtons: { display: 'flex', gap: '15px', marginTop: '20px' },
    cancelBtn: { flex: 1, padding: '12px', background: '#ccc', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
    submitBtn: { flex: 1, padding: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
};

export default JobsPage;