import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import EnhancedBookingForm from './components/EnhancedBookingForm';
import BookingList from './components/BookingList';
import apiService from './services/api';

// Main dashboard component for authenticated users
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit'
  const [editingBooking, setEditingBooking] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setCurrentView('edit');
  };

  const handleBookingCreated = async (bookingData) => {
    try {
      console.log('Creating booking with data:', bookingData);
      await apiService.createBooking(bookingData);
      setRefreshTrigger(prev => prev + 1);
      setCurrentView('list');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Nepavyko sukurti rezervacijos: ' + (error.message || 'Bandykite dar kartą.'));
      throw error; // Re-throw so the form knows there was an error
    }
  };

  const handleBookingUpdated = () => {
    setRefreshTrigger(prev => prev + 1);
    setCurrentView('list');
    setEditingBooking(null);
  };

  const handleCancelEdit = () => {
    setCurrentView('list');
    setEditingBooking(null);
  };

  return (
    <div>
      {/* Navigation */}
      <nav>
        <div className="container">
          <ul>
            <li className="nav-left">
              <h3 style={{ color: 'white', margin: 0 }}>
                🎬 Kino bilietų rezervacijos sistema
              </h3>
            </li>
            <li className="nav-right">
              <span style={{ color: 'white', marginRight: '15px' }}>
                Sveiki, {user.username}!
              </span>
              <button onClick={logout}>
                Atsijungti
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main navigation buttons */}
      <div className="container">
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <button 
            onClick={() => setCurrentView('list')}
            style={{ 
              marginRight: '10px',
              backgroundColor: currentView === 'list' ? '#28a745' : '#007bff'
            }}
          >
            Rezervacijų sąrašas
          </button>
          <button 
            onClick={() => setCurrentView('create')}
            style={{ 
              backgroundColor: currentView === 'create' ? '#28a745' : '#007bff'
            }}
          >
            Nauja rezervacija
          </button>
        </div>

        {/* Content based on current view */}
        {currentView === 'list' && (
          <BookingList 
            onEditBooking={handleEditBooking}
            refreshTrigger={refreshTrigger}
          />
        )}

        {currentView === 'create' && (
          <EnhancedBookingForm 
            onBookingCreated={handleBookingCreated}
            onClose={() => setCurrentView('list')}
          />
        )}

        {currentView === 'edit' && editingBooking && (
          <EnhancedBookingForm 
            booking={editingBooking}
            onBookingUpdated={handleBookingUpdated}
            onClose={handleCancelEdit}
          />
        )}
      </div>
    </div>
  );
};

// Auth wrapper component
const AuthWrapper = () => {
  const { user, isLoading } = useAuth();
  const [isLoginForm, setIsLoginForm] = useState(true);

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">
          Kraunama...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <nav>
          <div className="container">
            <ul>
              <li className="nav-left">
                <h3 style={{ color: 'white', margin: 0 }}>
                🎬 Kino bilietų rezervacijos sistema
                </h3>
              </li>
              <li className="nav-right">
                <button
                  onClick={() => setIsLoginForm(!isLoginForm)}
                  style={{ 
                    color: 'white',
                    background: 'none',
                    border: 'none',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: 'inherit',
                    padding: '0'
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  {isLoginForm ? 'Registracija' : 'Prisijungimas'}
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {isLoginForm ? (
          <Login onToggleForm={() => setIsLoginForm(false)} />
        ) : (
          <Register onToggleForm={() => setIsLoginForm(true)} />
        )}
      </div>
    );
  }

  return <Dashboard />;
};

// Main App component
const App = () => {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
};

export default App;