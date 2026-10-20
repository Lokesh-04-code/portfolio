import React from 'react';

// ── Reusable UI primitives for admin sections ─────────────────────────────────

export const AdminCard = ({ children, className = '' }) => (
  <div className={`bg-gray-900 border border-gray-800 rounded-2xl p-6 ${className}`}>
    {children}
  </div>
);

export const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-white">{title}</h2>
    {subtitle && <p className="text-gray-400 mt-1 text-sm">{subtitle}</p>}
    <div className="w-12 h-1 bg-purple-600 mt-3 rounded-full" />
  </div>
);

export const FormInput = ({ label, id, type = 'text', value, onChange, placeholder, required, className = '' }) => (
  <div className={className}>
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
    )}
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2 rounded-lg bg-[#131025] text-white border border-gray-700 focus:outline-none focus:border-purple-500 transition text-sm"
    />
  </div>
);

export const FormTextarea = ({ label, id, value, onChange, placeholder, required, rows = 4, className = '' }) => (
  <div className={className}>
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
    )}
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={rows}
      className="w-full px-3 py-2 rounded-lg bg-[#131025] text-white border border-gray-700 focus:outline-none focus:border-purple-500 transition text-sm resize-y"
    />
  </div>
);

export const FormSelect = ({ label, id, value, onChange, children, className = '' }) => (
  <div className={className}>
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
    )}
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 rounded-lg bg-[#131025] text-white border border-gray-700 focus:outline-none focus:border-purple-500 transition text-sm"
    >
      {children}
    </select>
  </div>
);

export const SubmitButton = ({ loading, children, onClick, type = 'submit', variant = 'primary', className = '' }) => {
  const base = 'px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2';
  const variants = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white',
    danger: 'bg-red-700 hover:bg-red-800 text-white',
    ghost: 'bg-gray-800 hover:bg-gray-700 text-gray-300',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};

export const AlertMsg = ({ type, message, onDismiss }) => {
  if (!message) return null;
  const styles = {
    success: 'bg-green-900 bg-opacity-40 border-green-500 text-green-300',
    error: 'bg-red-900 bg-opacity-40 border-red-500 text-red-300',
    info: 'bg-blue-900 bg-opacity-40 border-blue-500 text-blue-300',
  };
  return (
    <div className={`border rounded-lg px-4 py-3 text-sm flex items-center justify-between mb-4 ${styles[type]}`}>
      <span>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="ml-4 opacity-70 hover:opacity-100 font-bold">✕</button>
      )}
    </div>
  );
};

export const Spinner = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-4">
    <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
    <p className="text-gray-400 text-sm">{text}</p>
  </div>
);

export const EmptyState = ({ icon, title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {icon && <div className="text-5xl text-gray-700 mb-4">{icon}</div>}
    <p className="text-white font-semibold text-lg">{title}</p>
    {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
  </div>
);

export const ConfirmDialog = ({ open, title, message, onConfirm, onCancel, loading }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <SubmitButton type="button" variant="ghost" onClick={onCancel} loading={false}>
            Cancel
          </SubmitButton>
          <SubmitButton type="button" variant="danger" onClick={onConfirm} loading={loading}>
            Delete
          </SubmitButton>
        </div>
      </div>
    </div>
  );
};
