import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarker, faBriefcase, faClock, faMoneyBill } from '@fortawesome/free-solid-svg-icons';

const CareersSection = () => {
    const [selectedJob, setSelectedJob] = useState(null);
    const [showApplyForm, setShowApplyForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', experience: '', currentCompany: '', 
        currentCTC: '', noticePeriod: '', coverLetter: '', resume: null
    });

    // Hardcoded job data
    const jobs = [
        {
            id: 1,
            title: "Senior Software Engineer",
            department: "Engineering",
            location: "Bangalore, India",
            type: "Full-time",
            experience: "5-8 years",
            salary: "15-22 LPA",
            description: "<p>We are looking for a Senior Software Engineer to lead our development team in building cutting-edge enterprise solutions.</p><h4>Key Responsibilities:</h4><ul><li>Design and develop scalable web applications</li><li>Lead technical architecture decisions</li><li>Mentor junior developers</li><li>Collaborate with product managers</li></ul>",
            requirements: "Bachelor's degree in Computer Science, 5+ years experience with React and Node.js",
            benefits: "Health insurance, flexible work hours, learning budget"
        },
        {
            id: 2,
            title: "Cybersecurity Specialist",
            department: "Security",
            location: "Remote",
            type: "Full-time",
            experience: "3-6 years",
            salary: "10-16 LPA",
            description: "<p>Join our security team to protect enterprise clients from evolving cyber threats.</p><h4>Key Responsibilities:</h4><ul><li>Conduct security assessments and penetration testing</li><li>Implement security solutions for clients</li><li>Monitor and respond to security incidents</li><li>Stay updated on latest security threats</li></ul>",
            requirements: "Experience with security tools, Certifications like CEH, CISSP preferred",
            benefits: "Professional certification sponsorship, learning budget"
        },
        {
            id: 3,
            title: "Sales Manager - Enterprise Solutions",
            department: "Sales",
            location: "Mumbai, India",
            type: "Full-time",
            experience: "6-10 years",
            salary: "18-25 LPA + Commission",
            description: "<p>Drive enterprise sales of our technology solutions to large corporations.</p><h4>Key Responsibilities:</h4><ul><li>Develop and execute sales strategies</li><li>Build relationships with C-level executives</li><li>Meet and exceed sales targets</li><li>Lead a team of sales professionals</li></ul>",
            requirements: "Proven track record in enterprise technology sales",
            benefits: "Performance bonuses, international travel opportunities"
        }
    ];

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
        
        // Simulate API call
        setTimeout(() => {
            setSuccessMessage('Application submitted successfully! We will contact you soon.');
            setShowApplyForm(false);
            setFormData({ name: '', email: '', phone: '', experience: '', currentCompany: '', currentCTC: '', noticePeriod: '', coverLetter: '', resume: null });
            setTimeout(() => setSuccessMessage(''), 3000);
            setSubmitting(false);
        }, 1000);
    };

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
                            <div dangerouslySetInnerHTML={{ __html: job.description.substring(0, 150) + '...' }} style={{ color: '#666', marginBottom: '20px' }} />
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
            </div>

            {/* Application Form Modal */}
            {showApplyForm && selectedJob && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.95)', zIndex: 10000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px', overflow: 'auto'
                }} onClick={() => setShowApplyForm(false)}>
                    <div style={{
                        background: 'white', borderRadius: '20px', maxWidth: '700px',
                        width: '100%', maxHeight: '90vh', overflow: 'auto',
                        padding: '30px', position: 'relative'
                    }} onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setShowApplyForm(false)} style={{
                            position: 'sticky', top: '0', right: '0', float: 'right',
                            background: '#667eea', color: 'white', border: 'none',
                            width: '30px', height: '30px', borderRadius: '50%',
                            cursor: 'pointer', fontSize: '18px'
                        }}>×</button>
                        <h2 style={{ marginBottom: '20px' }}>Apply for {selectedJob.title}</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <input type="text" name="name" placeholder="Full Name*" value={formData.name} onChange={handleInputChange} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }} required />
                                <input type="email" name="email" placeholder="Email*" value={formData.email} onChange={handleInputChange} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }} required />
                                <input type="tel" name="phone" placeholder="Phone*" value={formData.phone} onChange={handleInputChange} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }} required />
                                <input type="text" name="experience" placeholder="Years of Experience*" value={formData.experience} onChange={handleInputChange} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }} required />
                                <input type="text" name="currentCompany" placeholder="Current Company" value={formData.currentCompany} onChange={handleInputChange} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                <input type="text" name="currentCTC" placeholder="Current CTC" value={formData.currentCTC} onChange={handleInputChange} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                <input type="text" name="noticePeriod" placeholder="Notice Period" value={formData.noticePeriod} onChange={handleInputChange} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                            </div>
                            <textarea name="coverLetter" placeholder="Cover Letter / Additional Information" rows="4" value={formData.coverLetter} onChange={handleInputChange} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd', resize: 'vertical' }} />
                            <button type="submit" disabled={submitting} style={{
                                width: '100%', padding: '14px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white', border: 'none', borderRadius: '10px',
                                cursor: 'pointer', fontWeight: '600', fontSize: '16px'
                            }}>
                                {submitting ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default CareersSection;