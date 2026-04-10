import axios from 'axios';

const API_URL = 'http://localhost:8080/api/hotel';

export const hotelApi = {
  getAvailability: (startDate, endDate, type) => 
    axios.get(`${API_URL}/disponibilidad`, { params: { startDate, endDate, type } }),

  createBooking: (bookingData) => 
    axios.post(`${API_URL}/reservar`, bookingData),

  addService: (bookingId, serviceType) => 
    axios.post(`${API_URL}/servicios/${bookingId}`, { type: serviceType }),

  doCheckIn: (bookingId) => 
    axios.put(`${API_URL}/checkin/${bookingId}`),

  doCheckOut: (bookingId) => 
    axios.put(`${API_URL}/checkout/${bookingId}`),

  getBookingDetails: (bookingId) => 
    axios.get(`${API_URL}/reserva/${bookingId}`)
};