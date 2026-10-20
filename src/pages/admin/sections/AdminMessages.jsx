import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import {
  SectionHeader, AdminCard, SubmitButton, AlertMsg, Spinner, EmptyState, ConfirmDialog
} from '../../../components/admin/AdminUI';
import { FaEnvelope, FaTrash, FaEye, FaCheck } from 'react-icons/fa';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [confirmId, setConfirmId] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 4000);
  };

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('contact_messages').select('*').order('created_at', { ascending: false });
    if (error) showAlert('error', error.message);
    else setMessages(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const markRead = async (id) => {
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
  };

  const handleExpand = (msg) => {
    setExpanded(expanded === msg.id ? null : msg.id);
    if (!msg.is_read) markRead(msg.id);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await supabase.from('contact_messages').delete().eq('id', confirmId);
    if (error) showAlert('error', 'Delete failed: ' + error.message);
    else { showAlert('success', 'Message deleted.'); await fetchData(); }
    setConfirmId(null);
    setDeleting(false);
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  if (loading) return <Spinner text="Loading messages..." />;

  return (
    <div>
      <SectionHeader
        title="Contact Messages"
        subtitle={`${messages.length} total · ${unreadCount} unread`}
      />
      <AlertMsg type={alert.type} message={alert.message} onDismiss={() => setAlert({ type: '', message: '' })} />

      {messages.length === 0 ? (
        <EmptyState icon={<FaEnvelope />} title="No messages yet" subtitle="Messages from your contact form will appear here." />
      ) : (
        <div className="space-y-3">
          {messages.map(msg => (
            <AdminCard
              key={msg.id}
              className={`cursor-pointer transition-all ${!msg.is_read ? 'border-purple-700' : ''}`}
            >
              <div className="flex items-start justify-between" onClick={() => handleExpand(msg)}>
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!msg.is_read ? 'bg-purple-500' : 'bg-gray-700'}`} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-semibold text-sm">{msg.name}</span>
                      <span className="text-gray-500 text-xs">{msg.email}</span>
                      {!msg.is_read && (
                        <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">New</span>
                      )}
                    </div>
                    {msg.subject && <p className="text-gray-400 text-xs mt-0.5">{msg.subject}</p>}
                    {expanded !== msg.id && (
                      <p className="text-gray-500 text-xs mt-1 line-clamp-1">{msg.message}</p>
                    )}
                    <p className="text-gray-700 text-xs mt-1">
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0 ml-2" onClick={e => e.stopPropagation()}>
                  {!msg.is_read && (
                    <button
                      onClick={() => markRead(msg.id)}
                      className="p-2 text-gray-400 hover:text-green-400"
                      title="Mark as read"
                    ><FaCheck /></button>
                  )}
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Your message'}`}
                    className="p-2 text-gray-400 hover:text-blue-400"
                    title="Reply"
                  ><FaEnvelope /></a>
                  <button onClick={() => setConfirmId(msg.id)} className="p-2 text-gray-400 hover:text-red-400"><FaTrash /></button>
                </div>
              </div>

              {/* Expanded message */}
              {expanded === msg.id && (
                <div className="mt-4 pl-5 border-t border-gray-800 pt-4">
                  <p className="text-gray-300 text-sm whitespace-pre-wrap">{msg.message}</p>
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Your message'}`}
                    className="inline-flex items-center gap-2 mt-3 text-sm text-purple-400 hover:text-purple-300 transition"
                  >
                    <FaEnvelope /> Reply to {msg.email}
                  </a>
                </div>
              )}
            </AdminCard>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!confirmId} title="Delete Message" message="Permanently delete this message?" onConfirm={handleDelete} onCancel={() => setConfirmId(null)} loading={deleting} />
    </div>
  );
};

export default AdminMessages;
