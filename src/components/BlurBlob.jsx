// components/BlurBlob.jsx
import React from 'react';

const BlurBlob = ({ position = {}, size = {} }) => {
  const { top = '35%', left = '20%' } = position;
  const { width = '30%', height = '40%' } = size;

  return (
    <div
      className="absolute"
      style={{
        top,
        left,
        width,
        height,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="w-full h-full bg-purple-500 rounded-full opacity-20 blur-3xl animate-blob"></div>
    </div>
  );
};

export default BlurBlob;
