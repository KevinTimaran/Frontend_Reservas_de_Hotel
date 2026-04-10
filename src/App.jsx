import { useState } from 'react';
import { hotelApi } from './api';

function App() {
  const [step, setStep] = useState(1);
  const [rooms, setRooms] = useState([]);
  const [booking, setBooking] = useState(null);
  const [bookingDTO, setBookingDTO] = useState({
    startDate: '2026-04-10',
    endDate: '2026-04-15',
    roomType: 'DOUBLE',
    guestName: '',
    document: '',
    email: ''
  });

  const searchRooms = async () => {
    try {
      const res = await hotelApi.getAvailability(bookingDTO.startDate, bookingDTO.endDate, bookingDTO.roomType);
      setRooms(res.data);
    } catch (error) { console.error("Search failed"); }
  };

  const makeBooking = async () => {
    try {
      const res = await hotelApi.createBooking(bookingDTO);
      setBooking(res.data);
      setStep(3);
    } catch (error) { console.error("Booking failed"); }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Hotel Management System</h2>

      {step === 1 && (
        <div className="card p-4">
          <h4>Room Search</h4>
          <select className="form-select mb-3" onChange={e => setBookingDTO({...bookingDTO, roomType: e.target.value})}>
            <option value="SINGLE">Single</option>
            <option value="DOUBLE">Double</option>
            <option value="SUITE">Suite</option>
          </select>
          <button className="btn btn-primary w-100" onClick={searchRooms}>Check Availability</button>
          
          <div className="mt-4">
            {rooms.map(room => (
              <div key={room.id} className="card p-3 d-flex flex-row justify-content-between">
                <span>Room {room.number} - {room.type}</span>
                <button className="btn btn-sm btn-success" onClick={() => setStep(2)}>Select</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card p-4">
          <h4>Guest Information</h4>
          <input className="form-control mb-2" placeholder="Full Name" onChange={e => setBookingDTO({...bookingDTO, guestName: e.target.value})} />
          <input className="form-control mb-2" placeholder="Document ID" onChange={e => setBookingDTO({...bookingDTO, document: e.target.value})} />
          <button className="btn btn-success w-100" onClick={makeBooking}>Confirm & Pay</button>
        </div>
      )}

      {step === 3 && booking && (
        <div className="card p-4 border-primary">
          <h4>Reservation Panel</h4>
          <p><strong>Status:</strong> {booking.status}</p>
          <div className="btn-group w-100">
            <button className="btn btn-outline-info" onClick={() => hotelApi.addService(booking.id, 'SPA')}>Add Spa</button>
            <button className="btn btn-outline-dark" onClick={() => hotelApi.doCheckIn(booking.id)}>Check-In</button>
            <button className="btn btn-danger" onClick={() => setStep(4)}>Check-Out</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;