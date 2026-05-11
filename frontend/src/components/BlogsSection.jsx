import React, { useState, useEffect } from 'react';
import { getBlogs } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faUser, faClock, faEye } from '@fortawesome/free-solid-svg-icons';

const BlogsSection = () => {
    const [blogs, setBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = async () => {
        try {
            const response = await getBlogs();
            if (response.success) {
                setBlogs(response.blogs.slice(0, 6));
            }
        } catch (error) {
            console.error('Error loading blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || blogs.length === 0) return null;

    return (
        <section style={{
            padding: '100px 5%',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '3rem', color: '#1a1a2e', marginBottom: '15px' }}>Latest Insights</h2>
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>Expert perspectives on technology trends and innovations</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '30px' }}>
                    {blogs.map(blog => (
                        <div key={blog.id} style={{
                            background: 'white',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-10px)';
                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                        }}
                        onClick={() => setSelectedBlog(blog)}>
                            {blog.image && (
                                <img src={blog.image} alt={blog.title} style={{
                                    width: '100%',
                                    height: '220px',
                                    objectFit: 'cover'
                                }} />
                            )}
                            <div style={{ padding: '25px' }}>
                                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', fontSize: '13px', color: '#888' }}>
                                    <span><FontAwesomeIcon icon={faCalendar} /> {new Date(blog.created_at).toLocaleDateString()}</span>
                                    <span><FontAwesomeIcon icon={faUser} /> {blog.author || 'Winze Tech'}</span>
                                    <span><FontAwesomeIcon icon={faClock} /> {blog.read_time || 5} min read</span>
                                    <span><FontAwesomeIcon icon={faEye} /> {blog.views || 0} views</span>
                                </div>
                                <h3 style={{ fontSize: '1.3rem', color: '#1a1a2e', marginBottom: '12px' }}>{blog.title}</h3>
                                <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '20px' }}>{blog.excerpt}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ background: '#667eea', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: 'white' }}>{blog.category}</span>
                                    <span style={{ color: '#667eea', fontWeight: '600' }}>Read More →</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Blog Detail Modal */}
            {selectedBlog && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.95)',
                    zIndex: 10000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'auto',
                    padding: '20px'
                }} onClick={() => setSelectedBlog(null)}>
                    <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        maxWidth: '900px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        position: 'relative'
                    }} onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setSelectedBlog(null)} style={{
                            position: 'sticky',
                            top: '20px',
                            right: '20px',
                            float: 'right',
                            background: '#667eea',
                            color: 'white',
                            border: 'none',
                            width: '35px',
                            height: '35px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            marginTop: '20px',
                            marginRight: '20px',
                            zIndex: 10
                        }}>×</button>
                        
                        <div style={{ padding: '40px' }}>
                            {selectedBlog.image && (
                                <img src={selectedBlog.image} alt={selectedBlog.title} style={{
                                    width: '100%',
                                    height: '400px',
                                    objectFit: 'cover',
                                    borderRadius: '15px',
                                    marginBottom: '30px'
                                }} />
                            )}
                            <h1 style={{ fontSize: '2.5rem', color: '#1a1a2e', marginBottom: '20px' }}>{selectedBlog.title}</h1>
                            <div dangerouslySetInnerHTML={{ __html: selectedBlog.content }} />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default BlogsSection;