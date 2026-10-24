import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../../stores/authStore';

const Header = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome back, {user?.firstName}!
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Financial Literacy Level: <span className="font-medium capitalize">{user?.financialLiteracyLevel}</span>
          </p>
        </div>

        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center space-x-3 focus:outline-none">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <UserCircleIcon className="w-10 h-10 text-gray-400" />
          </Menu.Button>

          <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/profile"
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } flex items-center px-4 py-2 text-sm text-gray-700`}
                >
                  <UserCircleIcon className="w-5 h-5 mr-3" />
                  Profile Settings
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } flex items-center w-full px-4 py-2 text-sm text-red-600`}
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                  Logout
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
    </header>
  );
};

export default Header;
