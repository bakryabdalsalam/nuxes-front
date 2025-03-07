import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { HiHome, HiBriefcase, HiDocument, HiUserCircle, HiChartBar } from 'react-icons/hi';

const CompanyLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/company/dashboard', label: 'Dashboard', icon: HiHome },
    { path: '/company/jobs/create', label: 'Post a Job', icon: HiBriefcase },
    { path: '/company/profile', label: 'Company Profile', icon: HiUserCircle },
    { path: '/company/stats', label: 'Analytics', icon: HiChartBar },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-800">Company Portal</h1>
        </div>
        <nav className="mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default CompanyLayout;