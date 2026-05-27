import React, { useState, useEffect } from 'react';
import { getBlogs } from '../services/api';
import SEO from '../components/SEO';

const BlogsPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = async () => {
        try {
            const response = await getBlogs();
            if (response.success) {
                setBlogs(response.blogs);
            }
        } catch (error) {
            console.error('Error loading blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                background: '#0a0a1a', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
            }}>
                <div style={{ color: '#FFD700', fontSize: '1.2rem' }}>Loading blogs...</div>
            </div>
        );
    }

    return (
        <>
            <SEO title="Blogs | Winze Technologies" />
            <div style={{ 
                maxWidth: '1200px', 
                margin: '0 auto', 
                padding: '60px 20px',
                minHeight: '100vh',
                background: '#0a0a1a'
            }}>
                <h1 style={{ 
                    textAlign: 'center', 
                    marginBottom: '40px',
                    fontSize: '3rem',
                    color: 'white',
                    fontFamily: "'Playfair Display', serif",
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>Our Blogs</h1>
                
                {blogs.length === 0 ? (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '80px 20px',
                        color: '#aaa',
                        fontSize: '1.1rem'
                    }}>
                        No blogs published yet. Please check back later.
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
                        {blogs.map(blog => (
                            <div key={blog.id} style={{ 
                                background: 'linear-gradient(145deg, #1a0b2e, #2d1b4e)',
                                borderRadius: '20px', 
                                overflow: 'hidden',
                                border: '1px solid rgba(255,215,0,0.2)',
                                transition: 'transform 0.3s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                            onClick={() => window.location.href = `/blog/${blog.slug}`}
                            >
                                {/* NO IMAGE - TEXT ONLY */}
                                <div style={{ padding: '25px' }}>
                                    <h2 style={{ 
                                        fontSize: '1.3rem', 
                                        marginBottom: '15px',
                                        color: '#FFD700',
                                        fontFamily: "'Playfair Display', serif"
                                    }}>{blog.title}</h2>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px', lineHeight: '1.6' }}>
                                        {blog.excerpt ? blog.excerpt.substring(0, 150) + '...' : 'No excerpt available'}
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                                            By {blog.author || 'Admin'} | {new Date(blog.created_at).toLocaleDateString()}
                                        </span>
                                        <span style={{ color: '#FFD700', fontSize: '14px' }}>Read More →</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default BlogsPage;