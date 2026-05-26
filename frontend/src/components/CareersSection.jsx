import React, { useState } from 'react';
import { getJobs, applyForJob, trackClick } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faFileAlt } from '@fortawesome/free-solid-svg-icons';

const CareersSection = () => {
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
        current_company: ''
    });

    // Load jobs on component mount
    React.useEffect(() => {
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

    const handleResumeChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(file.type)) {
                alert('Please upload PDF or DOC/DOCX file only');
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size should be less than 5MB');
                return;
            }
            setResumeFile(file);
            
            // Convert to base64 for storage (or you can upload to cloud)
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, resume_url: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleApply = async (job) => {
        setSelectedJob(job);
        setShowApplicationForm(true);
        // Reset form
        setFormData({
            name: '',
            email: '',
            phone: '',
            experience: '',
            current_company: ''
        });
        setResumeFile(null);
    };

    const handleSubmitApplication = async (e) => {
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
            console.error('Error submitting application:', error);
            alert('Error submitting application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="careers-section">
            <h2>Current Openings</h2>
            <div className="jobs-grid">
                {jobs.map(job => (
                    <div key={job.id} className="job-card">
                        <h3>{job.title}</h3>
                        <p className="location">{job.location}</p>
                        <p className="type">{job.type}</p>
                        <button onClick={() => handleApply(job)}>Apply Now</button>
                    </div>
                ))}
            </div>

            {showApplicationForm && selectedJob && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-btn" onClick={() => setShowApplicationForm(false)}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <h3>Apply for {selectedJob.title}</h3>
                        <form onSubmit={handleSubmitApplication}>
                            <input type="text" name="name" placeholder="Full Name *" value={formData.name} onChange={handleInputChange} required />
                            <input type="email" name="email" placeholder="Email Address *" value={formData.email} onChange={handleInputChange} required />
                            <input type="tel" name="phone" placeholder="Phone Number *" value={formData.phone} onChange={handleInputChange} required />
                            <input type="text" name="experience" placeholder="Years of Experience" value={formData.experience} onChange={handleInputChange} />
                            <input type="text" name="current_company" placeholder="Current Company" value={formData.current_company} onChange={handleInputChange} />
                            
                            {/* Resume Upload - No cover letter */}
                            <div className="file-upload">
                                <label>Resume (PDF, DOC, DOCX) *</label>
                                <input 
                                    type="file" 
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleResumeChange}
                                    required 
                                />
                                {resumeFile && (
                                    <div className="file-info">
                                        <FontAwesomeIcon icon={faFileAlt} />
                                        <span>{resumeFile.name}</span>
                                        <button type="button" onClick={() => { setResumeFile(null); setFormData(prev => ({ ...prev, resume_url: '' })); }}>Remove</button>
                                    </div>
                                )}
                                <small>Max file size: 5MB. Allowed formats: PDF, DOC, DOCX</small>
                            </div>
                            
                            <button type="submit" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CareersSection;