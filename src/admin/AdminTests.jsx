import React, { useState, useEffect } from 'react';
import { Microscope, Plus, Trash2, Search, Loader2 } from 'lucide-react';
import { fetchAdminTests, createTest, deleteTest } from '../api/adminApi';

export default function AdminTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTestName, setNewTestName] = useState('');
  const [newTestCat, setNewTestCat] = useState('General');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadTests = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminTests();
      if (data) setTests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTests();
  }, []);

  const handleAddTest = async (e) => {
    e.preventDefault();
    if (!newTestName.trim()) return;

    setIsSubmitting(true);
    try {
      await createTest({
        name: newTestName.trim(),
        category: newTestCat,
        active: true
      });
      setNewTestName('');
      loadTests();
    } catch (err) {
      alert('Failed to create test: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTest = async (id) => {
    if (window.confirm('Delete test parameter from master database?')) {
      try {
        await deleteTest(id);
        loadTests();
      } catch (err) {
        alert('Failed to delete test: ' + err.message);
      }
    }
  };

  const filteredTests = tests.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-tests-view">
      <div className="dashboard-top-row">
        <div>
          <h1 className="dashboard-title">Test Master Database (MySQL)</h1>
          <p className="text-muted">Manage individual lab test definitions and clinical categories in MySQL.</p>
        </div>
      </div>

      {/* Quick Add Form */}
      <div className="controls-card mb-4" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <h3 style={{ fontSize: '1.05rem', color: 'var(--primary-navy)' }}>Add New Test Parameter</h3>
        <form onSubmit={handleAddTest} className="form-grid-2" style={{ marginTop: '0.5rem' }}>
          <input
            type="text"
            required
            placeholder="Test Name (e.g., Vitamin D3 25-OH)"
            className="form-input"
            value={newTestName}
            onChange={(e) => setNewTestName(e.target.value)}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select
              className="form-input"
              value={newTestCat}
              onChange={(e) => setNewTestCat(e.target.value)}
            >
              <option value="General">General</option>
              <option value="Diabetes">Diabetes</option>
              <option value="Thyroid">Thyroid</option>
              <option value="Fever / Serology">Fever / Serology</option>
              <option value="Liver">Liver</option>
              <option value="Kidney">Kidney</option>
              <option value="Vitamins">Vitamins</option>
              <option value="Hematology">Hematology</option>
            </select>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <Plus size={18} /> {isSubmitting ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>

      <div className="controls-card mb-4">
        <div className="search-box-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search test master catalog..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex-center" style={{ padding: '3rem 0' }}>
          <Loader2 size={32} className="animate-spin text-primary mb-2" />
          <p className="text-muted">Loading test master items from MySQL...</p>
        </div>
      ) : (
        <div className="table-card">
          <div className="table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Test Parameter Name</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTests.length > 0 ? (
                  filteredTests.map((t) => (
                    <tr key={t.id}>
                      <td><strong>{t.name}</strong></td>
                      <td><span className="badge badge-blue">{t.category}</span></td>
                      <td>
                        <span className="status-pill status-completed">Active</span>
                      </td>
                      <td>
                        <button className="btn-icon btn-icon-danger" onClick={() => handleDeleteTest(t.id)} title="Delete Test">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4">No test parameters found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
