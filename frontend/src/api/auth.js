import axios from 'axios';

const API = 'https://travelmatch-backend.onrender.com';

export const register = (podaci) => {
    return axios.post(`${API}/auth/register`, podaci);
};
export const login = (podaci) => {
    return axios.post(`${API}/auth/login`, podaci);
};