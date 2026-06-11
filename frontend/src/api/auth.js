import axios from 'axios';

const API = 'http://localhost:5000/api';

export const register = (podaci) => {
    return axios.post(`${API}/auth/register`, podaci);
};
export const login = (podaci) => {
    return axios.post(`${API}/auth/login`, podaci);
};