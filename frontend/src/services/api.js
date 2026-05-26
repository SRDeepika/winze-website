import axios from 'axios';

const API_BASE_URL = 'https://winze-backend-api.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token interceptor
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ========== AUTH APIs ==========
export const adminLogin = async (username, password) => {
  try {
    const response = await api.post('/admin/login', { username, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// ========== BLOG APIs ==========
export const getBlogs = async () => {
  try {
    const response = await api.get('/blogs');
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

export const getBlogBySlug = async (slug) => {
  try {
    const response = await api.get(`/blogs/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching blog:', error);
    throw error;
  }
};

export const getAdminBlogs = async () => {
  try {
    const response = await api.get('/admin/blogs');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin blogs:', error);
    throw error;
  }
};

export const createBlog = async (blogData) => {
  try {
    const response = await api.post('/admin/blogs', blogData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

export const updateBlog = async (id, blogData) => {
  try {
    const response = await api.put(`/admin/blogs/${id}`, blogData);
    return response.data;
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

export const deleteBlog = async (id) => {
  try {
    const response = await api.delete(`/admin/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};

// ========== JOB APIs ==========
export const getJobs = async () => {
  try {
    const response = await api.get('/jobs');
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

export const getJobById = async (id) => {
  try {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job:', error);
    throw error;
  }
};

export const getAdminJobs = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/jobs`, getAuthConfig());
        console.log('Raw API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('API error:', error);
        return { success: false, jobs: [] };
    }
};

export const createJob = async (jobData) => {
  try {
    const response = await api.post('/admin/jobs', jobData);
    return response.data;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

export const updateJob = async (id, jobData) => {
  try {
    const response = await api.put(`/admin/jobs/${id}`, jobData);
    return response.data;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

export const deleteJob = async (id) => {
  try {
    const response = await api.delete(`/admin/jobs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

// ========== APPLICATION APIs ==========
export const applyForJob = async (jobId, applicationData) => {
  const formData = new FormData();
  Object.keys(applicationData).forEach(key => {
    if (applicationData[key] !== undefined && applicationData[key] !== null) {
      formData.append(key, applicationData[key]);
    }
  });
  
  try {
    const response = await api.post(`/jobs/${jobId}/apply`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error applying for job:', error);
    throw error;
  }
};

export const getApplications = async () => {
  try {
    const response = await api.get('/admin/applications');
    return response.data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

export const updateApplicationStatus = async (id, status) => {
  try {
    const response = await api.put(`/admin/applications/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating application:', error);
    throw error;
  }
};

// ========== QUOTE APIs ==========
export const submitQuote = async (quoteData) => {
  try {
    const response = await api.post('/quotes', quoteData);
    return response.data;
  } catch (error) {
    console.error('Error submitting quote:', error);
    throw error;
  }
};

export const getQuotes = async () => {
  try {
    const response = await api.get('/admin/quotes');
    return response.data;
  } catch (error) {
    console.error('Error fetching quotes:', error);
    throw error;
  }
};

export const deleteQuote = async (id) => {
  try {
    const response = await api.delete(`/admin/quotes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting quote:', error);
    throw error;
  }
};

// ========== ADMIN STATS ==========
export const getAdminStats = async () => {
  try {
    const response = await api.get('/admin/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

// ========== USER MANAGEMENT APIs ==========
export const getUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post('/admin/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// ========== SOCIAL LINKS APIs ==========
export const getSocialLinks = async () => {
  try {
    const response = await api.get('/social-links');
    return response.data;
  } catch (error) {
    console.error('Error fetching social links:', error);
    throw error;
  }
};

export const getAdminSocialLinks = async () => {
  try {
    const response = await api.get('/admin/social-links');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin social links:', error);
    throw error;
  }
};

export const createSocialLink = async (linkData) => {
  try {
    const response = await api.post('/admin/social-links', linkData);
    return response.data;
  } catch (error) {
    console.error('Error creating social link:', error);
    throw error;
  }
};

export const updateSocialLink = async (id, linkData) => {
  try {
    const response = await api.put(`/admin/social-links/${id}`, linkData);
    return response.data;
  } catch (error) {
    console.error('Error updating social link:', error);
    throw error;
  }
};

export const deleteSocialLink = async (id) => {
  try {
    const response = await api.delete(`/admin/social-links/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting social link:', error);
    throw error;
  }
};

// ========== CLICK APIs ==========
export const trackClick = async (clickData) => {
  try {
    const response = await api.post('/track', clickData);
    return response.data;
  } catch (error) {
    console.error('Error tracking click:', error);
    throw error;
  }
};

export const getAllClicks = async () => {
  try {
    const response = await api.get('/clicks');
    return response.data;
  } catch (error) {
    console.error('Error fetching clicks:', error);
    throw error;
  }
};

// ========== HEALTH CHECK ==========
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

// ========== PROFILE APIs ==========
export const changeUsername = async (newUsername, password) => {
  try {
    const response = await api.post('/admin/change-username', { 
      newUsername: newUsername, 
      password: password 
    });
    return response.data;
  } catch (error) {
    console.error('Error changing username:', error);
    throw error;
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await api.post('/admin/change-password', { 
      oldPassword: oldPassword, 
      newPassword: newPassword 
    });
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};