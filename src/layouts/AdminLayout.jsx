import React, { useState } from 'react';
import { Link, NavLink, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, Package, CalendarCheck, Microscope, 
  Settings, LogOut, ShieldCheck, Home, Menu, X, UserCheck 
} from 'lucide-react';
import '../styles/admin.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const storedUserRaw = localStorage.getItem('alzain_admin_user');
  let adminDisplay = 'Admin';
  if (storedUserRaw) {
    try {
      const parsed = JSON.parse(storedUserRaw);
      adminDisplay = parsed.email || parsed.username || 'Admin';
    } catch (e) {
      adminDisplay = storedUserRaw;
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('alzain_admin_token');
    localStorage.removeItem('alzain_admin_user');
    navigate('/admin/login');
  };

  const closeMobileNav = () => {
    setMobileOpen(false);
  };

  return (
    <div className="admin-layout">
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div 
          className="admin-mobile-backdrop" 
          onClick={closeMobileNav} 
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 90 }}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck size={28} className="text-emerald" />
            <div>
              <span className="sidebar-brand-title">AL-ZAIN</span>
              <span className="sidebar-brand-subtitle">ADMIN PANEL</span>
            </div>
          </div>

          <button 
            className="mobile-close-btn" 
            onClick={closeMobileNav}
            style={{ border: 'none', background: 'none', color: '#ffffff', display: 'none', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="admin-nav-menu">
          <NavLink 
            to="/admin/dashboard" 
            onClick={closeMobileNav}
            className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink 
            to="/admin/packages" 
            onClick={closeMobileNav}
            className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}
          >
            <Package size={20} />
            <span>Package Management</span>
          </NavLink>

          <NavLink 
            to="/admin/bookings" 
            onClick={closeMobileNav}
            className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}
          >
            <CalendarCheck size={20} />
            <span>Bookings & Enquiries</span>
          </NavLink>

          <NavLink 
            to="/admin/tests" 
            onClick={closeMobileNav}
            className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}
          >
            <Microscope size={20} />
            <span>Test Master</span>
          </NavLink>

          <NavLink 
            to="/admin/settings" 
            onClick={closeMobileNav}
            className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}
          >
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="view-site-link">
            <Home size={16} /> Public Website
          </Link>
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="admin-main-content">
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              className="admin-hamburger-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--primary-navy)' }}
            >
              <Menu size={24} />
            </button>

            <div className="admin-header-title">
              <h2>Diagnostic Control Center</h2>
            </div>
          </div>

          <div className="admin-user-profile" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--royal-blue)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              <UserCheck size={18} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="user-name" style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-navy)' }}>{adminDisplay}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--medical-green-dark)', fontWeight: 600 }}>Role: ADMIN</span>
            </div>
          </div>
        </header>

        <main className="admin-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
