import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const BookingForm = ({ booking, onClose, onBookingCreated, onBookingUpdated }) => {
  const [formData, setFormData] = useState({
    cinemaName: '',
    date: '',
    price: '',
    bookingTime: '',
    stageSquares: 100,
    seatNumber: ''
  });
  const [availableSeats, setAvailableSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSeats, setIsLoadingSeats] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Initialize form with booking data if editing
  useEffect(() => {
    if (booking) {
      const bookingDate = new Date(booking.date);
      setFormData({
        cinemaName: booking.cinemaName,
        date: bookingDate.toISOString().split('T')[0], // Format for date input
        price: booking.price,
        bookingTime: booking.bookingTime,
        stageSquares: booking.stageSquares,
        seatNumber: booking.seatNumber
      });
    }
  }, [booking]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  // Load available seats when cinema, date, time, or stageSquares change
  useEffect(() => {
    const loadAvailableSeats = async () => {
      if (formData.cinemaName && formData.date && formData.bookingTime && formData.stageSquares) {
        setIsLoadingSeats(true);
        try {
          const response = await apiService.getAvailableSeats({
            cinemaName: formData.cinemaName,
            date: formData.date,
            bookingTime: formData.bookingTime,
            stageSquares: formData.stageSquares
          });
          setAvailableSeats(response.availableSeats);
        } catch (error) {
          console.error('Error loading available seats:', error);
          setAvailableSeats([]);
        } finally {
          setIsLoadingSeats(false);
        }
      }
    };

    // Don't load seats immediately on mount when editing
    if (!booking || (formData.cinemaName && formData.date && formData.bookingTime)) {
      loadAvailableSeats();
    }
  }, [formData.cinemaName, formData.date, formData.bookingTime, formData.stageSquares, booking]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (booking) {
        // Update existing booking
        const response = await apiService.updateBooking(booking._id, formData);
        setSuccess('Rezervacija atnaujinta!');
        onBookingUpdated && onBookingUpdated(response.booking);
      } else {
        // Create new booking
        const response = await apiService.createBooking(formData);
        setSuccess('Rezervacija sukurta!');
        onBookingCreated && onBookingCreated(response.booking);
        
        // Reset form for new booking
        setFormData({
          cinemaName: '',
          date: '',
          price: '',
          bookingTime: '',
          stageSquares: 100,
          seatNumber: ''
        });
        setAvailableSeats([]);
      }
    } catch (error) {
      setError(error.message || 'Klaida išsaugojant rezervaciją');
    } finally {
      setIsLoading(false);
    }
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 9; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  return (
    <div className="container">
      <h2>
        {booking ? 'Redaguoti rezervaciją' : 'Nauja rezervacija'}
      </h2>

      {error && (
        <div className="alert error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert success">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="cinemaName">Kino pavadinimas:</label>
          <input
            type="text"
            id="cinemaName"
            name="cinemaName"
            value={formData.cinemaName}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder="Pvz.: Forum Cinemas"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Data:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            disabled={isLoading}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="form-group">
          <label htmlFor="bookingTime">Seansas:</label>
          <select
            id="bookingTime"
            name="bookingTime"
            value={formData.bookingTime}
            onChange={handleChange}
            required
            disabled={isLoading}
          >
            <option value="">Pasirinkite laiką</option>
            {generateTimeOptions().map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="price">Kaina (€):</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            disabled={isLoading}
            min="0"
            max="1000"
            step="0.01"
            placeholder="12.50"
          />
        </div>

        <div className="form-group">
          <label htmlFor="stageSquares">Vietų skaičius salėje:</label>
          <select
            id="stageSquares"
            name="stageSquares"
            value={formData.stageSquares}
            onChange={handleChange}
            required
            disabled={isLoading}
          >
            <option value="50">50 vietų</option>
            <option value="100">100 vietų</option>
            <option value="200">200 vietų</option>
            <option value="300">300 vietų</option>
          </select>
        </div>

        {isLoadingSeats && (
          <div className="loading">
            Kraunamos laisvos vietos...
          </div>
        )}

        {availableSeats.length > 0 && (
          <div className="form-group">
            <label htmlFor="seatNumber">Vietos numeris:</label>
            <select
              id="seatNumber"
              name="seatNumber"
              value={formData.seatNumber}
              onChange={handleChange}
              required
              disabled={isLoading}
            >
              <option value="">Pasirinkite vietą</option>
              {availableSeats.map(seatNumber => (
                <option key={seatNumber} value={seatNumber}>
                  Vieta {seatNumber}
                </option>
              ))}
            </select>
          </div>
        )}

        {formData.cinemaName && formData.date && formData.bookingTime && formData.stageSquares && availableSeats.length === 0 && !isLoadingSeats && (
          <div className="alert error">
            Visos vietos užimtos šiam seansui
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <button 
            type="submit" 
            disabled={isLoading || availableSeats.length === 0 || (formData.cinemaName && formData.date && formData.bookingTime && !formData.seatNumber)}
          >
            {isLoading 
              ? (booking ? 'Atnaujinama...' : 'Kuriama...')
              : (booking ? 'Atnaujinti' : 'Sukurti rezervaciją')
            }
          </button>
          
          {onClose && (
            <button type="button" onClick={onClose}>
              Atšaukti
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BookingForm;