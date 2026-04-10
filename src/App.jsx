import { useState } from 'react';
import { hotelApi } from './api';

function App() {
  const [step, setStep] = useState(1);
  const [rooms, setRooms] = useState([]);
  const [booking, setBooking] = useState(null);
  const [reservaDTO, setReservaDTO] = useState({
    fechaInicio: '2026-04-10',
    fechaFin: '2026-04-15',
    tipoHabitacion: 'DOUBLE',
    nombreHuesped: '',
    documento: '',
    correo: '',
    telefono: ''
  });

  const searchRooms = async () => {
    const res = await hotelApi.getAvailability(reservaDTO.fechaInicio, reservaDTO.fechaFin, reservaDTO.tipoHabitacion);
    setRooms(res.data);
  };

  const makeBooking = async () => {
    const res = await hotelApi.createBooking(reservaDTO);
    setBooking(res.data);
    setStep(3);
  };

  const handleCheckIn = async () => {
    const res = await hotelApi.doCheckIn(booking.id);
    setBooking({ ...booking, llaveDigital: res.data, estado: 'CHECK_IN' });
  };

  const handleCheckOut = async () => {
    const res = await hotelApi.doCheckOut(booking.id);
    setBooking({ ...booking, factura: res.data, estado: 'CHECK_OUT' });
    setStep(4);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Hotel Booking System</h2>

      {step === 1 && (
        <div className="card p-3">
          <h4>Search Availability</h4>
          <select className="form-select mb-2" onChange={e => setReservaDTO({...reservaDTO, tipoHabitacion: e.target.value})}>
            <option value="SENCILLA">Sencilla</option>
            <option value="DOBLE">Doble</option>
            <option value="SUITE">Suite</option>
          </select>
          <button className="btn btn-primary w-100" onClick={searchRooms}>Search</button>
          <div className="mt-3">
            {rooms.map(r => (
              <div key={r.id} className="border p-2 mb-2 d-flex justify-content-between align-items-center">
                <span>Room {r.numero} - ${r.precioBase}</span>
                <button className="btn btn-sm btn-success" onClick={() => setStep(2)}>Select</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card p-3">
          <h4>Guest Details</h4>
          <input className="form-control mb-2" placeholder="Full Name" onChange={e => setReservaDTO({...reservaDTO, nombreHuesped: e.target.value})} />
          <input className="form-control mb-2" placeholder="Document" onChange={e => setReservaDTO({...reservaDTO, documento: e.target.value})} />
          <input className="form-control mb-2" placeholder="Email" onChange={e => setReservaDTO({...reservaDTO, correo: e.target.value})} />
          <button className="btn btn-success w-100" onClick={makeBooking}>Confirm Reservation</button>
        </div>
      )}

      {step === 3 && booking && (
        <div className="card p-3 shadow border-primary">
          <h4>Booking Management</h4>
          <p><strong>Guest:</strong> {booking.huesped.nombreCompleto}</p>
          <p><strong>Status:</strong> <span className="badge bg-info">{booking.estado}</span></p>
          <div className="btn-group w-100">
            <button className="btn btn-outline-primary" onClick={() => hotelApi.addService(booking.id, 'SPA')}>+ Spa</button>
            <button className="btn btn-outline-dark" onClick={handleCheckIn}>Check-In</button>
            <button className="btn btn-danger" onClick={handleCheckOut}>Check-Out</button>
          </div>
          {booking.llaveDigital && (
            <div className="alert alert-success mt-3 text-center">
              🔑 Digital Key: <strong>{booking.llaveDigital.codigoUUID}</strong>
            </div>
          )}
        </div>
      )}

      {step === 4 && booking.factura && (
        <div className="card p-4 border-dark">
          <h3 className="text-center">Final Invoice</h3>
          <hr />
          <p>Hospedaje: ${booking.factura.subtotalHospedaje}</p>
          <p>Servicios: ${booking.factura.subtotalServicios}</p>
          <h4 className="text-end text-success">Total: ${booking.factura.total}</h4>
          <button className="btn btn-secondary mt-3" onClick={() => window.print()}>Print Invoice</button>
        </div>
      )}
    </div>
  );
}

export default App;