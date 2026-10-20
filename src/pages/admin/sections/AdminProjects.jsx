import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import {
  SectionHeader, AdminCard, FormInput, FormTextarea,
  SubmitButton, AlertMsg, Spinner, EmptyState, ConfirmDialog
} from '../../../components/admin/AdminUI';
import { FaPlus, FaEdit, FaTrash, FaProjectDiagram, FaCloudUploadAlt, FaStar } from 'react-icons/fa';

const EMPTY_FORM = {
  title: '', description: '', tags: '', image_url: '',
  github_url: '', live_url: '', is_featured: false, display_order: 0,
};

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const fileRef = useRef();

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 4000);
  };

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('projects').select('*').order('display_order');
    if (error) showAlert('error', error.message);
    else setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleCheckbox = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.checked }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      return showAlert('error', 'Only image files are allowed.');
    }
    if (file.size > 5 * 1024 * 1024) return showAlert('error', 'Image must be under 5 MB.');
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `projects/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from('portfolio-images').upload(fileName, file, { upsert: false });
    if (upErr) { showAlert('error', 'Upload failed: ' + upErr.message); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('portfolio-images').getPublicUrl(fileName);
    setForm(prev => ({ ...prev, image_url: urlData.publicUrl }));
    showAlert('success', 'Image uploaded!');
    setUploading(false);
  };

  const handleEdit = (proj) => {
    setEditing(proj.id);
    setForm({
      title: proj.title,
      description: proj.description || '',
      tags: Array.isArray(proj.tags) ? proj.tags.join(', ') : proj.tags || '',
      image_url: proj.image_url || '',
      github_url: proj.github_url || '',
      live_url: proj.live_url || '',
      is_featured: proj.is_featured || false,
      display_order: proj.display_order || 0,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => { setEditing(null); setForm(EMPTY_FORM); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const tagsArray = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      tags: tagsArray,
      image_url: form.image_url.trim() || null,
      github_url: form.github_url.trim() || null,
      live_url: form.live_url.trim() || null,
      is_featured: form.is_featured,
      display_order: parseInt(form.display_order) || 0,
    };

    let error;
    if (editing) {
      ({ error } = await supabase.from('projects').update(payload).eq('id', editing));
    } else {
      ({ error } = await supabase.from('projects').insert([payload]));
    }

    if (error) showAlert('error', 'Save failed: ' + error.message);
    else {
      showAlert('success', editing ? 'Project updated!' : 'Project added!');
      handleCancel();
      await fetchData();
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await supabase.from('projects').delete().eq('id', confirmId);
    if (error) showAlert('error', 'Delete failed: ' + error.message);
    else { showAlert('success', 'Deleted.'); await fetchData(); }
    setConfirmId(null);
    setDeleting(false);
  };

  if (loading) return <Spinner text="Loading projects..." />;

  return (
    <div>
      <SectionHeader title="Projects" subtitle="Manage your portfolio projects" />
      <AlertMsg type={alert.type} message={alert.message} onDismiss={() => setAlert({ type: '', message: '' })} />

      {/* Form */}
      <AdminCard className="mb-8">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          {editing ? <FaEdit /> : <FaPlus />}
          {editing ? 'Edit Project' : 'Add New Project'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="Project Title" id="proj-title" value={form.title} onChange={handleChange('title')} required className="sm:col-span-2" />
          </div>
          <FormTextarea label="Description" id="proj-desc" value={form.description} onChange={handleChange('description')} rows={4} />
          <FormInput label="Tags / Technologies (comma-separated)" id="proj-tags" value={form.tags} onChange={handleChange('tags')} placeholder="React JS, Node JS, MongoDB" />

          {/* Image */}
          <div className="space-y-2">
            <FormInput label="Project Image URL" id="proj-img" value={form.image_url} onChange={handleChange('image_url')} placeholder="https://... or upload below" />
            {form.image_url && (
              <img src={form.image_url} alt="Preview" className="w-full max-w-xs h-32 object-cover rounded-lg border border-gray-700" />
            )}
            <div className="flex items-center gap-3">
              <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              <SubmitButton type="button" variant="ghost" loading={uploading} onClick={() => fileRef.current.click()}>
                <FaCloudUploadAlt /> {uploading ? 'Uploading...' : 'Upload Image'}
              </SubmitButton>
              <span className="text-gray-500 text-xs">Max 5 MB</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="GitHub URL" id="proj-github" value={form.github_url} onChange={handleChange('github_url')} placeholder="https://github.com/..." />
            <FormInput label="Live Demo URL" id="proj-live" value={form.live_url} onChange={handleChange('live_url')} placeholder="https://..." />
            <FormInput label="Display Order" id="proj-order" type="number" value={form.display_order} onChange={handleChange('display_order')} />
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" id="proj-featured" checked={form.is_featured} onChange={handleCheckbox('is_featured')} className="accent-purple-600 w-4 h-4" />
              <label htmlFor="proj-featured" className="text-sm text-gray-300 cursor-pointer flex items-center gap-1">
                <FaStar className="text-yellow-400" /> Featured Project
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <SubmitButton loading={saving}>{editing ? 'Update Project' : 'Add Project'}</SubmitButton>
            {editing && <SubmitButton type="button" variant="ghost" loading={false} onClick={handleCancel}>Cancel</SubmitButton>}
          </div>
        </form>
      </AdminCard>

      {/* List */}
      {projects.length === 0 ? (
        <EmptyState icon={<FaProjectDiagram />} title="No projects yet" subtitle="Add your first project above." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(proj => (
            <AdminCard key={proj.id} className="flex flex-col">
              {proj.image_url && (
                <img src={proj.image_url} alt={proj.title} className="w-full h-36 object-cover rounded-xl mb-4" />
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-white font-semibold flex items-center gap-1">
                      {proj.title}
                      {proj.is_featured && <FaStar className="text-yellow-400 text-xs" />}
                    </h4>
                    <p className="text-gray-500 text-xs mt-1 line-clamp-2">{proj.description}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => handleEdit(proj)} className="p-2 text-gray-400 hover:text-purple-400"><FaEdit /></button>
                    <button onClick={() => setConfirmId(proj.id)} className="p-2 text-gray-400 hover:text-red-400"><FaTrash /></button>
                  </div>
                </div>
                {proj.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {proj.tags.map((t, i) => (
                      <span key={i} className="bg-purple-900 bg-opacity-40 text-purple-300 text-xs px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!confirmId} title="Delete Project" message="Delete this project?" onConfirm={handleDelete} onCancel={() => setConfirmId(null)} loading={deleting} />
    </div>
  );
};

export default AdminProjects;
