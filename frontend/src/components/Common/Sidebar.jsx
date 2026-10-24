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
import { Link } from 'react-router-dom';

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
    <aside className="app-sidebar flex h-screen w-64 flex-col bg-[#10251d] text-white">
      <Link to="/" className="brand-lockup flex items-center gap-3 px-6 py-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-300 text-lg font-black text-emerald-950">F</span>
        <div className="brand-copy">
          <h1 className="text-xl font-extrabold tracking-wide">FINNOVA</h1>
          <p className="text-xs text-emerald-100/60 mt-0.5">FINANCIAL SIMULATOR</p>
        </div>
      </Link>

      <div className="nav-label px-6 pb-2 pt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-100/45">
        Your workspace
      </div>
      
      <nav className="flex-1 space-y-1 px-3">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
                `nav-link flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                isActive
                    ? 'bg-lime-300 text-emerald-950 shadow-lg shadow-black/10'
                    : 'text-emerald-50/75 hover:bg-white/8 hover:text-white'
                }`
            }
            title={item.name}
          >
            <item.icon className="nav-icon mr-3 h-5 w-5 shrink-0" />
            <span className="brand-copy">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer m-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-semibold text-lime-200">LEARN BY DOING</p>
        <p className="mt-1 text-xs leading-relaxed text-emerald-50/55">Practice with demo balances and sample market data.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
