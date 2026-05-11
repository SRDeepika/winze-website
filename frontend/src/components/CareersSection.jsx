import React, { useState, useEffect } from 'react';
import { getJobs, applyForJob } from '../services/api';

const CareersSection = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showApplyForm, setShowApplyForm] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadJobs();
    }, []);

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

    if (loading) return null;

    return (
        <section style={{
            padding: '100px 5%',
            background: 'linear-gradient(135deg, #1a1a3e 0%, #2d2d5e 100%)'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '3rem', color: 'white', marginBottom: '15px' }}>Join Our Team</h2>
                    <p style={{ color: '#FFD700' }}>Build your career with Winze Technologies</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                    {jobs.map(job => (
                        <div key={job.id} style={{ background: 'white', borderRadius: '20px', padding: '25px' }}>
                            <h3>{job.title}</h3>
                            <p>{job.department} | {job.location}</p>
                            <button onClick={() => setSelectedJob(job)} style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white', padding: '12px', border: 'none', borderRadius: '10px', cursor: 'pointer'
                            }}>Apply Now</button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CareersSection;