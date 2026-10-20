import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import {
  SectionHeader, AdminCard, FormInput, FormTextarea,
  SubmitButton, AlertMsg, Spinner
} from '../../../components/admin/AdminUI';
import { FaCloudUploadAlt, FaUser } from 'react-icons/fa';

const EMPTY_PROFILE = {
  name: '', title: '', roles: '', bio: '',
  profile_image_url: '', resume_url: '',
  github_url: '', linkedin_url: '', leetcode_url: '',
  instagram_url: '', email: '', location: '',
};

const AdminProfile = () => {
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [profileId, setProfileId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const fileRef = useRef();

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 4000);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase.from('profile').select('*').single();
      if (data) {
        setProfileId(data.id);
        setProfile({
          ...data,
          roles: Array.isArray(data.roles) ? data.roles.join(', ') : data.roles || '',
        });
      }
      if (error && error.code !== 'PGRST116') {
        showAlert('error', 'Failed to load profile: ' + error.message);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (field) => (e) => setProfile(prev => ({ ...prev, [field]: e.target.value }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return showAlert('error', 'Only JPEG, PNG, or WebP images are allowed.');
    }
    if (file.size > 5 * 1024 * 1024) {
      return showAlert('error', 'Image must be under 5 MB.');
    }
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `profile.${ext}`;
    const { error: upErr } = await supabase.storage
      .from('portfolio-images')
      .upload(fileName, file, { upsert: true });
    if (upErr) {
      showAlert('error', 'Upload failed: ' + upErr.message);
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(fileName);
    setProfile(prev => ({ ...prev, profile_image_url: urlData.publicUrl }));
    showAlert('success', 'Profile image uploaded!');
    setUploading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const rolesArray = profile.roles
      .split(',')
      .map(r => r.trim())
      .filter(Boolean);

    const payload = { ...profile, roles: rolesArray, updated_at: new Date().toISOString() };

    let error;
    if (profileId) {
      ({ error } = await supabase.from('profile').update(payload).eq('id', profileId));
    } else {
      ({ error } = await supabase.from('profile').insert([payload]));
    }

    if (error) {
      showAlert('error', 'Save failed: ' + error.message);
    } else {
      showAlert('success', 'Profile saved successfully!');
    }
    setSaving(false);
  };

  if (loading) return <Spinner text="Loading profile..." />;

  return (
    <div>
      <SectionHeader title="Profile & About" subtitle="Update your personal information and bio" />
      <AlertMsg type={alert.type} message={alert.message} onDismiss={() => setAlert({ type: '', message: '' })} />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Image */}
        <AdminCard>
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><FaUser /> Profile Image</h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full border-4 border-purple-700 overflow-hidden bg-gray-800 flex items-center justify-center flex-shrink-0">
              {profile.profile_image_url ? (
                <img src={profile.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <FaUser className="text-gray-600 text-3xl" />
              )}
            </div>
            <div className="flex-1 space-y-2 w-full">
              <FormInput
                label="Profile Image URL"
                id="profile_image_url"
                value={profile.profile_image_url}
                onChange={handleChange('profile_image_url')}
                placeholder="https://... or upload below"
              />
              <div className="flex items-center gap-3">
                <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                <SubmitButton
                  type="button"
                  variant="ghost"
                  loading={uploading}
                  onClick={() => fileRef.current.click()}
                >
                  <FaCloudUploadAlt /> {uploading ? 'Uploading...' : 'Upload Image'}
                </SubmitButton>
                <span className="text-gray-500 text-xs">Max 5 MB · JPG/PNG/WebP</span>
              </div>
            </div>
          </div>
        </AdminCard>

        {/* Basic Info */}
        <AdminCard>
          <h3 className="text-white font-semibold mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Full Name" id="name" value={profile.name} onChange={handleChange('name')} required />
            <FormInput label="Professional Title" id="title" value={profile.title} onChange={handleChange('title')} required />
            <FormInput label="Typing Roles (comma-separated)" id="roles" value={profile.roles} onChange={handleChange('roles')} placeholder="Fullstack Developer, ML Developer, Coder" className="md:col-span-2" />
            <FormInput label="Email" id="email" type="email" value={profile.email} onChange={handleChange('email')} />
            <FormInput label="Location" id="location" value={profile.location || ''} onChange={handleChange('location')} placeholder="City, Country" />
          </div>
          <div className="mt-4">
            <FormTextarea label="Bio / About Me" id="bio" value={profile.bio} onChange={handleChange('bio')} rows={5} required />
          </div>
        </AdminCard>

        {/* Links */}
        <AdminCard>
          <h3 className="text-white font-semibold mb-4">Links & Social</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Resume URL" id="resume_url" value={profile.resume_url || ''} onChange={handleChange('resume_url')} placeholder="https://drive.google.com/..." />
            <FormInput label="GitHub URL" id="github_url" value={profile.github_url || ''} onChange={handleChange('github_url')} placeholder="https://github.com/..." />
            <FormInput label="LinkedIn URL" id="linkedin_url" value={profile.linkedin_url || ''} onChange={handleChange('linkedin_url')} placeholder="https://linkedin.com/in/..." />
            <FormInput label="LeetCode URL" id="leetcode_url" value={profile.leetcode_url || ''} onChange={handleChange('leetcode_url')} placeholder="https://leetcode.com/..." />
            <FormInput label="Instagram URL" id="instagram_url" value={profile.instagram_url || ''} onChange={handleChange('instagram_url')} placeholder="https://instagram.com/..." />
          </div>
        </AdminCard>

        <div className="flex justify-end">
          <SubmitButton loading={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </SubmitButton>
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;
