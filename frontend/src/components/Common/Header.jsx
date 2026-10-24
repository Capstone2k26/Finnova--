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
    <header className="border-b border-gray-100 bg-white/95">
      <div className="flex items-center justify-between px-5 py-4 sm:px-7 lg:px-9">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">Your financial workspace</p>
          <h2 className="mt-1 text-lg font-bold text-gray-900 sm:text-xl">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ''}
          </h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Learning level: <span className="font-medium capitalize text-gray-700">{user?.financialLiteracyLevel || 'beginner'}</span>
          </p>
        </div>

        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center space-x-3 focus:outline-none">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{user?.firstName} {user?.lastName}</p>
              <p className="max-w-40 truncate text-xs text-gray-500">{user?.email}</p>
            </div>
            <UserCircleIcon className="h-10 w-10 text-emerald-800/65" />
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
