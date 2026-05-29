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
                background: 'radial-gradient(circle at 10% 20%, rgba(98, 0, 234, 0.28) 0%, transparent 65%), radial-gradient(circle at 90% 80%, rgba(0, 229, 255, 0.24) 0%, #03010b 100%)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
            }}>
                <div style={{ color: '#00E5FF', fontSize: '1.2rem', fontWeight: '600' }}>Loading blogs...</div>
            </div>
        );
    }

    return (
        <>
            <SEO title="Blogs | Winze Technologies" />
            <div style={{ 
                minHeight: '100vh',
                background: 'radial-gradient(circle at 10% 20%, rgba(98, 0, 234, 0.28) 0%, transparent 65%), radial-gradient(circle at 90% 80%, rgba(0, 229, 255, 0.24) 0%, #03010b 100%)',
                padding: '60px 5%'
            }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    {/* Back to Home CTA */}
                    <button 
                        onClick={() => window.location.href = '/'}
                        style={{
                            background: 'rgba(0, 229, 255, 0.08)',
                            color: '#00E5FF',
                            border: '1px solid rgba(0, 229, 255, 0.3)',
                            padding: '12px 28px',
                            borderRadius: '50px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            marginBottom: '45px',
                            transition: 'all 0.3s ease',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(0, 229, 255, 0.18)';
                            e.target.style.boxShadow = '0 0 15px rgba(0, 229, 255, 0.35)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(0, 229, 255, 0.08)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        ← Back to Home
                    </button>

                    <h1 style={{ 
                        textAlign: 'center', 
                        marginBottom: '60px',
                        fontSize: '3.5rem',
                        fontWeight: '800',
                        color: 'white',
                        fontFamily: "'Playfair Display', serif",
                        background: 'linear-gradient(135deg, #E0F7FA 0%, #00E5FF 45%, #7C4DFF 75%, #00B0FF 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 2px 10px rgba(0, 229, 255, 0.15))'
                    }}>Our Blogs</h1>
                    
                    {blogs.length === 0 ? (
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '80px 20px',
                            color: '#aaa',
                            fontSize: '1.1rem',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: '20px',
                            border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}>
                            No blogs published yet. Please check back later.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
                            {blogs.map(blog => (
                                <article key={blog.id} style={{ 
                                    background: 'rgba(10, 5, 25, 0.45)',
                                    backdropFilter: 'blur(25px)',
                                    WebkitBackdropFilter: 'blur(25px)',
                                    borderRadius: '24px', 
                                    overflow: 'hidden',
                                    border: '1px solid rgba(0, 229, 255, 0.15)',
                                    boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
                                    transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                                    padding: '45px'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.4)';
                                    e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.6), 0 0 25px rgba(168,85,247,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.15)';
                                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.4)';
                                }}
                                >
                                    <h2 style={{ 
                                        fontSize: '2.2rem', 
                                        marginBottom: '15px',
                                        color: '#00E5FF',
                                        fontFamily: "'Playfair Display', serif",
                                        lineHeight: '1.3',
                                        fontWeight: '700'
                                    }}>{blog.title}</h2>
                                    
                                    <div style={{ 
                                        color: 'rgba(255,255,255,0.45)', 
                                        fontSize: '13px',
                                        marginBottom: '30px',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                                        paddingBottom: '15px',
                                        display: 'flex',
                                        gap: '15px',
                                        fontWeight: '500'
                                    }}>
                                        <span>By {blog.author || 'Admin'}</span>
                                        <span>•</span>
                                        <span>{new Date(blog.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>

                                    {/* Full Article Content */}
                                    <div 
                                        style={{ 
                                            color: 'rgba(255,255,255,0.85)', 
                                            lineHeight: '1.85', 
                                            fontSize: '1.15rem'
                                        }} 
                                        dangerouslySetInnerHTML={{ __html: blog.content }} 
                                    />
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default BlogsPage;