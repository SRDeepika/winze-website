import React, { useState, useEffect } from 'react';
import { getJobs, applyForJob } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarker, faBriefcase, faClock, faMoneyBill, faEnvelope, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';

const CareersSection = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showApplyForm, setShowApplyForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', experience: '', currentCompany: '', currentCTC: '', noticePeriod: '', coverLetter: '', resume: null
    });

    useEffect(() => { loadJobs(); }, []);

    const loadJobs = async () => {
        try {
            const response = await getJobs();
            if (response.success) setJobs(response.jobs);
        } catch (error) {
            console.error('Error loading jobs:', error);
        } finally {
            setLoading(false);
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
        
        try {
            const applicationData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                experience: formData.experience,
                current_company: formData.currentCompany,
                current_ctc: formData.currentCTC,
                notice_period: formData.noticePeriod,
                cover_letter: formData.coverLetter,
                resume: formData.resume
            };
            
            await applyForJob(selectedJob.id, applicationData);
            setSuccessMessage('Application submitted successfully! We will contact you soon.');
            setShowApplyForm(false);
            setFormData({ name: '', email: '', phone: '', experience: '', currentCompany: '', currentCTC: '', noticePeriod: '', coverLetter: '', resume: null });
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            alert('Error submitting application. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return null;

    return (
        <section style={{
            padding: '100px 5%',
            background: 'linear-gradient(135deg, #1a1a3e 0%, #2d2d5e 100%)'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '3rem', color: 'white', marginBottom: '15px' }}>Join Our Team</h2>
                    <p style={{ color: '#FFD700', fontSize: '1.1rem' }}>Build your career with Winze Technologies</p>
                </div>

                {successMessage && (
                    <div style={{
                        background: '#d4edda', color: '#155724', padding: '15px', borderRadius: '10px',
                        textAlign: 'center', marginBottom: '30px'
                    }}>{successMessage}</div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                    {jobs.map(job => (
                        <div key={job.id} style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '25px',
                            transition: 'transform 0.3s',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <h3 style={{ color: '#1a1a2e', marginBottom: '10px' }}>{job.title}</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '15px', fontSize: '14px', color: '#666' }}>
                                <span><FontAwesomeIcon icon={faBriefcase} /> {job.department}</span>
                                <span><FontAwesomeIcon icon={faMapMarker} /> {job.location}</span>
                                <span><FontAwesomeIcon icon={faClock} /> {job.type}</span>
                                <span><FontAwesomeIcon icon={faMoneyBill} /> {job.salary}</span>
                            </div>
                            <p style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}><strong>Experience:</strong> {job.experience}</p>
                            <div dangerouslySetInnerHTML={{ __html: job.description?.substring(0, 150) + '...' }} style={{ color: '#666', marginBottom: '20px' }} />
                            <button
                                onClick={() => handleApply(job)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >Apply Now →</button>
                        </div>
                    ))}
                </div>

                {jobs.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'white', padding: '50px' }}>
                        <p>No open positions at the moment. Check back later!</p>
                    </div>
                )}
            </div>

            {/* Application Form Modal */}
            {showApplyForm && selectedJob && (
                <div style={modalStyles.overlay} onClick={() => setShowApplyForm(false)}>
                    <div style={modalStyles.content} onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setShowApplyForm(false)} style={modalStyles.closeBtn}>×</button>
                        <h2 style={{ marginBottom: '20px' }}>Apply for {selectedJob.title}</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <input type="text" name="name" placeholder="Full Name*" value={formData.name} onChange={handleInputChange} style={modalStyles.input} required />
                                <input type="email" name="email" placeholder="Email*" value={formData.email} onChange={handleInputChange} style={modalStyles.input} required />
                                <input type="tel" name="phone" placeholder="Phone*" value={formData.phone} onChange={handleInputChange} style={modalStyles.input} required />
                                <input type="text" name="experience" placeholder="Years of Experience*" value={formData.experience} onChange={handleInputChange} style={modalStyles.input} required />
                                <input type="text" name="currentCompany" placeholder="Current Company" value={formData.currentCompany} onChange={handleInputChange} style={modalStyles.input} />
                                <input type="text" name="currentCTC" placeholder="Current CTC" value={formData.currentCTC} onChange={handleInputChange} style={modalStyles.input} />
                                <input type="text" name="noticePeriod" placeholder="Notice Period" value={formData.noticePeriod} onChange={handleInputChange} style={modalStyles.input} />
                                <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={modalStyles.input} />
                            </div>
                            <textarea name="coverLetter" placeholder="Cover Letter / Additional Information" rows="4" value={formData.coverLetter} onChange={handleInputChange} style={modalStyles.textarea} />
                            <button type="submit" disabled={submitting} style={modalStyles.submitBtn}>
                                {submitting ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

const modalStyles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflow: 'auto' },
    content: { background: 'white', borderRadius: '20px', maxWidth: '700px', width: '100%', maxHeight: '90vh', overflow: 'auto', padding: '30px', position: 'relative' },
    closeBtn: { position: 'sticky', top: '0', right: '0', float: 'right', background: '#667eea', color: 'white', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' },
    input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' },
    submitBtn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '16px' }
};

export default CareersSection;