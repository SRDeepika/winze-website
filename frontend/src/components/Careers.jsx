import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faBriefcase, faMapMarkerAlt, faClock, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://winze-backend-api.onrender.com/api';

const Careers = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', experience: '', current_company: '', current_ctc: '', notice_period: '', cover_letter: '', resume: null
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/jobs`);
            setJobs(res.data);
        } catch (err) {
            console.error('Error fetching jobs:', err);
        }
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
        const data = new FormData();
        data.append('job_id', selectedJob.id);
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        data.append('experience', formData.experience);
        data.append('current_company', formData.current_company);
        data.append('current_ctc', formData.current_ctc);
        data.append('notice_period', formData.notice_period);
        data.append('cover_letter', formData.cover_letter);
        data.append('resume', formData.resume);

        try {
            await axios.post(`${API_BASE_URL}/applications`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSubmitted(true);
            setTimeout(() => {
                setShowForm(false);
                setSelectedJob(null);
                setSubmitted(false);
                setFormData({ name: '', email: '', phone: '', experience: '', current_company: '', current_ctc: '', notice_period: '', cover_letter: '', resume: null });
            }, 3000);
        } catch (err) {
            alert('Error submitting application. Please try again.');
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 20px' }}>
            <h1 style={{ fontSize: '48px', color: '#1a1a2e', textAlign: 'center', marginBottom: '20px' }}>Careers at Winze</h1>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '50px', fontSize: '18px' }}>Join our team and help us drive innovation</p>

            <div style={{ display: 'grid', gap: '25px' }}>
                {jobs.map(job => (
                    <div key={job.id} style={{ background: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 5px 20px rgba(0,0,0,0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap' }}>
                            <div>
                                <h3 style={{ fontSize: '22px', color: '#1a1a2e', marginBottom: '10px' }}>{job.title}</h3>
                                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
                                    <span style={{ background: '#667eea', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>{job.department}</span>
                                    <span style={{ color: '#555' }}>📍 {job.location}</span>
                                    <span style={{ color: '#555' }}>💼 {job.job_type}</span>
                                    <span style={{ color: '#555' }}>📅 {job.experience}</span>
                                </div>
                                <p style={{ color: '#666' }}>{job.description?.substring(0, 150)}...</p>
                            </div>
                            <button onClick={() => { setSelectedJob(job); setShowForm(true); }} style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '30px', cursor: 'pointer', fontWeight: '600' }}>Apply Now →</button>
                        </div>
                    </div>
                ))}
            </div>

            {jobs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
                    <p>No open positions at the moment. Please check back later!</p>
                </div>
            )}

            {showForm && selectedJob && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflow: 'auto' }} onClick={() => setShowForm(false)}>
                    <div style={{ background: 'white', borderRadius: '20px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto', padding: '40px' }} onClick={(e) => e.stopPropagation()}>
                        {!submitted ? (
                            <>
                                <h2 style={{ marginBottom: '10px' }}>Apply for {selectedJob.title}</h2>
                                <form onSubmit={handleSubmit}>
                                    <input type="text" name="name" placeholder="Full Name *" required onChange={handleInputChange} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                    <input type="email" name="email" placeholder="Email *" required onChange={handleInputChange} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                    <input type="tel" name="phone" placeholder="Phone *" required onChange={handleInputChange} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                    <input type="text" name="experience" placeholder="Years of Experience" onChange={handleInputChange} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                    <input type="text" name="current_company" placeholder="Current Company" onChange={handleInputChange} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                    <textarea name="cover_letter" placeholder="Cover Letter" rows="4" onChange={handleInputChange} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' }}></textarea>
                                    <input type="file" name="resume" accept=".pdf,.doc,.docx" required onChange={handleFileChange} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '12px', background: '#ccc', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                                        <button type="submit" style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Submit</button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '60px', color: '#28a745' }} />
                                <h2>Application Submitted!</h2>
                                <p>We'll review and get back to you soon.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Careers;