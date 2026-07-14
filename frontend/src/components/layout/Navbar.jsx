import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import "./Navbar.css"


const Navbar = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar navbar-light bg-white border-bottom px-4 py-2">
      <span className="navbar-brand mb-0 h5">Teacher Feedback Analysis System</span>

      <div className="d-flex align-items-center gap-3">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-person-circle fs-4 text-secondary"></i>
          <span className="fw-medium">{admin?.name}</span>
        </div>
       <button className="btn btn-logout btn-sm" onClick={handleLogout}>
  <i className="bi bi-box-arrow-right me-1"></i>
  Logout
</button>
      </div>
    </nav>
  );
};

export default Navbar;