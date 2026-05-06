const API_BASE_URL = 'https://winze-backend-api.onrender.com/api';

export const clickTrackingService = {
    trackClick: async (linkUrl, linkTitle) => {
        try {
            let ip = '0.0.0.0';
            try {
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipResponse.json();
                ip = ipData.ip;
            } catch (e) {
                console.log('Could not fetch IP');
            }

            const response = await fetch(`${API_BASE_URL}/track`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    link_url: linkUrl,
                    link_title: linkTitle,
                    ip_address: ip
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Error tracking click:', error);
        }
    },

    getClicks: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/clicks`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching clicks:', error);
            return { success: true, clicks: [], total: 0 };
        }
    },

    getStats: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/clicks/stats`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching stats:', error);
            return { success: true, stats: { total: 0, today: 0 } };
        }
    }
};