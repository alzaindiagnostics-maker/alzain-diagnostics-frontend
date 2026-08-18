import api from './api';
import { INITIAL_PACKAGES } from '../data/initialPackages';

// Local storage key for persistent offline/mock state during Phase 1
const STORAGE_KEY = 'alzain_packages_store';

const getStoredPackages = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PACKAGES));
    return INITIAL_PACKAGES;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_PACKAGES;
  }
};

const saveStoredPackages = (packages) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
};

export const packageService = {
  // Public package endpoints
  async getAllPackages() {
    try {
      const response = await api.get('/public/packages');
      return response.data;
    } catch (error) {
      console.warn('Backend API unavailable. Falling back to local data store.', error.message);
      return getStoredPackages().filter(p => p.active !== false);
    }
  },

  async getPackageBySlug(slug) {
    try {
      const response = await api.get(`/public/packages/${slug}`);
      return response.data;
    } catch (error) {
      console.warn('Backend API unavailable. Searching local package store.', error.message);
      const pkg = getStoredPackages().find(p => p.slug === slug);
      if (!pkg) throw new Error('Package not found');
      return pkg;
    }
  },

  async getFeaturedPackages() {
    try {
      const response = await api.get('/public/packages/featured');
      return response.data;
    } catch (error) {
      return getStoredPackages().filter(p => p.featured && p.active !== false);
    }
  },

  // Admin package endpoints
  async createPackage(packageData) {
    try {
      const response = await api.post('/admin/packages', packageData);
      return response.data;
    } catch (error) {
      const current = getStoredPackages();
      const newPkg = {
        ...packageData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        slug: packageData.slug || packageData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      };
      const updated = [newPkg, ...current];
      saveStoredPackages(updated);
      return newPkg;
    }
  },

  async updatePackage(id, packageData) {
    try {
      const response = await api.put(`/admin/packages/${id}`, packageData);
      return response.data;
    } catch (error) {
      const current = getStoredPackages();
      const updated = current.map(p => p.id === Number(id) ? { ...p, ...packageData } : p);
      saveStoredPackages(updated);
      return updated.find(p => p.id === Number(id));
    }
  },

  async deletePackage(id) {
    try {
      await api.delete(`/admin/packages/${id}`);
      return true;
    } catch (error) {
      const current = getStoredPackages();
      const updated = current.filter(p => p.id !== Number(id));
      saveStoredPackages(updated);
      return true;
    }
  }
};
