import api from './api';

const BOOKINGS_STORAGE_KEY = 'alzain_bookings_store';

const getStoredBookings = () => {
  const stored = localStorage.getItem(BOOKINGS_STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
};

const saveStoredBookings = (bookings) => {
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
};

export const bookingService = {
  async submitBooking(bookingRequest) {
    try {
      const response = await api.post('/bookings', bookingRequest);
      return response.data;
    } catch (error) {
      console.warn('Backend API unavailable. Saving booking request to local storage.', error.message);
      
      const bookingId = 'AZD-' + Math.floor(100000 + Math.random() * 900000);
      const newBooking = {
        ...bookingRequest,
        id: Date.now(),
        bookingId: bookingId,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };
      
      const current = getStoredBookings();
      saveStoredBookings([newBooking, ...current]);
      
      return {
        success: true,
        bookingId: bookingId,
        message: 'Your booking request has been received.',
        data: newBooking
      };
    }
  },

  // Admin booking management
  async getAllBookings() {
    try {
      const response = await api.get('/admin/bookings');
      return response.data;
    } catch (error) {
      return getStoredBookings();
    }
  },

  async updateBookingStatus(bookingId, status) {
    try {
      const response = await api.patch(`/admin/bookings/${bookingId}/status`, { status });
      return response.data;
    } catch (error) {
      const current = getStoredBookings();
      const updated = current.map(b => (b.bookingId === bookingId || b.id === Number(bookingId)) ? { ...b, status } : b);
      saveStoredBookings(updated);
      return { success: true, bookingId, status };
    }
  }
};
