import { Link, useLocation } from 'react-router-dom';
import { Calendar, LayoutDashboard, CalendarDays, Settings, Sun, Moon } from 'lucide-react';

export default function Navbar({ isDark, setIsDark }) {
  const location = useLocation();
  const isPublicBooking = location.pathname.startsWith('/book/');

  if (isPublicBooking) return null;

  const links = [
    { to: '/', label: 'Event Types', icon: LayoutDashboard },
    { to: '/meetings', label: 'Meetings', icon: CalendarDays },
    { to: '/availability', label: 'Availability', icon: Settings },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-brand-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-200">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white transition-colors">Slotify</span>
            </Link>
            
            <div className="hidden sm:flex space-x-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive 
                        ? 'bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300' 
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={20} className="animate-fade-in" /> : <Moon size={20} className="animate-fade-in" />}
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-violet-400 border-2 border-white dark:border-slate-700 shadow-sm" />
          </div>
        </div>
      </div>
    </nav>
  );
}
