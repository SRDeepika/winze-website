import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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