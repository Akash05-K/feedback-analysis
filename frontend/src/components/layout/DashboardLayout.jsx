import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ChatWidget from '../chatbot/ChatWidget';

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
      <ChatWidget />
    </div>
  );
};

export default DashboardLayout;