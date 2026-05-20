import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { getJobs, applyForJob } from '../services/api';

const JobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showApplyForm, setShowApplyForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', experience: '',
        current_company: '', current_ctc: '', notice_period: '',
        cover_letter: '', resume: null
    });

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            const res = await getJobs();
            if (res.success) setJobs(res.jobs);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, resume: e.target.files[0] }));
    };

   const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const applicationData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        experience: formData.experience,      // ← ADD THIS
        cover_letter: formData.cover_letter
    };

    try {
        const response = await axios.post(
            `https://winze-backend-api.onrender.com/api/jobs/${selectedJob.id}/apply`,
            applicationData,
            { headers: { 'Content-Type': 'application/json' } }
        );
        
        if (response.data.success) {
            alert('Application submitted successfully!');
            setShowApplyForm(false);
            setFormData({ 
                name: '', email: '', phone: '', experience: '',  // ← ADD experience here
                cover_letter: '', resume: null 
            });
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting application. Please try again.');
    } finally {
        setSubmitting(false);
    }
};

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;

    return (
        <div style={{ padding: '100px 5%', maxWidth: '1200px', margin: '0 auto', background: '#f5f6fa', minHeight: '100vh' }}>
            <h1 style={{ textAlign: 'center', fontSize: '2.5rem', color: '#1a1a2e' }}>Careers at Winze Technologies</h1>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '50px' }}>Join our team and be part of innovation</p>

            {jobs.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No open positions at the moment.</p>
            ) : (
                <div style={{ display: 'grid', gap: '25px' }}>
                    {jobs.map(job => (
                        <div key={job.id} style={{ background: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                            <h2>{job.title}</h2>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                <span style={{ background: '#f0f0f0', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>{job.department || 'General'}</span>
                                <span style={{ background: '#f0f0f0', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>{job.location || 'Remote'}</span>
                                <span style={{ background: '#f0f0f0', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>{job.type || 'Full-time'}</span>
                            </div>
                            <p>{job.description?.substring(0, 200)}...</p>
                            {job.salary && <p>💰 {job.salary}</p>}
                            {job.experience && <p>📅 Experience: {job.experience}</p>}
                            <button onClick={() => { setSelectedJob(job); setShowApplyForm(true); }} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '30px', cursor: 'pointer', marginTop: '15px' }}>Apply Now →</button>
                        </div>
                    ))}
                </div>
            )}

            {showApplyForm && selectedJob && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowApplyForm(false)}>
                    <div style={{ background: 'white', borderRadius: '20px', padding: '30px', maxWidth: '600px', width: '100%', maxHeight: '85vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
                        <h2>Apply for {selectedJob.title}</h2>
                        <form onSubmit={handleSubmitApplication}>
                            <input type="text" name="name" placeholder="Full Name *" value={formData.name} onChange={handleInputChange} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' }} required />
                            <input type="email" name="email" placeholder="Email Address *" value={formData.email} onChange={handleInputChange} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' }} required />
                            <input type="tel" name="phone" placeholder="Phone Number *" value={formData.phone} onChange={handleInputChange} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' }} required />
                            <input type="text" name="experience" placeholder="Years of Experience" value={formData.experience} onChange={handleInputChange} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' }} />
                            <input type="text" name="current_company" placeholder="Current Company" value={formData.current_company} onChange={handleInputChange} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' }} />
                            <input type="text" name="current_ctc" placeholder="Current CTC (e.g., 5 LPA)" value={formData.current_ctc} onChange={handleInputChange} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' }} />
                            <input type="text" name="notice_period" placeholder="Notice Period (e.g., 30 days)" value={formData.notice_period} onChange={handleInputChange} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' }} />
                            <textarea name="cover_letter" placeholder="Cover Letter" rows="4" value={formData.cover_letter} onChange={handleInputChange} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' }}></textarea>
                            <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px dashed #ddd', borderRadius: '8px' }} />
                            <small>Upload your resume (PDF, DOC, DOCX)</small>
                            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                                <button type="button" onClick={() => setShowApplyForm(false)} style={{ flex: 1, padding: '12px', background: '#ccc', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" disabled={submitting} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>{submitting ? 'Submitting...' : 'Submit Application'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobsPage;