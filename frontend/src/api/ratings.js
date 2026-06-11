import axios from 'axios';

const API = 'https://travelmatch-backend.onrender.com';
const getToken = () => localStorage.getItem('token');

export const addRating = (tripId, podaci) => {
    return axios.post(`${API}/trips/${tripId}/ratings`, podaci, {
        headers: {Authorization: `Bearer ${getToken()}`}
    });
};

export const getUserRatings = (userId) => {
    return axios.get(`${API}/trips/users/${userId}/ratings`);
}

export const getMyRatings = (tripId) => {
    return axios.get(`${API}/trips/${tripId}/ratings/my`, {
        headers: {Authorization: `Bearer ${getToken()}`}
    });
};