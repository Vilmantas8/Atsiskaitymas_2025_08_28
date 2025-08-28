import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const BookingList = ({ onEditBooking, refreshTrigger }) => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    cinemaName: '',
    date: '',
    status: 'active'
  });

  useEffect(() => {
    loadBookings();
  }, [filter, refreshTrigger]);

  const loadBookings = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Remove empty filter values
      const filterParams = {};
      Object.keys(filter).forEach(key => {
        if (filter[key]) {
          filterParams[key] = filter[key];
        }
      });

      const response = await apiService.getAllBookings(filterParams);
      setBookings(response.bookings || []);
    } catch (error) {
      setError(error.message || 'Nepavyko gauti rezervacijų');
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm('Ar tikrai norite ištrinti šią rezervaciją?')) {
      return;
    }

    try {
      await apiService.deleteBooking(bookingId);
      setBookings(bookings.filter(booking => booking._id !== bookingId));
    } catch (error) {
      setError(error.message || 'Nepavyko ištrinti rezervacijos');
    }
  };

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('lt-LT');
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('lt-LT') + ' ' + date.toLocaleTimeString('lt-LT', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isLoading) {
    return <div className="loading">Kraunama...</div>;
  }

  return (
    <div className="container">
      <h2>Mano rezervacijos</h2>

      {error && (
        <div className="alert error">
          {error}
        </div>
      )}

      {/* Filters */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '4px' }}>
        <h3>Filtrai</h3>
        
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
            <label htmlFor="filterCinema">Kinas:</label>
            <input
              type="text"
              id="filterCinema"
              name="cinemaName"
              value={filter.cinemaName}
              onChange={handleFilterChange}
              placeholder="Ieškoti pagal kino pavadinimą..."
            />
          </div>

          <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
            <label htmlFor="filterDate">Data:</label>
            <input
              type="date"
              id="filterDate"
              name="date"
              value={filter.date}
              onChange={handleFilterChange}
            />
          </div>

          <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
            <label htmlFor="filterStatus">Būsena:</label>
            <select
              id="filterStatus"
              name="status"
              value={filter.status}
              onChange={handleFilterChange}
            >
              <option value="">Visos</option>
              <option value="active">Aktyvios</option>
              <option value="cancelled">Atšauktos</option>
            </select>
          </div>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Rezervacijų nerasta</p>
          <p style={{ color: '#666' }}>Sukurkite naują rezervaciją naudodami formą aukščiau</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Kinas</th>
                <th>Data</th>
                <th>Laikas</th>
                <th>Vieta</th>
                <th>Kaina</th>
                <th>Sukurta</th>
                <th>Veiksmai</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.cinemaName}</td>
                  <td>{formatDate(booking.date)}</td>
                  <td>{booking.bookingTime}</td>
                  <td>{booking.seatNumber} / {booking.stageSquares}</td>
                  <td>€{booking.price}</td>
                  <td>{formatDateTime(booking.createdAt)}</td>
                  <td>
                    <button 
                      onClick={() => onEditBooking(booking)}
                      style={{ marginRight: '5px' }}
                    >
                      Redaguoti
                    </button>
                    <button 
                      className="danger" 
                      onClick={() => handleDelete(booking._id)}
                    >
                      Ištrinti
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <p><strong>Iš viso rezervacijų:</strong> {bookings.length}</p>
        <p><strong>Bendra suma:</strong> €{bookings.reduce((sum, booking) => sum + parseFloat(booking.price || 0), 0).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default BookingList;