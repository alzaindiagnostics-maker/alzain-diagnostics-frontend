import React from 'react';
import ShaderBackground from './ShaderBackground';

export default function MedicalHeroBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {/* GLSL Raymarching WebGL 3D DNA Shader */}
      <ShaderBackground />

      {/* Dark/Transparent Readability Overlay to keep diagnostic center branding & text 100% readable */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(10, 25, 47, 0.72) 0%, rgba(15, 23, 42, 0.48) 65%, rgba(15, 23, 42, 0.78) 100%)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />
    </div>
  );
}

