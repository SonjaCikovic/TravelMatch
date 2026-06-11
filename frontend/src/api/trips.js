import axios from "axios";

const API = 'https://travelmatch-backend.onrender.com';

const getToken = () => localStorage.getItem('token');

export const getAllTrips = (params = {}) => {
    return axios.get(`${API}/trips`, {params});
};

export const getTrip = (id) => {
    return axios.get(`${API}/trips/${id}`);
};

export const createTrip = (podaci) => {
    return axios.post(`${API}/trips`, podaci, {
        headers: {Authorization: `Bearer ${getToken()}`}
    });
};

export const addCity = (tripId, podaci) => {
    return axios.post(`${API}/trips/${tripId}/cities`, podaci, {
        headers: {Authorization: `Bearer ${getToken()}`}
    });
};

export const getMyTrips = () => {
    return axios.get(`${API}/trips/my`, {
        headers: {Authorization: `Bearer ${getToken()}`}
    });
};

export const getJoinedTrips = () => {
    return axios.get(`${API}/trips/joined`, {
        headers: {Authorization: `Bearer ${getToken()}`}
    });
};

export const sendRequest = (tripId) => {
    return axios.post(`${API}/trips/${tripId}/requests`, {}, {
        headers: {Authorization: `Bearer ${getToken()}`}
    });
};

export const getParticipants = (tripId) => {
    return axios.get(`${API}/trips/${tripId}/participants`);
};

export const getRequests = (tripId) => {
    return axios.get(`${API}/trips/${tripId}/requests`, {
        headers: {Authorization: `Bearer ${getToken()}`}
    });
};

export const handleRequest = (tripId, requestId, status) => {
    return axios.put(`${API}/trips/${tripId}/requests/${requestId}`, {status}, {
        headers: {Authorization: `Bearer ${getToken()}`}
    });
};

export const updateTrip = (id, podaci) => {
    return axios.put(`${API}/trips/${id}`, podaci, {
        headers: {Authorization: `Bearer ${getToken()}`}
    });
};

export const deleteCities = (tripId) => {
    return axios.delete(`${API}/trips/${tripId}/cities`, {
        headers: {Authorization: `Bearer ${getToken()}`}
    });
};

export const getMyRequest = (tripId) => {
    return axios.get(`${API}/trips/${tripId}/requests/my`, {
        headers: {Authorization: `Bearer ${getToken()}`}
    });
};

export const removeParticipant = (tripId, userId) => {
    return axios.delete(`${API}/trips/${tripId}/participants/${userId}`, {
        headers: {Authorization: `Bearer ${getToken()}`}
    });
};