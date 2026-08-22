import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Superposition from './pages/Superposition';
import Profile from './pages/Profile';
import Achievements from './pages/Achievements';

const Navigation = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cosmic-dark/80 backdrop-blur-xl border-b border-white/5">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gradient hover:scale-105 transition-transform">
          ✨ Youverse
        </Link>
        <div className="flex items-center gap-1 sm:gap-4">
          <NavLink to="/" active={isActive('/')} icon="🌌" label="Home" />
          <NavLink to="/profile" active={isActive('/profile')} icon="👤" label="Profile" />
          <NavLink to="/achievements" active={isActive('/achievements')} icon="🏆" label="Achievements" />
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, active, icon, label }: { to: string; active: boolean; icon: string; label: string }) => {
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 text-sm font-medium
        ${active 
          ? 'bg-quantum-purple/20 text-quantum-purple' 
          : 'text-white/60 hover:text-white hover:bg-white/5'
        }`}
    >
      <span>{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <div className="pt-16 min-h-screen">
        <Routes>
          <Route path="/" element={<Superposition />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/achievements" element={<Achievements />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;