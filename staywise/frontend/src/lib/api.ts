import axios from 'axios';
import { AuthResponse, Property, Booking } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  signup: async (data: { email: string; password: string; name: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
};

// Property APIs
export const propertyAPI = {
  getAll: async (): Promise<Property[]> => {
    const response = await api.get('/properties');
    return response.data;
  },

  getById: async (id: string): Promise<Property> => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  create: async (data: Partial<Property>): Promise<Property> => {
    const response = await api.post('/properties', data);
    return response.data.property;
  },
};

// Booking APIs
export const bookingAPI = {
  getMyBookings: async (): Promise<Booking[]> => {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  },

  getAllBookings: async (): Promise<Booking[]> => {
    const response = await api.get('/bookings/all');
    return response.data;
  },

  create: async (data: {
    propertyId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  }): Promise<Booking> => {
    const response = await api.post('/bookings', data);
    return response.data.booking;
  },

  cancel: async (id: string): Promise<Booking> => {
    const response = await api.patch(`/bookings/${id}/cancel`);
    return response.data.booking;
  },
};

export default api;