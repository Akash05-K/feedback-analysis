import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar />
        <div className="p-4 bg-light" style={{ minHeight: 'calc(100vh - 60px)' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;