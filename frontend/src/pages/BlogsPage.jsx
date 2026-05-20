import React, { useState, useEffect } from 'react';
import { getBlogs } from '../services/api';

const BlogsPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = async () => {
        try {
            const res = await getBlogs();
            if (res.success) {
                setBlogs(res.blogs);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;

    return (
        <div style={{ padding: '100px 5%', maxWidth: '1200px', margin: '0 auto', background: '#f5f6fa', minHeight: '100vh' }}>
            <h1 style={{ textAlign: 'center', fontSize: '2.5rem', color: '#1a1a2e' }}>Our Blogs</h1>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '50px' }}>Insights and updates from Winze Technologies</p>
            
            {blogs.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No blogs yet.</p>
            ) : (
                <div style={{ display: 'grid', gap: '30px' }}>
                    {blogs.map(blog => (
                        <div key={blog.id} style={{ background: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                            <h2 style={{ color: '#1a1a2e', marginBottom: '10px' }}>{blog.title}</h2>
                            <div style={{ color: '#999', fontSize: '12px', marginBottom: '15px' }}>
                                {blog.category} | {new Date(blog.created_at).toLocaleDateString()} | By {blog.author || 'Winze Team'}
                            </div>
                            {/* FULL CONTENT DISPLAYED HERE */}
                            <div style={{ color: '#333', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: blog.content || blog.excerpt || 'No content' }} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BlogsPage;