import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Event Types API
export const getEvents = () => api.get('/events').then(res => res.data);
export const getEventBySlug = (slug) => api.get(`/events/${slug}`).then(res => res.data);
export const createEvent = (data) => api.post('/events', data).then(res => res.data);

// Availability API
export const getAvailability = () => api.get('/availability').then(res => res.data);
export const saveAvailability = (schedule) => api.post('/availability', { schedule }).then(res => res.data);
export const getAvailableSlots = (eventSlug, date) => api.get(`/availability/slots/${eventSlug}?date=${date}`).then(res => res.data);

// Bookings API
export const getBookings = () => api.get('/bookings').then(res => res.data);
export const createBooking = (data) => api.post('/bookings', data).then(res => res.data);
export const cancelBooking = (id) => api.post(`/bookings/${id}/cancel`).then(res => res.data);

export default api;
