import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import {
  SectionHeader, AdminCard, FormInput, FormTextarea, FormSelect,
  SubmitButton, AlertMsg, Spinner, EmptyState, ConfirmDialog
} from '../../../components/admin/AdminUI';
import { FaPlus, FaEdit, FaTrash, FaBriefcase } from 'react-icons/fa';

const EMPTY_FORM = {
  company: '', role: '', employment_type: 'Full-time',
  start_date: '', end_date: '', is_current: false,
  description: '', skills: '', logo_url: '', display_order: 0,
};

const AdminExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 4000);
  };

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('experience').select('*').order('display_order');
    if (error) showAlert('error', error.message);
    else setExperiences(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleCheckbox = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.checked }));

  const handleEdit = (exp) => {
    setEditing(exp.id);
    setForm({
      company: exp.company,
      role: exp.role,
      employment_type: exp.employment_type || 'Full-time',
      start_date: exp.start_date,
      end_date: exp.end_date || '',
      is_current: exp.is_current || false,
      description: exp.description || '',
      skills: Array.isArray(exp.skills) ? exp.skills.join(', ') : exp.skills || '',
      logo_url: exp.logo_url || '',
      display_order: exp.display_order || 0,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => { setEditing(null); setForm(EMPTY_FORM); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const skillsArray = form.skills.split(',').map(s => s.trim()).filter(Boolean);
    const payload = {
      company: form.company.trim(),
      role: form.role.trim(),
      employment_type: form.employment_type,
      start_date: form.start_date,
      end_date: form.is_current ? null : (form.end_date || null),
      is_current: form.is_current,
      description: form.description.trim(),
      skills: skillsArray,
      logo_url: form.logo_url.trim() || null,
      display_order: parseInt(form.display_order) || 0,
    };

    let error;
    if (editing) {
      ({ error } = await supabase.from('experience').update(payload).eq('id', editing));
    } else {
      ({ error } = await supabase.from('experience').insert([payload]));
    }

    if (error) showAlert('error', 'Save failed: ' + error.message);
    else {
      showAlert('success', editing ? 'Experience updated!' : 'Experience added!');
      handleCancel();
      await fetchData();
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await supabase.from('experience').delete().eq('id', confirmId);
    if (error) showAlert('error', 'Delete failed: ' + error.message);
    else { showAlert('success', 'Deleted.'); await fetchData(); }
    setConfirmId(null);
    setDeleting(false);
  };

  if (loading) return <Spinner text="Loading experience..." />;

  return (
    <div>
      <SectionHeader title="Experience" subtitle="Manage your work experience entries" />
      <AlertMsg type={alert.type} message={alert.message} onDismiss={() => setAlert({ type: '', message: '' })} />

      {/* Form */}
      <AdminCard className="mb-8">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          {editing ? <FaEdit /> : <FaPlus />}
          {editing ? 'Edit Experience' : 'Add New Experience'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="Company / Organization" id="exp-company" value={form.company} onChange={handleChange('company')} required />
            <FormInput label="Role / Position" id="exp-role" value={form.role} onChange={handleChange('role')} required />
            <FormSelect label="Employment Type" id="exp-type" value={form.employment_type} onChange={handleChange('employment_type')}>
              {['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'].map(t =>
                <option key={t} value={t}>{t}</option>
              )}
            </FormSelect>
            <FormInput label="Display Order" id="exp-order" type="number" value={form.display_order} onChange={handleChange('display_order')} />
            <FormInput label="Start Date" id="exp-start" value={form.start_date} onChange={handleChange('start_date')} placeholder="April 2024" required />
            <div>
              <FormInput label="End Date" id="exp-end" value={form.end_date} onChange={handleChange('end_date')} placeholder="June 2024" />
              <label className="flex items-center gap-2 mt-2 text-sm text-gray-400 cursor-pointer">
                <input type="checkbox" checked={form.is_current} onChange={handleCheckbox('is_current')} className="accent-purple-600" />
                Currently working here
              </label>
            </div>
          </div>
          <FormInput label="Company Logo URL (optional)" id="exp-logo" value={form.logo_url} onChange={handleChange('logo_url')} placeholder="https://..." />
          <FormTextarea label="Description" id="exp-desc" value={form.description} onChange={handleChange('description')} rows={4} />
          <FormInput label="Skills Used (comma-separated)" id="exp-skills" value={form.skills} onChange={handleChange('skills')} placeholder="React JS, Node JS, MongoDB" />
          <div className="flex gap-3">
            <SubmitButton loading={saving}>{editing ? 'Update' : 'Add Experience'}</SubmitButton>
            {editing && <SubmitButton type="button" variant="ghost" loading={false} onClick={handleCancel}>Cancel</SubmitButton>}
          </div>
        </form>
      </AdminCard>

      {/* List */}
      {experiences.length === 0 ? (
        <EmptyState icon={<FaBriefcase />} title="No experience entries yet" subtitle="Add your first entry above." />
      ) : (
        <div className="space-y-4">
          {experiences.map(exp => (
            <AdminCard key={exp.id} className="relative">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {exp.logo_url && (
                    <img src={exp.logo_url} alt={exp.company} className="w-12 h-12 object-contain bg-white rounded-lg p-1 flex-shrink-0" />
                  )}
                  <div>
                    <h4 className="text-white font-semibold">{exp.role}</h4>
                    <p className="text-gray-400 text-sm">{exp.company} · {exp.employment_type}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {exp.start_date} — {exp.is_current ? 'Present' : (exp.end_date || '—')}
                    </p>
                    {exp.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {exp.skills.map((s, i) => (
                          <span key={i} className="bg-purple-900 bg-opacity-40 text-purple-300 text-xs px-2 py-0.5 rounded-full">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleEdit(exp)} className="p-2 text-gray-400 hover:text-purple-400"><FaEdit /></button>
                  <button onClick={() => setConfirmId(exp.id)} className="p-2 text-gray-400 hover:text-red-400"><FaTrash /></button>
                </div>
              </div>
              {exp.description && <p className="text-gray-500 text-sm mt-3 line-clamp-2">{exp.description}</p>}
            </AdminCard>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!confirmId} title="Delete Experience" message="Delete this experience entry?" onConfirm={handleDelete} onCancel={() => setConfirmId(null)} loading={deleting} />
    </div>
  );
};

export default AdminExperience;
