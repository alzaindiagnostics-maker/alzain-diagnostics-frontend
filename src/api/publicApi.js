import axios from 'axios';
import { INITIAL_PACKAGES } from '../data/initialPackages';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const cleanHost = rawBaseUrl.replace(/\/+$/, '').replace(/\/api$/, '');
const API_BASE_URL = `${cleanHost}/api/public`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

export const fetchPackages = async (queryParams = {}) => {
  try {
    const response = await api.get('/packages', { params: queryParams });
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
  } catch (error) {
    console.warn('Backend API connection failed, using initial packages fallback:', error.message);
  }

  // Fallback to initial packages array
  let filtered = [...INITIAL_PACKAGES];
  const { query, category, sort } = queryParams;

  if (category && category !== 'ALL' && category !== 'All') {
    const catLower = category.toLowerCase();
    filtered = filtered.filter(p => 
      p.category.toLowerCase().includes(catLower) || 
      catLower.includes(p.category.toLowerCase())
    );
  }

  if (query) {
    const q = query.toLowerCase().trim();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
      (p.tests && p.tests.some(t => t.toLowerCase().includes(q)))
    );
  }

  if (sort === 'price-low') {
    filtered.sort((a, b) => a.offerPrice - b.offerPrice);
  } else if (sort === 'price-high') {
    filtered.sort((a, b) => b.offerPrice - a.offerPrice);
  } else if (sort === 'discount') {
    filtered.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
  }

  return filtered;
};

export const fetchFeaturedPackages = async () => {
  try {
    const response = await api.get('/packages/featured');
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
  } catch (error) {
    console.warn('Backend API connection failed, using featured fallback:', error.message);
  }
  return INITIAL_PACKAGES.filter(p => p.featured);
};

export const fetchPackageBySlug = async (slug) => {
  try {
    const response = await api.get(`/packages/${slug}`);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.warn(`Backend API failed for slug ${slug}, using fallback:`, error.message);
  }
  return INITIAL_PACKAGES.find(p => p.slug === slug) || null;
};

export const fetchCategories = async () => {
  try {
    const response = await api.get('/packages/categories');
    if (response.data && Array.isArray(response.data)) {
      return ['ALL', ...response.data];
    }
  } catch (error) {
    console.warn('Backend API categories fetch failed, using fallback:', error.message);
  }
  const categories = [...new Set(INITIAL_PACKAGES.map(p => p.category))];
  return ['ALL', ...categories];
};

export const fetchBusinessSettings = async () => {
  try {
    const response = await api.get('/settings');
    if (response.data && Object.keys(response.data).length > 0) {
      return response.data;
    }
  } catch (error) {
    console.warn('Backend API settings fetch failed, using fallback:', error.message);
  }
  return {
    LAB_NAME: 'AL-ZAIN DIAGNOSTICS',
    LAB_TAGLINE: 'ACCURATE | RELIABLE | TRUSTED',
    LAB_ADDRESS: 'Rajampet Road, Near V.M. Hospital, Pullampet, Andhra Pradesh - 516107',
    PRIMARY_PHONE: '+91 8374874335',
    SECONDARY_PHONE: '+91 9949963552',
    PRIMARY_EMAIL: 'alzaindiagnostics@gmail.com',
    WEBSITE: 'www.alzaindiagnostics.com',
    INSTAGRAM: 'AL_ZAIN_DIAGNOSTICS',
    WORKING_HOURS: 'Mon - Sat: 7:00 AM - 9:00 PM | Sun: 7:00 AM - 2:00 PM'
  };
};

export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    const serverMessage = error.response?.data?.message;
    throw new Error(serverMessage || 'Could not submit your booking. Please check your connection and try again.');
  }
};

export const trackBooking = async (bookingId) => {
  try {
    const response = await api.get(`/bookings/track/${bookingId}`);
    return response.data;
  } catch (error) {
    console.warn(`Booking tracking failed for ${bookingId}:`, error.message);
    return null;
  }
};

export const fetchApprovedReviews = async () => {
  try {
    const response = await api.get('/reviews');
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.warn('Backend API reviews fetch failed, using fallback:', error.message);
  }
  return {
    reviews: [
      { id: 1, customerName: 'Shaik Sameer', rating: 5, reviewText: 'Extremely professional diagnostic lab in Pullampet. Got my blood report quickly on WhatsApp!', createdAt: '2026-08-10T10:30:00' },
      { id: 2, customerName: 'K. Venkat Rao', rating: 5, reviewText: 'Home sample collection was prompt and very hygienic. Highly recommended!', createdAt: '2026-08-05T09:15:00' },
      { id: 3, customerName: 'M. Lakshmi', rating: 5, reviewText: 'Very affordable prices for complete health checkup packages.', createdAt: '2026-07-28T14:20:00' }
    ],
    totalReviews: 3,
    averageRating: 5.0
  };
};

export const submitReview = async (reviewData) => {
  try {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  } catch (error) {
    const serverMessage = error.response?.data?.message;
    throw new Error(serverMessage || 'Could not submit your review. Please check your connection and try again.');
  }
};

export const sendContactEnquiry = async (enquiryData) => {
  try {
    const response = await api.post('/contact', enquiryData);
    return response.data;
  } catch (error) {
    const serverMessage = error.response?.data?.message;
    throw new Error(serverMessage || 'Could not send your enquiry. Please check your connection and try again.');
  }
};
