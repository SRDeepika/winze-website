import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
            console.log('Blogs response:', res);
            if (res.success) {
                setBlogs(res.blogs);
            } else {
                console.error('Failed to load blogs:', res.error);
            }
        } catch (error) {
            console.error('Error loading blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loader}></div>
                <p>Loading blogs...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Our Blogs</h1>
                <p style={styles.subtitle}>Insights, news, and updates from Winze Technologies</p>
            </div>

            {blogs.length === 0 ? (
                <div style={styles.noBlogs}>
                    <p>No blogs published yet. Check back soon!</p>
                </div>
            ) : (
                <div style={styles.blogsGrid}>
                    {blogs.map(blog => (
                        <article key={blog.id} style={styles.blogCard}>
                            {blog.image && (
                                <img 
                                    src={blog.image} 
                                    alt={blog.title} 
                                    style={styles.blogImage}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            )}
                            <div style={styles.blogContent}>
                                <div style={styles.blogMeta}>
                                    <span style={styles.category}>{blog.category || 'General'}</span>
                                    <span style={styles.date}>
                                        {new Date(blog.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <h2 style={styles.blogTitle}>{blog.title}</h2>
                                <p style={styles.blogExcerpt}>{blog.excerpt || blog.content?.substring(0, 150)}...</p>
                                <div style={styles.blogFooter}>
                                    <span style={styles.author}>By {blog.author || 'Winze Team'}</span>
                                    <Link to={`/blog/${blog.slug}`} style={styles.readMore}>
                                        Read More →
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '100px 5% 80px',
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight: '100vh',
        background: '#f5f6fa'
    },
    header: {
        textAlign: 'center',
        marginBottom: '50px'
    },
    title: {
        fontSize: '2.5rem',
        color: '#1a1a2e',
        marginBottom: '15px',
        fontFamily: "'Playfair Display', serif"
    },
    subtitle: {
        fontSize: '1.1rem',
        color: '#666'
    },
    blogsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
        gap: '30px'
    },
    blogCard: {
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        cursor: 'pointer'
    },
    blogImage: {
        width: '100%',
        height: '200px',
        objectFit: 'cover'
    },
    blogContent: {
        padding: '20px'
    },
    blogMeta: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '12px',
        fontSize: '12px'
    },
    category: {
        background: '#667eea',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '20px'
    },
    date: {
        color: '#999'
    },
    blogTitle: {
        fontSize: '1.2rem',
        color: '#1a1a2e',
        marginBottom: '10px',
        lineHeight: '1.4'
    },
    blogExcerpt: {
        color: '#666',
        lineHeight: '1.5',
        marginBottom: '15px'
    },
    blogFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    author: {
        color: '#999',
        fontSize: '12px'
    },
    readMore: {
        color: '#667eea',
        textDecoration: 'none',
        fontWeight: '600'
    },
    noBlogs: {
        textAlign: 'center',
        padding: '60px',
        background: 'white',
        borderRadius: '16px',
        color: '#666'
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '20px'
    },
    loader: {
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #667eea',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    }
};

// Add keyframes for loader
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleSheet);

export default BlogsPage;