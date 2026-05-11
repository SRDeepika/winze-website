import axios from 'axios';

const API_BASE_URL = 'https://winze-backend-api.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========== EXISTING FUNCTIONS ==========
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

export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

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

export const getAdminBlogs = async (token) => {
  try {
    const response = await api.get('/admin/blogs', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin blogs:', error);
    throw error;
  }
};

export const createBlog = async (blogData, token) => {
  const formData = new FormData();
  Object.keys(blogData).forEach(key => {
    if (blogData[key] !== undefined && blogData[key] !== null) {
      formData.append(key, blogData[key]);
    }
  });
  
  try {
    const response = await api.post('/admin/blogs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

export const updateBlog = async (id, blogData, token) => {
  const formData = new FormData();
  Object.keys(blogData).forEach(key => {
    if (blogData[key] !== undefined && blogData[key] !== null) {
      formData.append(key, blogData[key]);
    }
  });
  
  try {
    const response = await api.put(`/admin/blogs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

export const deleteBlog = async (id, token) => {
  try {
    const response = await api.delete(`/admin/blogs/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
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

export const getAdminJobs = async (token) => {
  try {
    const response = await api.get('/admin/jobs', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin jobs:', error);
    throw error;
  }
};

export const createJob = async (jobData, token) => {
  try {
    const response = await api.post('/admin/jobs', jobData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

export const updateJob = async (id, jobData, token) => {
  try {
    const response = await api.put(`/admin/jobs/${id}`, jobData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

export const deleteJob = async (id, token) => {
  try {
    const response = await api.delete(`/admin/jobs/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

export const getApplications = async (token) => {
  try {
    const response = await api.get('/admin/applications', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

export const updateApplicationStatus = async (id, status, token) => {
  try {
    const response = await api.put(`/admin/applications/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
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

export const getQuotes = async (token) => {
  try {
    const response = await api.get('/admin/quotes', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching quotes:', error);
    throw error;
  }
};

// ========== ADMIN STATS ==========
export const getAdminStats = async (token) => {
  try {
    const response = await api.get('/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

// ========== USER MANAGEMENT (Super Admin) ==========
export const getUsers = async (token) => {
  try {
    const response = await api.get('/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const createUser = async (userData, token) => {
  try {
    const response = await api.post('/admin/users', userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const deleteUser = async (id, token) => {
  try {
    const response = await api.delete(`/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};