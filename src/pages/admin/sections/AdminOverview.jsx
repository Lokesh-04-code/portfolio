import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext';
import { SectionHeader, Spinner } from '../../../components/admin/AdminUI';
import {
  FaTools, FaBriefcase, FaGraduationCap, FaProjectDiagram,
  FaEnvelope, FaUser, FaChevronRight
} from 'react-icons/fa';

const statConfig = [
  { key: 'skills', label: 'Skills', icon: <FaTools />, to: '/admin/skills', color: 'text-blue-400' },
  { key: 'experience', label: 'Experience', icon: <FaBriefcase />, to: '/admin/experience', color: 'text-green-400' },
  { key: 'education', label: 'Education', icon: <FaGraduationCap />, to: '/admin/education', color: 'text-yellow-400' },
  { key: 'projects', label: 'Projects', icon: <FaProjectDiagram />, to: '/admin/projects', color: 'text-purple-400' },
  { key: 'messages', label: 'Messages', icon: <FaEnvelope />, to: '/admin/messages', color: 'text-pink-400' },
];

const AdminOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const tables = ['skills', 'experience', 'education', 'projects', 'contact_messages'];
      const results = await Promise.all(
        tables.map(t =>
          supabase.from(t).select('*', { count: 'exact', head: true })
        )
      );
      const newStats = {};
      tables.forEach((t, i) => {
        const key = t === 'contact_messages' ? 'messages' : t;
        newStats[key] = results[i].count ?? 0;
      });
      setStats(newStats);

      const { count } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
      setUnread(count ?? 0);
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <Spinner text="Loading dashboard..." />;

  return (
    <div>
      <SectionHeader
        title={`Welcome back! 👋`}
        subtitle={`Logged in as ${user?.email}`}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statConfig.map(({ key, label, icon, to, color }) => (
          <Link
            key={key}
            to={to}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-purple-600 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`text-2xl ${color}`}>{icon}</span>
              <FaChevronRight className="text-gray-600 group-hover:text-purple-400 transition-colors" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats[key] ?? 0}
              {key === 'messages' && unread > 0 && (
                <span className="ml-2 text-sm bg-purple-600 text-white px-2 py-0.5 rounded-full">
                  {unread} new
                </span>
              )}
            </div>
            <div className="text-gray-400 text-sm">{label}</div>
          </Link>
        ))}

        {/* Profile card */}
        <Link
          to="/admin/profile"
          className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-purple-600 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl text-orange-400"><FaUser /></span>
            <FaChevronRight className="text-gray-600 group-hover:text-purple-400 transition-colors" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">1</div>
          <div className="text-gray-400 text-sm">Profile</div>
        </Link>
      </div>

      {/* Quick links */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Edit Profile', to: '/admin/profile' },
            { label: 'Add Project', to: '/admin/projects' },
            { label: 'Add Skill', to: '/admin/skills' },
            { label: 'Add Experience', to: '/admin/experience' },
            { label: 'Add Education', to: '/admin/education' },
            { label: 'View Messages', to: '/admin/messages' },
          ].map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="text-center px-4 py-3 rounded-xl bg-gray-800 hover:bg-purple-600 text-gray-300 hover:text-white text-sm font-medium transition-all"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
