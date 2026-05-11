import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSocialLinks from './AdminSocialLinks';
import { 
  getAdminBlogs, createBlog, updateBlog, deleteBlog,
  getAdminJobs, createJob, updateJob, deleteJob,
  getApplications, updateApplicationStatus,
  getQuotes, getAdminStats,
  getUsers, createUser, deleteUser, adminLogin
} from '../services/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://winze-backend-api.onrender.com/api';

// Helper to get auth config
const getAuthConfig = () => {
    const token = sessionStorage.getItem('adminToken');
    return { headers: { Authorization: `Bearer ${token}` } };
};

// ============================================
// LOGIN COMPONENT
// ============================================
const AdminLogin = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await adminLogin(username, password);
            if (res.success) {
                sessionStorage.clear();
                sessionStorage.setItem('adminToken', res.token);
                sessionStorage.setItem('adminUsername', username);
                sessionStorage.setItem('adminRole', res.admin.role);
                onLogin(username, res.admin.role);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.iconContainer}>
                    <span style={styles.icon}>🔐</span>
                </div>
                <h2 style={styles.title}>Admin Login</h2>
                <p style={styles.subtitle}>Enter your credentials to access dashboard</p>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Username" value={username}
                        onChange={(e) => setUsername(e.target.value)} style={styles.input} required />
                    <input type="password" placeholder="Password" value={password}
                        onChange={(e) => setPassword(e.target.value)} style={styles.input} required />
                    {error && <div style={styles.error}>{error}</div>}
                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#aaa' }}>
                    <p>Demo: admin/admin123 | superadmin/SuperAdmin@2024</p>
                </div>
            </div>
        </div>
    );
};

// ============================================
// BLOG MANAGER COMPONENT (Full CRUD)
// ============================================
const BlogManager = ({ token }) => {
    const [blogs, setBlogs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '', excerpt: '', content: '', category: '', 
        author: '', author_role: '', read_time: 5, status: 'draft', image: null
    });

    useEffect(() => { loadBlogs(); }, []);

    const loadBlogs = async () => {
        const res = await getAdminBlogs(token);
        if (res.success) setBlogs(res.blogs);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (editingBlog) {
            await updateBlog(editingBlog.id, formData, token);
        } else {
            await createBlog(formData, token);
        }
        await loadBlogs();
        setShowForm(false);
        setEditingBlog(null);
        setFormData({ title: '', excerpt: '', content: '', category: '', author: '', author_role: '', read_time: 5, status: 'draft', image: null });
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this blog permanently?')) {
            await deleteBlog(id, token);
            await loadBlogs();
        }
    };

    const handleEdit = (blog) => {
        setEditingBlog(blog);
        setFormData({
            title: blog.title, excerpt: blog.excerpt, content: blog.content,
            category: blog.category, author: blog.author, author_role: blog.author_role,
            read_time: blog.read_time, status: blog.status, image: null
        });
        setShowForm(true);
    };

    return (
        <div style={styles.card}>
            <div style={styles.cardHeader}>
                <h2>📝 Blog Management</h2>
                <button onClick={() => setShowForm(true)} style={styles.addButton}>+ New Blog</button>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.tableHeader}>
                            <th style={styles.th}>Title</th><th style={styles.th}>Category</th>
                            <th style={styles.th}>Status</th><th style={styles.th}>Views</th>
                            <th style={styles.th}>Created</th><th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.map(blog => (
                            <tr key={blog.id} style={styles.tableRow}>
                                <td style={styles.td}><strong>{blog.title}</strong><br/><small style={{color:'#888'}}>{blog.slug}</small></td>
                                <td style={styles.td}><span style={styles.badge}>{blog.category}</span></td>
                                <td style={styles.td}>
                                    <span style={{
                                        ...styles.statusBadge,
                                        background: blog.status === 'published' ? '#d4edda' : '#ffeaa7',
                                        color: blog.status === 'published' ? '#155724' : '#856404'
                                    }}>{blog.status}</span>
                                </td>
                                <td style={styles.td}>{blog.views || 0}</td>
                                <td style={styles.td}>{new Date(blog.created_at).toLocaleDateString()}</td>
                                <td style={styles.td}>
                                    <button onClick={() => handleEdit(blog)} style={styles.editBtn}>✏️ Edit</button>
                                    <button onClick={() => handleDelete(blog.id)} style={styles.deleteBtn}>🗑️ Delete</button>
                                </td>
                            </tr>
                        ))}
                        {blogs.length === 0 && (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>No blogs yet. Create your first blog!</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Blog Form Modal */}
            {showForm && (
                <div style={styles.modal} onClick={() => { setShowForm(false); setEditingBlog(null); }}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h3>{editingBlog ? '✏️ Edit Blog' : '📝 Create New Blog'}</h3>
                        <form onSubmit={handleSubmit}>
                            <input type="text" placeholder="Blog Title*" value={formData.title} 
                                onChange={e => setFormData({...formData, title: e.target.value})} style={styles.input} required />
                            <input type="text" placeholder="Category* (e.g., AI & Security, Communications)" 
                                value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={styles.input} required />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <input type="text" placeholder="Author" value={formData.author} 
                                    onChange={e => setFormData({...formData, author: e.target.value})} style={styles.input} />
                                <input type="text" placeholder="Author Role (e.g., CEO)" value={formData.author_role} 
                                    onChange={e => setFormData({...formData, author_role: e.target.value})} style={styles.input} />
                            </div>
                            <textarea placeholder="Excerpt* (Short description)" rows="2" value={formData.excerpt} 
                                onChange={e => setFormData({...formData, excerpt: e.target.value})} style={styles.textarea} required />
                            <textarea placeholder="Content* (HTML supported)" rows="8" value={formData.content} 
                                onChange={e => setFormData({...formData, content: e.target.value})} style={styles.textarea} required />
                            <input type="file" accept="image/*" onChange={e => setFormData({...formData, image: e.target.files[0]})} style={styles.input} />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <input type="number" placeholder="Read Time (minutes)" value={formData.read_time} 
                                    onChange={e => setFormData({...formData, read_time: e.target.value})} style={styles.input} />
                                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={styles.input}>
                                    <option value="draft">📄 Draft</option><option value="published">✅ Published</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button type="submit" disabled={loading} style={styles.saveBtn}>
                                    {loading ? 'Saving...' : (editingBlog ? 'Update Blog' : 'Create Blog')}
                                </button>
                                <button type="button" onClick={() => { setShowForm(false); setEditingBlog(null); }} style={styles.cancelBtn}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================
// JOB MANAGER COMPONENT (Full CRUD)
// ============================================
const JobManager = ({ token }) => {
    const [jobs, setJobs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '', department: '', location: '', type: 'Full-time', 
        experience: '', salary: '', description: '', requirements: '', 
        benefits: '', status: 'active', deadline: ''
    });

    useEffect(() => { loadJobs(); }, []);

    const loadJobs = async () => {
        const res = await getAdminJobs(token);
        if (res.success) setJobs(res.jobs);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (editingJob) {
            await updateJob(editingJob.id, formData, token);
        } else {
            await createJob(formData, token);
        }
        await loadJobs();
        setShowForm(false);
        setEditingJob(null);
        setFormData({ title: '', department: '', location: '', type: 'Full-time', experience: '', salary: '', description: '', requirements: '', benefits: '', status: 'active', deadline: '' });
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this job posting? All applications will also be deleted.')) {
            await deleteJob(id, token);
            await loadJobs();
        }
    };

    const handleEdit = (job) => {
        setEditingJob(job);
        setFormData({
            title: job.title, department: job.department, location: job.location,
            type: job.type, experience: job.experience, salary: job.salary,
            description: job.description, requirements: job.requirements,
            benefits: job.benefits, status: job.status,
            deadline: job.deadline ? job.deadline.split('T')[0] : ''
        });
        setShowForm(true);
    };

    return (
        <div style={styles.card}>
            <div style={styles.cardHeader}>
                <h2>💼 Career / Job Management</h2>
                <button onClick={() => setShowForm(true)} style={styles.addButton}>+ Post New Job</button>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.tableHeader}>
                            <th style={styles.th}>Title</th><th style={styles.th}>Department</th>
                            <th style={styles.th}>Location</th><th style={styles.th}>Type</th>
                            <th style={styles.th}>Status</th><th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map(job => (
                            <tr key={job.id} style={styles.tableRow}>
                                <td style={styles.td}><strong>{job.title}</strong></td>
                                <td style={styles.td}>{job.department}</td>
                                <td style={styles.td}>{job.location}</td>
                                <td style={styles.td}>{job.type}</td>
                                <td style={styles.td}>
                                    <span style={{
                                        ...styles.statusBadge,
                                        background: job.status === 'active' ? '#d4edda' : '#f8d7da',
                                        color: job.status === 'active' ? '#155724' : '#721c24'
                                    }}>{job.status}</span>
                                </td>
                                <td style={styles.td}>
                                    <button onClick={() => handleEdit(job)} style={styles.editBtn}>✏️ Edit</button>
                                    <button onClick={() => handleDelete(job.id)} style={styles.deleteBtn}>🗑️ Delete</button>
                                </td>
                            </tr>
                        ))}
                        {jobs.length === 0 && (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>No jobs posted. Create your first job posting!</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Job Form Modal */}
            {showForm && (
                <div style={styles.modal} onClick={() => { setShowForm(false); setEditingJob(null); }}>
                    <div style={{...styles.modalContent, maxWidth: '800px'}} onClick={e => e.stopPropagation()}>
                        <h3>{editingJob ? '✏️ Edit Job' : '📢 Post New Job'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <input type="text" placeholder="Job Title*" value={formData.title} 
                                    onChange={e => setFormData({...formData, title: e.target.value})} style={styles.input} required />
                                <input type="text" placeholder="Department*" value={formData.department} 
                                    onChange={e => setFormData({...formData, department: e.target.value})} style={styles.input} required />
                                <input type="text" placeholder="Location*" value={formData.location} 
                                    onChange={e => setFormData({...formData, location: e.target.value})} style={styles.input} required />
                                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={styles.input}>
                                    <option value="Full-time">Full-time</option><option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option><option value="Remote">Remote</option><option value="Hybrid">Hybrid</option>
                                </select>
                                <input type="text" placeholder="Experience (e.g., 3-5 years)" value={formData.experience} 
                                    onChange={e => setFormData({...formData, experience: e.target.value})} style={styles.input} />
                                <input type="text" placeholder="Salary Range (e.g., 12-18 LPA)" value={formData.salary} 
                                    onChange={e => setFormData({...formData, salary: e.target.value})} style={styles.input} />
                                <input type="date" placeholder="Application Deadline" value={formData.deadline} 
                                    onChange={e => setFormData({...formData, deadline: e.target.value})} style={styles.input} />
                                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={styles.input}>
                                    <option value="active">✅ Active</option><option value="closed">❌ Closed</option>
                                </select>
                            </div>
                            <textarea placeholder="Job Description* (HTML supported)" rows="5" value={formData.description} 
                                onChange={e => setFormData({...formData, description: e.target.value})} style={styles.textarea} required />
                            <textarea placeholder="Requirements" rows="3" value={formData.requirements} 
                                onChange={e => setFormData({...formData, requirements: e.target.value})} style={styles.textarea} />
                            <textarea placeholder="Benefits" rows="2" value={formData.benefits} 
                                onChange={e => setFormData({...formData, benefits: e.target.value})} style={styles.textarea} />
                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button type="submit" disabled={loading} style={styles.saveBtn}>
                                    {loading ? 'Saving...' : (editingJob ? 'Update Job' : 'Post Job')}
                                </button>
                                <button type="button" onClick={() => { setShowForm(false); setEditingJob(null); }} style={styles.cancelBtn}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================
// APPLICATIONS MANAGER COMPONENT
// ============================================
const ApplicationsManager = ({ token }) => {
    const [applications, setApplications] = useState([]);
    const [selectedApp, setSelectedApp] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => { loadApplications(); }, []);

    const loadApplications = async () => {
        setLoading(true);
        const res = await getApplications(token);
        if (res.success) setApplications(res.applications);
        setLoading(false);
    };

    const updateStatus = async (id, status) => {
        await updateApplicationStatus(id, status, token);
        await loadApplications();
    };

    return (
        <div style={styles.card}>
            <div style={styles.cardHeader}>
                <h2>📋 Job Applications</h2>
                <button onClick={loadApplications} style={styles.refreshBtn}>🔄 Refresh</button>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.tableHeader}>
                            <th style={styles.th}>Name</th><th style={styles.th}>Job Title</th>
                            <th style={styles.th}>Email</th><th style={styles.th}>Experience</th>
                            <th style={styles.th}>Status</th><th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map(app => (
                            <tr key={app.id} style={styles.tableRow}>
                                <td style={styles.td}><strong>{app.name}</strong></td>
                                <td style={styles.td}>{app.job_title}</td>
                                <td style={styles.td}>{app.email}</td>
                                <td style={styles.td}>{app.experience || 'N/A'} yrs</td>
                                <td style={styles.td}>
                                    <select value={app.status} onChange={e => updateStatus(app.id, e.target.value)} style={styles.select}>
                                        <option value="pending">⏳ Pending</option><option value="reviewed">👀 Reviewed</option>
                                        <option value="shortlisted">⭐ Shortlisted</option><option value="rejected">❌ Rejected</option>
                                    </select>
                                </td>
                                <td style={styles.td}>
                                    <button onClick={() => setSelectedApp(app)} style={styles.viewBtn}>👁️ View</button>
                                </td>
                            </tr>
                        ))}
                        {applications.length === 0 && !loading && (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>No applications received yet.</td></tr>
                        )}
                        {loading && (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Application Detail Modal */}
            {selectedApp && (
                <div style={styles.modal} onClick={() => setSelectedApp(null)}>
                    <div style={{...styles.modalContent, maxWidth: '600px'}} onClick={e => e.stopPropagation()}>
                        <h3>📄 Application Details</h3>
                        <div style={{ marginBottom: '15px' }}>
                            <p><strong>Name:</strong> {selectedApp.name}</p>
                            <p><strong>Email:</strong> {selectedApp.email}</p>
                            <p><strong>Phone:</strong> {selectedApp.phone || 'N/A'}</p>
                            <p><strong>Applied for:</strong> {selectedApp.job_title}</p>
                            <p><strong>Experience:</strong> {selectedApp.experience || 'N/A'} years</p>
                            <p><strong>Current Company:</strong> {selectedApp.current_company || 'N/A'}</p>
                            <p><strong>Current CTC:</strong> {selectedApp.current_ctc || 'N/A'}</p>
                            <p><strong>Notice Period:</strong> {selectedApp.notice_period || 'N/A'}</p>
                            <p><strong>Applied on:</strong> {new Date(selectedApp.applied_at).toLocaleString()}</p>
                            <p><strong>Cover Letter:</strong></p>
                            <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px', marginTop: '5px' }}>
                                {selectedApp.cover_letter || 'No cover letter provided'}
                            </div>
                            {selectedApp.resume_url && (
                                <a href={selectedApp.resume_url} target="_blank" rel="noopener noreferrer" style={styles.link}>
                                    📄 Download Resume
                                </a>
                            )}
                        </div>
                        <button onClick={() => setSelectedApp(null)} style={styles.closeModalBtn}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================
// QUOTES MANAGER COMPONENT
// ============================================
const QuotesManager = ({ token }) => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => { loadQuotes(); }, []);

    const loadQuotes = async () => {
        setLoading(true);
        const res = await getQuotes(token);
        if (res.success) setQuotes(res.quotes);
        setLoading(false);
    };

    return (
        <div style={styles.card}>
            <div style={styles.cardHeader}>
                <h2>📧 Quote Requests</h2>
                <button onClick={loadQuotes} style={styles.refreshBtn}>🔄 Refresh</button>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.tableHeader}>
                            <th style={styles.th}>Name</th><th style={styles.th}>Email</th>
                            <th style={styles.th}>Phone</th><th style={styles.th}>Service</th>
                            <th style={styles.th}>Date</th><th style={styles.th}>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quotes.map(quote => (
                            <tr key={quote.id} style={styles.tableRow}>
                                <td style={styles.td}><strong>{quote.name}</strong></td>
                                <td style={styles.td}>{quote.email}</td>
                                <td style={styles.td}>{quote.phone || 'N/A'}</td>
                                <td style={styles.td}>{quote.service || 'N/A'}</td>
                                <td style={styles.td}>{new Date(quote.created_at).toLocaleDateString()}</td>
                                <td style={styles.td}><div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{quote.message?.substring(0, 50)}...</div></td>
                            </tr>
                        ))}
                        {quotes.length === 0 && !loading && (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>No quote requests yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ============================================
// USER MANAGER COMPONENT (Super Admin Only)
// ============================================
const UserManager = ({ token, isSuperAdmin }) => {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'admin' });
    const [loading, setLoading] = useState(false);

    useEffect(() => { if (isSuperAdmin) loadUsers(); }, [isSuperAdmin]);

    const loadUsers = async () => {
        const res = await getUsers(token);
        if (res.success) setUsers(res.users);
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        await createUser(newUser, token);
        await loadUsers();
        setShowForm(false);
        setNewUser({ username: '', password: '', role: 'admin' });
        setLoading(false);
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Delete this user permanently?')) {
            await deleteUser(id, token);
            await loadUsers();
        }
    };

    if (!isSuperAdmin) return null;

    return (
        <div style={styles.card}>
            <div style={styles.cardHeader}>
                <h2>👥 User Management (Super Admin)</h2>
                <button onClick={() => setShowForm(true)} style={styles.addButton}>+ Add Admin</button>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                    <thead><tr style={styles.tableHeader}><th style={styles.th}>Username</th><th style={styles.th}>Role</th><th style={styles.th}>Created</th><th style={styles.th}>Actions</th></tr></thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={styles.tableRow}>
                                <td style={styles.td}><strong>{user.username}</strong></td>
                                <td style={styles.td}>
                                    <span style={{
                                        ...styles.statusBadge,
                                        background: user.role === 'super_admin' ? '#ffeaa7' : '#d4edda',
                                        color: user.role === 'super_admin' ? '#856404' : '#155724'
                                    }}>{user.role}</span>
                                </td>
                                <td style={styles.td}>{new Date(user.created_at).toLocaleDateString()}</td>
                                <td style={styles.td}>
                                    {user.role !== 'super_admin' && (
                                        <button onClick={() => handleDeleteUser(user.id)} style={styles.deleteBtn}>🗑️ Delete</button>
                                    )}
                                    {user.role === 'super_admin' && <span style={{ color: '#888', fontSize: '12px' }}>Can't delete</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <div style={styles.modal} onClick={() => setShowForm(false)}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h3>➕ Add New Admin User</h3>
                        <form onSubmit={handleCreateUser}>
                            <input type="text" placeholder="Username*" value={newUser.username} 
                                onChange={e => setNewUser({...newUser, username: e.target.value})} style={styles.input} required />
                            <input type="password" placeholder="Password*" value={newUser.password} 
                                onChange={e => setNewUser({...newUser, password: e.target.value})} style={styles.input} required />
                            <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} style={styles.input}>
                                <option value="admin">Admin</option><option value="super_admin">Super Admin</option>
                            </select>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button type="submit" disabled={loading} style={styles.saveBtn}>{loading ? 'Creating...' : 'Create User'}</button>
                                <button type="button" onClick={() => setShowForm(false)} style={styles.cancelBtn}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================
// PROFILE SETTINGS COMPONENT
// ============================================
const ProfileSettings = ({ username, onLogout }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);

    const handleUpdateUsername = async (e) => {
        e.preventDefault();
        if (!newUsername) { setMessage({ text: 'Please enter a new username', type: 'error' }); return; }
        setLoading(true);
        try {
            const config = getAuthConfig();
            const res = await axios.post(`${API_BASE_URL}/admin/change-username`, {
                username, newUsername, password: currentPassword
            }, config);
            if (res.data.success) {
                setMessage({ text: 'Username changed! Please login again.', type: 'success' });
                setTimeout(() => { sessionStorage.clear(); onLogout(); }, 2000);
            }
        } catch (err) {
            setMessage({ text: err.response?.data?.error || 'Failed', type: 'error' });
        }
        setLoading(false);
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) { setMessage({ text: 'Passwords do not match', type: 'error' }); return; }
        setLoading(true);
        try {
            const config = getAuthConfig();
            const res = await axios.post(`${API_BASE_URL}/admin/change-password`, {
                username, oldPassword: currentPassword, newPassword
            }, config);
            if (res.data.success) {
                setMessage({ text: 'Password changed! Please login again.', type: 'success' });
                setTimeout(() => { sessionStorage.clear(); onLogout(); }, 2000);
            }
        } catch (err) {
            setMessage({ text: err.response?.data?.error || 'Failed', type: 'error' });
        }
        setLoading(false);
    };

    return (
        <div style={styles.card}>
            <h2>👤 Admin Profile Settings</h2>
            {message.text && <div style={{...styles.message, background: message.type === 'success' ? '#d4edda' : '#f8d7da', color: message.type === 'success' ? '#155724' : '#721c24'}}>{message.text}</div>}
            <div style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
                <p><strong>Current Username:</strong> {username}</p>
            </div>
            <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
                <h3>Change Username</h3>
                <form onSubmit={handleUpdateUsername}>
                    <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} style={styles.input} required />
                    <input type="text" placeholder="New Username" value={newUsername} onChange={e => setNewUsername(e.target.value)} style={styles.input} required />
                    <button type="submit" disabled={loading} style={styles.saveBtn}>{loading ? 'Updating...' : 'Update Username'}</button>
                </form>
            </div>
            <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
                <h3>Change Password</h3>
                <form onSubmit={handleUpdatePassword}>
                    <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} style={styles.input} required />
                    <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={styles.input} required />
                    <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={styles.input} required />
                    <button type="submit" disabled={loading} style={styles.saveBtn}>{loading ? 'Updating...' : 'Update Password'}</button>
                </form>
            </div>
        </div>
    );
};

// ============================================
// MAIN ADMIN PAGE
// ============================================
const AdminPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [adminUsername, setAdminUsername] = useState('');
    const [adminRole, setAdminRole] = useState('');
    const [stats, setStats] = useState({});
    const [token, setToken] = useState('');

    useEffect(() => {
        const storedToken = sessionStorage.getItem('adminToken');
        const username = sessionStorage.getItem('adminUsername');
        const role = sessionStorage.getItem('adminRole');
        if (storedToken && username) {
            setToken(storedToken);
            setAdminUsername(username);
            setAdminRole(role);
            setIsLoggedIn(true);
        }
        setLoading(false);
    }, []);

    const handleLogin = (username, role) => {
        setAdminUsername(username);
        setAdminRole(role);
        setToken(sessionStorage.getItem('adminToken'));
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        sessionStorage.clear();
        setIsLoggedIn(false);
        setAdminUsername('');
        setAdminRole('');
        setToken('');
    };

    useEffect(() => {
        if (isLoggedIn && activeTab === 'dashboard') loadStats();
    }, [isLoggedIn, activeTab]);

    const loadStats = async () => {
        const res = await getAdminStats(token);
        if (res.success) setStats(res.stats);
    };

    const isSuperAdmin = adminRole === 'super_admin';

    // Tab configuration
    const tabs = [
        { id: 'dashboard', label: '📊 Dashboard', icon: '📊', adminOnly: false },
        { id: 'blogs', label: '📝 Blogs', icon: '📝', adminOnly: false },
        { id: 'jobs', label: '💼 Careers', icon: '💼', adminOnly: false },
        { id: 'applications', label: '📋 Applications', icon: '📋', adminOnly: false },
        { id: 'quotes', label: '📧 Quotes', icon: '📧', adminOnly: false },
        { id: 'socialLinks', label: '🔗 Social Links', icon: '🔗', adminOnly: false },
        { id: 'profile', label: '👤 Profile', icon: '👤', adminOnly: false },
    ];
    
    if (isSuperAdmin) tabs.push({ id: 'users', label: '👥 Users', icon: '👥', adminOnly: true });

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
    if (!isLoggedIn) return <AdminLogin onLogin={handleLogin} />;

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <div style={styles.sidebar}>
                <div style={styles.sidebarHeader}>
                    <h2>⚡ Winze Admin</h2>
                    <p style={{ fontSize: '12px', color: '#aaa' }}>{adminUsername} ({adminRole})</p>
                </div>
                <nav>
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                            ...styles.navBtn, background: activeTab === tab.id ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent'
                        }}>
                            {tab.label}
                        </button>
                    ))}
                    <button onClick={handleLogout} style={{...styles.navBtn, marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', color: '#ff6b6b'}}>
                        🚪 Logout
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div style={styles.mainContent}>
                {activeTab === 'dashboard' && (
                    <div>
                        <h1 style={{ marginBottom: '20px' }}>Dashboard</h1>
                        <div style={styles.statsGrid}>
                            <div style={styles.statCard}><div>📝</div><h3>{stats.totalBlogs || 0}</h3><p>Total Blogs</p></div>
                            <div style={styles.statCard}><div>✅</div><h3>{stats.publishedBlogs || 0}</h3><p>Published</p></div>
                            <div style={styles.statCard}><div>💼</div><h3>{stats.totalJobs || 0}</h3><p>Total Jobs</p></div>
                            <div style={styles.statCard}><div>🔴</div><h3>{stats.activeJobs || 0}</h3><p>Active Jobs</p></div>
                            <div style={styles.statCard}><div>📋</div><h3>{stats.totalApplications || 0}</h3><p>Applications</p></div>
                            <div style={styles.statCard}><div>📧</div><h3>{stats.totalQuotes || 0}</h3><p>Quotes</p></div>
                            <div style={styles.statCard}><div>📈</div><h3>{stats.totalClicks || 0}</h3><p>Clicks</p></div>
                        </div>
                    </div>
                )}
                {activeTab === 'blogs' && <BlogManager token={token} />}
                {activeTab === 'jobs' && <JobManager token={token} />}
                {activeTab === 'applications' && <ApplicationsManager token={token} />}
                {activeTab === 'quotes' && <QuotesManager token={token} />}
                {activeTab === 'socialLinks' && <AdminSocialLinks token={token} />}
                {activeTab === 'profile' && <ProfileSettings username={adminUsername} onLogout={handleLogout} />}
                {activeTab === 'users' && isSuperAdmin && <UserManager token={token} isSuperAdmin={isSuperAdmin} />}
            </div>
        </div>
    );
};

// ============================================
// STYLES
// ============================================
const styles = {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', padding: '20px' },
    card: { background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '20px' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' },
    sidebar: { width: '260px', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: 'white', padding: '20px 0', position: 'fixed', height: '100vh', overflowY: 'auto' },
    sidebarHeader: { padding: '0 20px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' },
    navBtn: { width: '100%', padding: '12px 20px', border: 'none', color: 'white', textAlign: 'left', cursor: 'pointer', fontSize: '15px', background: 'transparent' },
    mainContent: { marginLeft: '260px', flex: 1, padding: '30px', background: '#f5f6fa', minHeight: '100vh' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '30px' },
    statCard: { background: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
    addButton: { padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    refreshBtn: { padding: '10px 20px', background: '#48c774', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    editBtn: { padding: '6px 12px', background: '#4facfe', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' },
    deleteBtn: { padding: '6px 12px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    viewBtn: { padding: '6px 12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    saveBtn: { padding: '12px 24px', background: '#48c774', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    cancelBtn: { padding: '12px 24px', background: '#ccc', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    closeModalBtn: { marginTop: '15px', padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHeader: { background: '#f5f5f5' },
    tableRow: { borderBottom: '1px solid #eee' },
    th: { padding: '12px', textAlign: 'left' },
    td: { padding: '12px' },
    input: { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'monospace' },
    select: { padding: '8px', borderRadius: '6px', border: '1px solid #ddd', background: 'white' },
    badge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', background: '#e8f4fd', color: '#2196f3' },
    statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px' },
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflow: 'auto' },
    modalContent: { background: 'white', borderRadius: '15px', padding: '30px', maxWidth: '700px', width: '100%', maxHeight: '85vh', overflow: 'auto' },
    link: { display: 'inline-block', marginTop: '10px', color: '#667eea', textDecoration: 'none' },
    message: { padding: '12px', marginBottom: '20px', borderRadius: '8px', textAlign: 'center' },
    iconContainer: { width: '70px', height: '70px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' },
    icon: { fontSize: '35px' },
    title: { color: 'white', marginBottom: '10px', fontSize: '28px' },
    subtitle: { color: 'rgba(255,255,255,0.7)', marginBottom: '30px', fontSize: '14px' },
    button: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' },
    error: { color: '#ff6b6b', marginBottom: '15px', padding: '10px', background: 'rgba(255,107,107,0.1)', borderRadius: '8px', fontSize: '14px', textAlign: 'center' },
};

export default AdminPage;