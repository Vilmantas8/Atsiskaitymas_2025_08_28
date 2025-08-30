const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  // Pagalbinis metodas gauti auth antraštes
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Pagalbinis metodas tvarkyti API atsakymus
  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  }

  // Auth galutiniai taškai
  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    return this.handleResponse(response);
  }

  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });

    return this.handleResponse(response);
  }

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
  }

  // Rezervacijų galutiniai taškai
  async getAllBookings(params = {}) {
    const searchParams = new URLSearchParams(params);
    const response = await fetch(`${API_BASE_URL}/bookings?${searchParams}`, {
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
  }

  async getBookingById(id) {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
  }

  async createBooking(bookingData) {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(bookingData)
    });

    return this.handleResponse(response);
  }

  async updateBooking(id, bookingData) {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(bookingData)
    });

    return this.handleResponse(response);
  }

  async deleteBooking(id) {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
  }

  async getAvailableSeats(params) {
    const searchParams = new URLSearchParams(params);
    const response = await fetch(`${API_BASE_URL}/bookings/available-seats?${searchParams}`, {
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
  }
}

export default new ApiService();
