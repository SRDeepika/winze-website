// src/services/socialLinkService.js
const API_BASE_URL = 'https://winze-backend-api.onrender.com/api';

export const socialLinkService = {
    getAll: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/social-links`);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            console.log('Social links loaded:', data);
            return data;
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    },
    
    // Add other methods (create, update, delete) as needed
};