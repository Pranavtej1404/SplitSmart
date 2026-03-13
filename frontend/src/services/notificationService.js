import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/notifications';

const getMyNotifications = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.get(`${API_BASE_URL}/${user.id}`);
    return response.data;
};

const markAsRead = async (id) => {
    const response = await axios.put(`${API_BASE_URL}/${id}/read`);
    return response.data;
};

const notificationService = {
    getMyNotifications,
    markAsRead,
};

export default notificationService;
