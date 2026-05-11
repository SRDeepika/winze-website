import React, { useState, useEffect } from 'react';
import { getBlogs } from '../services/api';

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
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>Expert perspectives on technology trends</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '30px' }}>
                    {blogs.map(blog => (
                        <div key={blog.id} style={{
                            background: 'white',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            cursor: 'pointer'
                        }}
                        onClick={() => setSelectedBlog(blog)}>
                            {blog.image && <img src={blog.image} alt={blog.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />}
                            <div style={{ padding: '25px' }}>
                                <h3>{blog.title}</h3>
                                <p>{blog.excerpt}</p>
                                <button style={{ background: '#667eea', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px' }}>Read More</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogsSection;