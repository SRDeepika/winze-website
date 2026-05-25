import React, { useState, useEffect } from 'react';
import { getAdminSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink } from '../services/api';

const AdminSocialLinks = () => {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingLink, setEditingLink] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        platform_name: '',
        platform_url: '',
        icon_class: '',
        color_code: '',
        display_order: 0,
        is_active: 1
    });

    useEffect(() => {
        loadLinks();
    }, []);

    const loadLinks = async () => {
        try {
            setLoading(true);
            const response = await getAdminSocialLinks();
            if (response && response.success && response.links) {
                setLinks(response.links);
            } else {
                setLinks([]);
            }
        } catch (error) {
            console.error('Error loading social links:', error);
            setLinks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingLink) {
                await updateSocialLink(editingLink.id, formData);
                alert('Social link updated successfully!');
            } else {
                await createSocialLink(formData);
                alert('Social link created successfully!');
            }
            setShowForm(false);
            setEditingLink(null);
            setFormData({
                platform_name: '',
                platform_url: '',
                icon_class: '',
                color_code: '',
                display_order: 0,
                is_active: 1
            });
            await loadLinks();
        } catch (error) {
            console.error('Error saving social link:', error);
            alert('Error: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleEdit = (link) => {
        setEditingLink(link);
        setFormData({
            platform_name: link.platform_name,
            platform_url: link.platform_url,
            icon_class: link.icon_class || '',
            color_code: link.color_code || '#000000',
            display_order: link.display_order || 0,
            is_active: link.is_active
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this social link?')) {
            try {
                await deleteSocialLink(id);
                alert('Social link deleted successfully!');
                await loadLinks();
            } catch (error) {
                console.error('Error deleting social link:', error);
                alert('Error: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    if (loading) {
        return (
            <div style={styles.dashboardCard}>
                <h2>🔗 Social Links Management</h2>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div style={styles.dashboardCard}>
            <div style={styles.cardHeader}>
                <h2>🔗 Social Links Management</h2>
                <button onClick={() => setShowForm(true)} style={styles.addButton}>+ Add Social Link</button>
            </div>

            {!links || links.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '40px' }}>No social links found. Click "Add Social Link" to create one.</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>Platform</th>
                                <th style={styles.th}>URL</th>
                                <th style={styles.th}>Icon Class</th>
                                <th style={styles.th}>Color</th>
                                <th style={styles.th}>Order</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Created At</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {links.map((link) => (
                                <tr key={link.id}>
                                    <td style={styles.td}>{link.id}</td>
                                    <td style={styles.td}>{link.platform_name}</td>
                                    <td style={styles.td}>
                                        <a href={link.platform_url} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>
                                            {link.platform_url}
                                        </a>
                                    </td>
                                    <td style={styles.td}>{link.icon_class || '-'}</td>
                                    <td style={styles.td}>
                                        <span style={{ display: 'inline-block', width: '20px', height: '20px', backgroundColor: link.color_code, borderRadius: '4px' }}></span>
                                        {link.color_code}
                                    </td>
                                    <td style={styles.td}>{link.display_order}</td>
                                    <td style={styles.td}>
                                        <span style={{ ...styles.statusBadge, background: link.is_active === 1 ? '#d4edda' : '#f8d7da' }}>
                                            {link.is_active === 1 ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td style={styles.td}>{link.created_at ? new Date(link.created_at).toLocaleString() : 'N/A'}</td>
                                    <td style={styles.td}>
                                        <button onClick={() => handleEdit(link)} style={styles.editBtn}>Edit</button>
                                        <button onClick={() => handleDelete(link.id)} style={styles.deleteBtn}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showForm && (
                <div style={styles.modal} onClick={() => setShowForm(false)}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h3>{editingLink ? 'Edit Social Link' : 'Add New Social Link'}</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Platform Name (e.g., LinkedIn, WhatsApp)"
                                value={formData.platform_name}
                                onChange={e => setFormData({...formData, platform_name: e.target.value})}
                                style={styles.input}
                                required
                            />
                            <input
                                type="url"
                                placeholder="Platform URL"
                                value={formData.platform_url}
                                onChange={e => setFormData({...formData, platform_url: e.target.value})}
                                style={styles.input}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Icon Class (e.g., faLinkedin, faWhatsapp)"
                                value={formData.icon_class}
                                onChange={e => setFormData({...formData, icon_class: e.target.value})}
                                style={styles.input}
                            />
                            <input
                                type="color"
                                placeholder="Color Code"
                                value={formData.color_code}
                                onChange={e => setFormData({...formData, color_code: e.target.value})}
                                style={styles.input}
                            />
                            <input
                                type="number"
                                placeholder="Display Order"
                                value={formData.display_order}
                                onChange={e => setFormData({...formData, display_order: parseInt(e.target.value)})}
                                style={styles.input}
                            />
                            <select
                                value={formData.is_active}
                                onChange={e => setFormData({...formData, is_active: parseInt(e.target.value)})}
                                style={styles.input}
                            >
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
                            </select>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button type="submit" style={styles.saveBtn}>
                                    {editingLink ? 'Update' : 'Create'}
                                </button>
                                <button type="button" onClick={() => setShowForm(false)} style={styles.cancelBtn}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    dashboardCard: { background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '20px' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' },
    addButton: { padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    editBtn: { padding: '6px 12px', background: '#4facfe', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' },
    deleteBtn: { padding: '6px 12px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    saveBtn: { padding: '10px 20px', background: '#48c774', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    cancelBtn: { padding: '10px 20px', background: '#ccc', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    input: { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', color: '#333', fontSize: '14px', boxSizing: 'border-box' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' },
    td: { padding: '12px', borderBottom: '1px solid #eee' },
    statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px' },
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflow: 'auto' },
    modalContent: { background: 'white', borderRadius: '15px', padding: '30px', maxWidth: '500px', width: '100%' }
};

export default AdminSocialLinks;