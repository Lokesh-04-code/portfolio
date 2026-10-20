import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import {
  SectionHeader, AdminCard, FormInput, FormSelect,
  SubmitButton, AlertMsg, Spinner, EmptyState, ConfirmDialog
} from '../../../components/admin/AdminUI';
import { FaPlus, FaEdit, FaTrash, FaTools } from 'react-icons/fa';

const CATEGORIES = ['Frontend', 'Backend', 'Languages', 'Tools', 'Others'];

const EMPTY_SKILL = { name: '', category: 'Frontend', logo_url: '', display_order: 0 };

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [form, setForm] = useState(EMPTY_SKILL);
  const [editing, setEditing] = useState(null); // skill id being edited
  const [confirmId, setConfirmId] = useState(null);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 4000);
  };

  const fetchSkills = async () => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category')
      .order('display_order');
    if (error) showAlert('error', error.message);
    else setSkills(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchSkills(); }, []);

  const handleChange = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleEdit = (skill) => {
    setEditing(skill.id);
    setForm({
      name: skill.name,
      category: skill.category,
      logo_url: skill.logo_url || '',
      display_order: skill.display_order,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditing(null);
    setForm(EMPTY_SKILL);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      category: form.category,
      logo_url: form.logo_url.trim() || null,
      display_order: parseInt(form.display_order) || 0,
    };

    let error;
    if (editing) {
      ({ error } = await supabase.from('skills').update(payload).eq('id', editing));
    } else {
      ({ error } = await supabase.from('skills').insert([payload]));
    }

    if (error) {
      showAlert('error', 'Save failed: ' + error.message);
    } else {
      showAlert('success', editing ? 'Skill updated!' : 'Skill added!');
      handleCancel();
      await fetchSkills();
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await supabase.from('skills').delete().eq('id', confirmId);
    if (error) showAlert('error', 'Delete failed: ' + error.message);
    else {
      showAlert('success', 'Skill deleted.');
      await fetchSkills();
    }
    setConfirmId(null);
    setDeleting(false);
  };

  // Group by category
  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat);
    return acc;
  }, {});

  if (loading) return <Spinner text="Loading skills..." />;

  return (
    <div>
      <SectionHeader title="Skills" subtitle="Manage your technical skills by category" />
      <AlertMsg type={alert.type} message={alert.message} onDismiss={() => setAlert({ type: '', message: '' })} />

      {/* Form */}
      <AdminCard className="mb-8">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          {editing ? <FaEdit /> : <FaPlus />}
          {editing ? 'Edit Skill' : 'Add New Skill'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <FormInput
              label="Skill Name" id="skill-name" value={form.name}
              onChange={handleChange('name')} placeholder="React JS" required
            />
            <FormSelect label="Category" id="skill-cat" value={form.category} onChange={handleChange('category')}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </FormSelect>
            <FormInput
              label="Logo URL (optional)" id="skill-logo" value={form.logo_url}
              onChange={handleChange('logo_url')} placeholder="https://..."
            />
            <FormInput
              label="Display Order" id="skill-order" type="number" value={form.display_order}
              onChange={handleChange('display_order')} placeholder="0"
            />
          </div>
          <div className="flex gap-3">
            <SubmitButton loading={saving}>{editing ? 'Update Skill' : 'Add Skill'}</SubmitButton>
            {editing && (
              <SubmitButton type="button" variant="ghost" loading={false} onClick={handleCancel}>Cancel</SubmitButton>
            )}
          </div>
        </form>
      </AdminCard>

      {/* Skills by category */}
      {skills.length === 0 ? (
        <EmptyState icon={<FaTools />} title="No skills yet" subtitle="Add your first skill using the form above." />
      ) : (
        <div className="space-y-6">
          {CATEGORIES.map(cat => grouped[cat].length > 0 && (
            <AdminCard key={cat}>
              <h3 className="text-purple-400 font-semibold mb-4">{cat}</h3>
              <div className="space-y-2">
                {grouped[cat].map(skill => (
                  <div key={skill.id} className="flex items-center justify-between bg-gray-800 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      {skill.logo_url && (
                        <img src={skill.logo_url} alt={skill.name} className="w-6 h-6 object-contain" />
                      )}
                      <span className="text-white text-sm font-medium">{skill.name}</span>
                      <span className="text-gray-600 text-xs">#{skill.display_order}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="p-2 text-gray-400 hover:text-purple-400 transition"
                      ><FaEdit /></button>
                      <button
                        onClick={() => setConfirmId(skill.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition"
                      ><FaTrash /></button>
                    </div>
                  </div>
                ))}
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmId}
        title="Delete Skill"
        message="Are you sure you want to delete this skill? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        loading={deleting}
      />
    </div>
  );
};

export default AdminSkills;
