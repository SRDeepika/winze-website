import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/social-links';

const AdminSocialLinks = () => {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        platform_name: '',
        platform_url: '',
        icon_class: 'faLinkedin',
        color_code: '#0077b5',
        display_order: 0,
        is_active: 1
    });
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        loadLinks();
    }, []);

    const loadLinks = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL);
            setLinks(response.data);
        } catch (error) {
            console.error('Error loading links:', error);
            setMessage({ text: 'Failed to load social links', type: 'error' });
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${API_URL}/${editingId}`, formData);
                setMessage({ text: 'Link updated successfully!', type: 'success' });
                setEditingId(null);
            } else {
                await axios.post(API_URL, formData);
                setMessage({ text: 'Link added successfully!', type: 'success' });
            }
            setFormData({
                platform_name: '',
                platform_url: '',
                icon_class: 'faLinkedin',
                color_code: '#0077b5',
                display_order: 0,
                is_active: 1
            });
            loadLinks();
        } catch (error) {
            console.error('Error saving link:', error);
            setMessage({ text: 'Failed to save link', type: 'error' });
        }
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const handleEdit = (link) => {
        setEditingId(link.id);
        setFormData({
            platform_name: link.platform_name,
            platform_url: link.platform_url,
            icon_class: link.icon_class,
            color_code: link.color_code,
            display_order: link.display_order,
            is_active: link.is_active
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this social link?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                setMessage({ text: 'Link deleted successfully!', type: 'success' });
                loadLinks();
            } catch (error) {
                console.error('Error deleting link:', error);
                setMessage({ text: 'Failed to delete link', type: 'error' });
            }
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({
            platform_name: '',
            platform_url: '',
            icon_class: 'faLinkedin',
            color_code: '#0077b5',
            display_order: 0,
            is_active: 1
        });
    };

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading social links...</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '10px', color: '#1a1a2e' }}>Social Media Links Management</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
                Add, edit, or remove social media links that appear on the website.
            </p>

            {/* Message Display */}
            {message.text && (
                <div style={{
                    padding: '10px 15px',
                    borderRadius: '5px',
                    marginBottom: '20px',
                    background: message.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: message.type === 'success' ? '#155724' : '#721c24',
                    border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                }}>
                    {message.text}
                </div>
            )}

            {/* Add/Edit Form */}
            <div style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '30px',
                border: '1px solid #ddd'
            }}>
                <h3 style={{ marginBottom: '15px', color: '#1a1a2e' }}>
                    {editingId ? 'Edit Social Link' : 'Add New Social Link'}
                </h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <input
                        type="text"
                        placeholder="Platform Name (e.g., LinkedIn)"
                        value={formData.platform_name}
                        onChange={(e) => setFormData({ ...formData, platform_name: e.target.value })}
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                        required
                    />
                    <input
                        type="url"
                        placeholder="Platform URL (e.g., https://linkedin.com/company/...)"
                        value={formData.platform_url}
                        onChange={(e) => setFormData({ ...formData, platform_url: e.target.value })}
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                        required
                    />
                    <select
                        value={formData.icon_class}
                        onChange={(e) => setFormData({ ...formData, icon_class: e.target.value })}
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                        <option value="faLinkedin">LinkedIn</option>
                        <option value="faWhatsapp">WhatsApp</option>
                        <option value="faFacebook">Facebook</option>
                        <option value="faInstagram">Instagram</option>
                        <option value="faTwitter">Twitter (X)</option>
                        <option value="faYoutube">YouTube</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Color Code (e.g., #0077b5)"
                        value={formData.color_code}
                        onChange={(e) => setFormData({ ...formData, color_code: e.target.value })}
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Display Order (0, 1, 2...)"
                        value={formData.display_order}
                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                            type="checkbox"
                            checked={formData.is_active === 1}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                        />
                        Active (show on website)
                    </label>
                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
                        <button type="submit" style={{
                            padding: '10px 20px',
                            background: '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}>
                            {editingId ? 'Update Link' : 'Add Link'}
                        </button>
                        {editingId && (
                            <button type="button" onClick={handleCancel} style={{
                                padding: '10px 20px',
                                background: '#666',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Links List Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #ddd' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Platform</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>URL</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Icon</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Order</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {links.map((link) => (
                        <tr key={link.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '12px' }}>
                                <strong>{link.platform_name}</strong>
                                <br />
                                <span style={{ fontSize: '12px', color: '#666' }}>{link.icon_class}</span>
                            </td>
                            <td style={{ padding: '12px' }}>
                                <a href={link.platform_url} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>
                                    {link.platform_url.substring(0, 40)}...
                                </a>
                            </td>
                            <td style={{ padding: '12px' }}>
                                <span style={{
                                    display: 'inline-block',
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    background: link.color_code,
                                    color: 'white',
                                    textAlign: 'center',
                                    lineHeight: '30px',
                                    fontSize: '12px'
                                }}>
                                    {link.icon_class.replace('fa', '')}
                                </span>
                            </td>
                            <td style={{ padding: '12px' }}>{link.display_order}</td>
                            <td style={{ padding: '12px' }}>
                                <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    background: link.is_active ? '#4caf50' : '#dc3545',
                                    color: 'white',
                                    fontSize: '12px'
                                }}>
                                    {link.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td style={{ padding: '12px' }}>
                                <button
                                    onClick={() => handleEdit(link)}
                                    style={{
                                        marginRight: '8px',
                                        padding: '5px 10px',
                                        cursor: 'pointer',
                                        background: '#667eea',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px'
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(link.id)}
                                    style={{
                                        padding: '5px 10px',
                                        cursor: 'pointer',
                                        background: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px'
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {links.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    No social media links added yet. Use the form above to add your first link.
                </div>
            )}
        </div>
    );
};

export default AdminSocialLinks;