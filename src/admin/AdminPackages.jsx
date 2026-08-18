import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, Save, X, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { fetchAdminPackages, createPackage, updatePackage, togglePackageStatus, deletePackage } from '../api/adminApi';
import { PACKAGE_CATEGORIES } from '../data/initialPackages';
import '../styles/admin.css';

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    detailedDescription: '',
    originalPrice: '',
    offerPrice: '',
    category: 'Health Checkup',
    featured: false,
    active: true,
    homeCollectionAvailable: true,
    parametersText: '',
    preparationInstructions: '',
    testsText: ''
  });

  const loadPackages = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminPackages();
      if (data) {
        setPackages(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const openCreateModal = () => {
    setEditingPkg(null);
    setFormData({
      name: '',
      shortDescription: '',
      detailedDescription: '',
      originalPrice: '',
      offerPrice: '',
      category: 'Health Checkup',
      featured: false,
      active: true,
      homeCollectionAvailable: true,
      parametersText: '',
      preparationInstructions: '',
      testsText: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (pkg) => {
    setEditingPkg(pkg);
    const testList = pkg.testNames || pkg.tests || [];
    setFormData({
      name: pkg.name || '',
      shortDescription: pkg.shortDescription || '',
      detailedDescription: pkg.detailedDescription || '',
      originalPrice: pkg.originalPrice || '',
      offerPrice: pkg.offerPrice || '',
      category: pkg.category || 'Health Checkup',
      featured: pkg.featured || false,
      active: pkg.active !== false,
      homeCollectionAvailable: pkg.homeCollectionAvailable !== false,
      parametersText: pkg.parametersText || '',
      preparationInstructions: pkg.preparationInstructions || '',
      testsText: Array.isArray(testList) ? testList.join('\n') : ''
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const testNamesList = formData.testsText
      ? formData.testsText.split('\n').map(t => t.trim()).filter(Boolean)
      : [];

    const packagePayload = {
      ...formData,
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.offerPrice),
      offerPrice: Number(formData.offerPrice),
      testNames: testNamesList,
      discountPercentage: formData.originalPrice 
        ? Math.round(((Number(formData.originalPrice) - Number(formData.offerPrice)) / Number(formData.originalPrice)) * 100)
        : 0
    };

    try {
      if (editingPkg) {
        await updatePackage(editingPkg.id, packagePayload);
      } else {
        await createPackage(packagePayload);
      }
      setIsModalOpen(false);
      loadPackages();
    } catch (err) {
      alert('Failed to save package: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await togglePackageStatus(id);
      loadPackages();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this diagnostic package from MySQL?')) {
      try {
        await deletePackage(id);
        loadPackages();
      } catch (err) {
        alert('Failed to delete package: ' + err.message);
      }
    }
  };

  const filteredPackages = packages.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-packages-view">
      <div className="dashboard-top-row">
        <div>
          <h1 className="dashboard-title">Package Management (MySQL)</h1>
          <p className="text-muted">Create, update pricing, toggle active status, or remove diagnostic packages in real-time.</p>
        </div>

        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={18} /> Add New Package
        </button>
      </div>

      <div className="controls-card mb-4">
        <div className="search-box-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search package catalogue by title or category..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex-center" style={{ padding: '3rem 0' }}>
          <Loader2 size={32} className="animate-spin text-primary mb-2" />
          <p className="text-muted">Fetching package catalogue from MySQL...</p>
        </div>
      ) : (
        <div className="table-card">
          <div className="table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Package Name</th>
                  <th>Category</th>
                  <th>Original Price</th>
                  <th>Offer Price</th>
                  <th>Included Tests</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPackages.map((pkg) => {
                  const testsCount = pkg.testNames ? pkg.testNames.length : (pkg.tests ? pkg.tests.length : 0);
                  const isPkgActive = pkg.active !== false;
                  return (
                    <tr key={pkg.id}>
                      <td>
                        <strong>{pkg.name}</strong>
                        {pkg.featured && <span className="badge badge-green ml-2">Featured</span>}
                      </td>
                      <td><span className="badge badge-blue">{pkg.category}</span></td>
                      <td>{pkg.originalPrice ? `₹${pkg.originalPrice}` : 'N/A'}</td>
                      <td><strong className="text-emerald">₹{pkg.offerPrice}</strong></td>
                      <td>{testsCount} Tests</td>
                      <td>
                        <button 
                          className={`btn-toggle ${isPkgActive ? 'active' : ''}`}
                          onClick={() => handleToggleActive(pkg.id)}
                          title="Click to toggle active state"
                        >
                          {isPkgActive ? (
                            <span className="status-pill status-completed flex-center gap-1">
                              <ToggleRight size={16} /> Active
                            </span>
                          ) : (
                            <span className="status-pill status-cancelled flex-center gap-1">
                              <ToggleLeft size={16} /> Inactive
                            </span>
                          )}
                        </button>
                      </td>
                      <td>
                        <div className="table-action-btns">
                          <button className="btn-icon" onClick={() => openEditModal(pkg)} title="Edit Package">
                            <Edit2 size={16} />
                          </button>
                          <button className="btn-icon btn-icon-danger" onClick={() => handleDelete(pkg.id)} title="Delete Package">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Package Form Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-container" style={{ maxWidth: '720px' }}>
            <div className="modal-header">
              <h3>{editingPkg ? 'Edit Diagnostic Package' : 'Add New Diagnostic Package'}</h3>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="booking-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Package Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {PACKAGE_CATEGORIES.filter(c => c !== 'All').map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Original Advertised Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 4999"
                    className="form-input"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Offer Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 2099"
                    className="form-input"
                    value={formData.offerPrice}
                    onChange={(e) => setFormData({ ...formData, offerPrice: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Short Description *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Description</label>
                <textarea
                  rows="2"
                  className="form-input"
                  value={formData.detailedDescription}
                  onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Included Tests (One test per line)</label>
                <textarea
                  rows="5"
                  placeholder="CBC / CBP&#10;ESR&#10;Blood Grouping&#10;Fast Blood Sugar"
                  className="form-input font-mono"
                  value={formData.testsText}
                  onChange={(e) => setFormData({ ...formData, testsText: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Parameters Text (e.g., 92+ Parameters)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.parametersText}
                    onChange={(e) => setFormData({ ...formData, parametersText: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Preparation Instructions</label>
                  <input
                    type="text"
                    placeholder="e.g. 10-12 hours fasting required"
                    className="form-input"
                    value={formData.preparationInstructions}
                    onChange={(e) => setFormData({ ...formData, preparationInstructions: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  <span>Mark as Popular / Featured Package</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  />
                  <span>Active in Public Catalogue</span>
                </label>
              </div>

              <div className="form-actions mt-3">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  <Save size={18} /> {isSaving ? 'Saving...' : 'Save Package to MySQL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
