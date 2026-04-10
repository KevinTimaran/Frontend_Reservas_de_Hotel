import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/hotel';

export const hotelApi = {
  getAvailability: (startDate, endDate, roomType) => 
    axios.get(`${API_URL}/availability`, { params: { startDate, endDate, roomType } }),

  createBooking: (bookingDTO) => 
    axios.post(`${API_URL}/book`, bookingDTO),

  addService: (bookingId, serviceType) => 
    axios.post(`${API_URL}/services/${bookingId}`, { serviceType }),

  doCheckIn: (bookingId) => 
    axios.put(`${API_URL}/checkin/${bookingId}`),

  doCheckOut: (bookingId) => 
    axios.put(`${API_URL}/checkout/${bookingId}`),

  getBooking: (bookingId) => 
    axios.get(`${API_URL}/reservation/${bookingId}`)
};