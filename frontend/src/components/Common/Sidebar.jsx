import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  BanknotesIcon, 
  ChartBarIcon,
  DocumentChartBarIcon,
  CurrencyDollarIcon,
  CalculatorIcon,
  AcademicCapIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', to: '/', icon: HomeIcon },
  { name: 'Banking', to: '/banking', icon: BanknotesIcon },
  { name: 'Trading', to: '/trading', icon: ChartBarIcon },
  { name: 'Mutual Funds', to: '/mutual-funds', icon: DocumentChartBarIcon },
  { name: 'Bonds', to: '/bonds', icon: CurrencyDollarIcon },
  { name: 'Accounting', to: '/accounting', icon: CalculatorIcon },
  { name: 'Learning', to: '/learning', icon: AcademicCapIcon },
  { name: 'Portfolio', to: '/portfolio', icon: BriefcaseIcon }
];

const Sidebar = () => {
  return (
    <div className="w-64 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white">
      <div className="p-6">
        <h1 className="text-3xl font-bold">FINNOVA</h1>
        <p className="text-sm text-indigo-200 mt-1">Financial Ecosystem</p>
      </div>
      
      <nav className="mt-6">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-700 border-l-4 border-white'
                  : 'hover:bg-indigo-700/50'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
