import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/auth';

const authService = {
    register: async (userData) => {
        // According to our previous implementation, register takes name, email, password, roleId
        // The user request specified name, email, password.
        // We'll default roleId to 1 (USER) if not provided by the UI.
        const response = await axios.post(`${API_BASE_URL}/register`, {
            ...userData,
            roleId: userData.roleId || 1
        });
        return response.data;
    },

    login: async (credentials) => {
        const response = await axios.post(`${API_BASE_URL}/login`, credentials);
        return response.data; // Should return JWT token
    },

    validateToken: async (token) => {
        const response = await axios.get(`${API_BASE_URL}/validate`, {
            params: { token }
        });
        return response.data;
    }
};

export default authService;
