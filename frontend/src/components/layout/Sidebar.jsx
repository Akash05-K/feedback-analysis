import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
  { path: '/upload', label: 'Upload Excel', icon: 'bi-file-earmark-excel' },
  { path: '/teachers', label: 'Teachers', icon: 'bi-person-workspace' },
  { path: '/analytics', label: 'Analytics', icon: 'bi-bar-chart-line' },
];

const Sidebar = () => {
  return (
    <div className="bg-dark text-white d-flex flex-column p-3" style={{ width: '250px', minHeight: '100vh' }}>
      <h5 className="text-center mb-4 py-2 border-bottom border-secondary">
        <i className="bi bi-mortarboard-fill me-2"></i>
        Feedback System
      </h5>
      <nav className="nav nav-pills flex-column gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-link text-white d-flex align-items-center gap-2 ${isActive ? 'active bg-primary' : ''}`
            }
          >
            <i className={`bi ${item.icon}`}></i>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;