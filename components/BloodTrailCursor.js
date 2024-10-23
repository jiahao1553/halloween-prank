import React, { useState, useEffect } from 'react';

const BloodTrailCursor = () => {
  const [particles, setParticles] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Particle creation function
  const createParticle = (x, y) => {
    return {
      id: Math.random(),
      x,
      y,
      size: Math.random() * 8 + 2,
      opacity: 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: Math.random() * 2 + 1,
    };
  };

  // Update mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Add new particles occasionally
      if (Math.random() < 0.3) {
        setParticles(prev => [
          ...prev,
          createParticle(e.clientX, e.clientY)
        ].slice(-50)); // Keep only last 50 particles
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev
        .map(particle => ({
          ...particle,
          y: particle.y + particle.speedY,
          x: particle.x + particle.speedX,
          opacity: particle.opacity - 0.02,
        }))
        .filter(particle => particle.opacity > 0)
      );
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <svg className="w-full h-full">
        {particles.map(particle => (
          <g key={particle.id}>
            {/* Blood drop shape */}
            <path
              d={`M ${particle.x} ${particle.y} 
                  q ${particle.size/2} ${particle.size} ${0} ${particle.size*1.5}
                  q ${-particle.size/2} ${-particle.size/2} ${0} ${-particle.size*1.5}`}
              fill={`rgba(139, 0, 0, ${particle.opacity})`}
            />
            {/* Optional blood splatter effect */}
            <circle
              cx={particle.x}
              cy={particle.y}
              r={particle.size / 3}
              fill={`rgba(120, 0, 0, ${particle.opacity * 0.7})`}
            />
          </g>
        ))}
        
        {/* Current cursor blood drop */}
        <path
          d={`M ${mousePos.x} ${mousePos.y} 
              q 5 10 0 15 
              q -5 -5 0 -15`}
          fill="rgb(139, 0, 0)"
        />
      </svg>
    </div>
  );
};

export default BloodTrailCursor;