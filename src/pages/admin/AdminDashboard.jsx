import React, { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaHome, FaUser, FaTools, FaBriefcase, FaGraduationCap,
  FaProjectDiagram, FaEnvelope, FaBars, FaTimes, FaSignOutAlt, FaExternalLinkAlt
} from 'react-icons/fa';
import AdminOverview from './sections/AdminOverview';
import AdminProfile from './sections/AdminProfile';
import AdminSkills from './sections/AdminSkills';
import AdminExperience from './sections/AdminExperience';
import AdminEducation from './sections/AdminEducation';
import AdminProjects from './sections/AdminProjects';
import AdminMessages from './sections/AdminMessages';

const navItems = [
  { to: '/admin', label: 'Overview', icon: <FaHome />, end: true },
  { to: '/admin/profile', label: 'Profile & About', icon: <FaUser /> },
  { to: '/admin/skills', label: 'Skills', icon: <FaTools /> },
  { to: '/admin/experience', label: 'Experience', icon: <FaBriefcase /> },
  { to: '/admin/education', label: 'Education', icon: <FaGraduationCap /> },
  { to: '/admin/projects', label: 'Projects', icon: <FaProjectDiagram /> },
  { to: '/admin/messages', label: 'Messages', icon: <FaEnvelope /> },
];

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-[#050414] flex">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-30 transform transition-transform duration-300 flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-white">
              <span className="text-[#8245ec]">&lt;</span>
              Admin
              <span className="text-[#8245ec]">&gt;</span>
            </h1>
            <button onClick={() => setSidebarOpen(false)} className="text-gray-400 lg:hidden">
              <FaTimes />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1 truncate">{user?.email}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
          >
            <FaExternalLinkAlt />
            View Portfolio
          </a>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-900 hover:bg-opacity-30 hover:text-red-300 transition-all"
          >
            <FaSignOutAlt />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-300 hover:text-white"
          >
            <FaBars size={20} />
          </button>
          <span className="text-white font-bold">
            <span className="text-[#8245ec]">&lt;</span>Admin<span className="text-[#8245ec]">&gt;</span>
          </span>
          <button onClick={handleSignOut} className="text-red-400 hover:text-red-300">
            <FaSignOutAlt />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="skills" element={<AdminSkills />} />
            <Route path="experience" element={<AdminExperience />} />
            <Route path="education" element={<AdminEducation />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="messages" element={<AdminMessages />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
