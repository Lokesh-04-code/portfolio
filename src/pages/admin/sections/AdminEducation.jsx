import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import {
  SectionHeader, AdminCard, FormInput, FormTextarea,
  SubmitButton, AlertMsg, Spinner, EmptyState, ConfirmDialog
} from '../../../components/admin/AdminUI';
import { FaPlus, FaEdit, FaTrash, FaGraduationCap } from 'react-icons/fa';

const EMPTY_FORM = {
  institution: '', degree: '', field_of_study: '',
  start_date: '', end_date: '', grade: '',
  description: '', logo_url: '', display_order: 0,
};

const AdminEducation = () => {
  const [educations, setEducations] = useState([]);
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
      .from('education').select('*').order('display_order');
    if (error) showAlert('error', error.message);
    else setEducations(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleEdit = (edu) => {
    setEditing(edu.id);
    setForm({
      institution: edu.institution,
      degree: edu.degree,
      field_of_study: edu.field_of_study || '',
      start_date: edu.start_date,
      end_date: edu.end_date || '',
      grade: edu.grade || '',
      description: edu.description || '',
      logo_url: edu.logo_url || '',
      display_order: edu.display_order || 0,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => { setEditing(null); setForm(EMPTY_FORM); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      institution: form.institution.trim(),
      degree: form.degree.trim(),
      field_of_study: form.field_of_study.trim() || null,
      start_date: form.start_date.trim(),
      end_date: form.end_date.trim() || null,
      grade: form.grade.trim() || null,
      description: form.description.trim() || null,
      logo_url: form.logo_url.trim() || null,
      display_order: parseInt(form.display_order) || 0,
    };

    let error;
    if (editing) {
      ({ error } = await supabase.from('education').update(payload).eq('id', editing));
    } else {
      ({ error } = await supabase.from('education').insert([payload]));
    }

    if (error) showAlert('error', 'Save failed: ' + error.message);
    else {
      showAlert('success', editing ? 'Education updated!' : 'Education added!');
      handleCancel();
      await fetchData();
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await supabase.from('education').delete().eq('id', confirmId);
    if (error) showAlert('error', 'Delete failed: ' + error.message);
    else { showAlert('success', 'Deleted.'); await fetchData(); }
    setConfirmId(null);
    setDeleting(false);
  };

  if (loading) return <Spinner text="Loading education..." />;

  return (
    <div>
      <SectionHeader title="Education" subtitle="Manage your academic background" />
      <AlertMsg type={alert.type} message={alert.message} onDismiss={() => setAlert({ type: '', message: '' })} />

      {/* Form */}
      <AdminCard className="mb-8">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          {editing ? <FaEdit /> : <FaPlus />}
          {editing ? 'Edit Education' : 'Add New Education'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="Institution / School" id="edu-inst" value={form.institution} onChange={handleChange('institution')} required />
            <FormInput label="Degree / Certificate" id="edu-degree" value={form.degree} onChange={handleChange('degree')} required />
            <FormInput label="Field of Study" id="edu-field" value={form.field_of_study} onChange={handleChange('field_of_study')} placeholder="Computer Science" />
            <FormInput label="Grade / CGPA" id="edu-grade" value={form.grade} onChange={handleChange('grade')} placeholder="9.15 / A+ / 98%" />
            <FormInput label="Start Date" id="edu-start" value={form.start_date} onChange={handleChange('start_date')} placeholder="August 2023" required />
            <FormInput label="End Date" id="edu-end" value={form.end_date} onChange={handleChange('end_date')} placeholder="March 2027 (or Ongoing)" />
            <FormInput label="Institution Logo URL (optional)" id="edu-logo" value={form.logo_url} onChange={handleChange('logo_url')} placeholder="https://..." className="sm:col-span-2" />
            <FormInput label="Display Order" id="edu-order" type="number" value={form.display_order} onChange={handleChange('display_order')} />
          </div>
          <FormTextarea label="Description" id="edu-desc" value={form.description} onChange={handleChange('description')} rows={4} />
          <div className="flex gap-3">
            <SubmitButton loading={saving}>{editing ? 'Update' : 'Add Education'}</SubmitButton>
            {editing && <SubmitButton type="button" variant="ghost" loading={false} onClick={handleCancel}>Cancel</SubmitButton>}
          </div>
        </form>
      </AdminCard>

      {/* List */}
      {educations.length === 0 ? (
        <EmptyState icon={<FaGraduationCap />} title="No education entries yet" subtitle="Add your academic history above." />
      ) : (
        <div className="space-y-4">
          {educations.map(edu => (
            <AdminCard key={edu.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {edu.logo_url && (
                    <img src={edu.logo_url} alt={edu.institution} className="w-14 h-10 object-contain bg-white rounded-lg p-1 flex-shrink-0" />
                  )}
                  <div>
                    <h4 className="text-white font-semibold">{edu.degree}</h4>
                    <p className="text-gray-400 text-sm">{edu.institution}</p>
                    {edu.field_of_study && <p className="text-gray-500 text-xs">{edu.field_of_study}</p>}
                    <p className="text-gray-500 text-xs mt-1">
                      {edu.start_date} — {edu.end_date || 'Present'} {edu.grade && `· ${edu.grade}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleEdit(edu)} className="p-2 text-gray-400 hover:text-purple-400"><FaEdit /></button>
                  <button onClick={() => setConfirmId(edu.id)} className="p-2 text-gray-400 hover:text-red-400"><FaTrash /></button>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!confirmId} title="Delete Education" message="Delete this education entry?" onConfirm={handleDelete} onCancel={() => setConfirmId(null)} loading={deleting} />
    </div>
  );
};

export default AdminEducation;
