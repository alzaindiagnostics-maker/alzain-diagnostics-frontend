import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, AlertCircle, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { createPackage, updatePackage, fetchPackageById } from '../api/adminApi';
import '../styles/admin.css';

export default function AdminPackageForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Health Checkup',
    shortDescription: '',
    detailedDescription: '',
    originalPrice: '',
    offerPrice: '',
    discountPercentage: '',
    parametersText: '',
    preparationInstructions: '',
    reportInformation: '',
    imageUrl: '/assets/packages/default.jpg',
    active: true,
    featured: false,
    homeCollectionAvailable: true,
    testNames: []
  });

  const [newTestInput, setNewTestInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEdit) {
      async function loadPackage() {
        try {
          const pkg = await fetchPackageById(id);
          if (pkg) {
            setFormData({
              name: pkg.name || '',
              category: pkg.category || 'Health Checkup',
              shortDescription: pkg.shortDescription || '',
              detailedDescription: pkg.detailedDescription || '',
              originalPrice: pkg.originalPrice ?? '',
              offerPrice: pkg.offerPrice ?? '',
              discountPercentage: pkg.discountPercentage ?? '',
              parametersText: pkg.parametersText || '',
              preparationInstructions: pkg.preparationInstructions || '',
              reportInformation: pkg.reportInformation || '',
              imageUrl: pkg.imageUrl || '/assets/packages/default.jpg',
              active: pkg.active ?? true,
              featured: pkg.featured ?? false,
              homeCollectionAvailable: pkg.homeCollectionAvailable ?? true,
              testNames: pkg.testNames || []
            });
          }
        } catch (err) {
          setError('Failed to fetch package details');
        } finally {
          setFetching(false);
        }
      }
      loadPackage();
    }
  }, [id, isEdit]);

  const handleAddTestName = () => {
    if (newTestInput.trim()) {
      setFormData({
        ...formData,
        testNames: [...formData.testNames, newTestInput.trim()]
      });
      setNewTestInput('');
    }
  };

  const handleRemoveTestName = (index) => {
    setFormData({
      ...formData,
      testNames: formData.testNames.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.offerPrice) {
      setError('Package Name and Offer Price are required.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...formData,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        offerPrice: parseFloat(formData.offerPrice),
        discountPercentage: formData.discountPercentage ? parseInt(formData.discountPercentage) : null
      };

      if (isEdit) {
        await updatePackage(id, payload);
        setSuccess('Package updated successfully!');
      } else {
        await createPackage(payload);
        setSuccess('New package created successfully!');
      }

      setTimeout(() => {
        navigate('/admin/packages');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex-center" style={{ padding: '4rem 0' }}>
        <Loader2 size={36} className="animate-spin text-primary mb-2" />
        <p className="text-muted">Loading package details...</p>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      <div className="page-header-row mb-4">
        <div>
          <Link to="/admin/packages" className="view-all-link mb-2" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowLeft size={16} /> Back to Package List
          </Link>
          <h2>{isEdit ? 'Edit Diagnostic Package' : 'Create New Diagnostic Package'}</h2>
        </div>
      </div>

      {error && (
        <div className="form-error-alert mb-4">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="form-success-alert mb-4" style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.85rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <CheckCircle2 size={20} />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form-card" style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Package Title *</label>
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
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Health Checkup">Health Checkup</option>
              <option value="Medical / Gulf">Medical / Gulf</option>
              <option value="Diabetes">Diabetes</option>
              <option value="Fever">Fever</option>
              <option value="Liver">Liver</option>
              <option value="Lipid">Lipid</option>
              <option value="Thyroid">Thyroid</option>
              <option value="Electrolytes">Electrolytes</option>
              <option value="Special Checkup">Special Checkup</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Offer Price (₹) *</label>
            <input
              type="number"
              required
              min="0"
              step="1"
              className="form-input"
              value={formData.offerPrice}
              onChange={(e) => setFormData({ ...formData, offerPrice: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Original Price (₹) (Optional)</label>
            <input
              type="number"
              min="0"
              step="1"
              className="form-input"
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group mt-3">
          <label className="form-label">Short Description</label>
          <input
            type="text"
            className="form-input"
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
          />
        </div>

        <div className="form-group mt-3">
          <label className="form-label">Detailed Description</label>
          <textarea
            rows={3}
            className="form-textarea"
            value={formData.detailedDescription}
            onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
          />
        </div>

        <div className="form-grid mt-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Preparation Instructions</label>
            <input
              type="text"
              className="form-input"
              value={formData.preparationInstructions}
              onChange={(e) => setFormData({ ...formData, preparationInstructions: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Report Turnaround Info</label>
            <input
              type="text"
              className="form-input"
              value={formData.reportInformation}
              onChange={(e) => setFormData({ ...formData, reportInformation: e.target.value })}
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="checkbox-group-row mt-4" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
            />
            <span>Active Catalogue Package</span>
          </label>

          <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            />
            <span>Featured Package on Home Page</span>
          </label>

          <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.homeCollectionAvailable}
              onChange={(e) => setFormData({ ...formData, homeCollectionAvailable: e.target.checked })}
            />
            <span>Home Sample Collection Available</span>
          </label>
        </div>

        {/* Test Items Manager */}
        <div className="test-items-section mt-4" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
          <h4>Included Diagnostic Tests</h4>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Add test name (e.g. CBP / CBC, HbA1c)"
              className="form-input"
              value={newTestInput}
              onChange={(e) => setNewTestInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTestName(); } }}
            />
            <button type="button" className="btn btn-secondary" onClick={handleAddTestName}>
              <Plus size={16} /> Add Test
            </button>
          </div>

          <div className="test-tags-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {formData.testNames.map((test, index) => (
              <span key={index} style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                {test}
                <button type="button" onClick={() => handleRemoveTestName(index)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-actions mt-4" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
          <Link to="/admin/packages" className="btn btn-outline">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <span className="flex-center">
                <Loader2 size={18} className="animate-spin mr-2" /> Saving...
              </span>
            ) : (
              <>
                <Save size={18} />
                <span>{isEdit ? 'Update Package' : 'Save Package'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
