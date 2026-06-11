import axios from "axios";

const API = 'https://travelmatch-backend.onrender.com/api';
const getToken = () => localStorage.getItem('token');

export const getMyProfile = () => {
    return axios.get(`${API}/users/profile`, {
        headers: {Authorization: `Bearer ${getToken()}`}
    });
};

export const getUserProfile = (id) => {
    return axios.get(`${API}/users/${id}`);
};

export const updateProfile = (podaci) => {
    return axios.put(`${API}/users/profile`, podaci, {
        headers: {Authorization: `Bearer ${getToken()}`}
    });
};

export const uploadImage = (formData) => {
    return axios.post(`${API}/users/upload-image`, formData, {
        headers: {Authorization: `Bearer ${getToken()}`, 'Content-Type': 'multipart/form-data'}
    });
};