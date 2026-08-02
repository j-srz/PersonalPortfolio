import { useEffect, useState } from 'react';

export default function ClickEffects() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const handleClick = (e) => {
      const container = document.getElementById('scroll-container');
      const scrollY = container ? container.scrollTop : 0;
      const scrollX = container ? container.scrollLeft : 0;
      
      const clickX = Math.round((e.clientX + scrollX) / 12) * 12;
      const clickY = Math.round((e.clientY + scrollY) / 12) * 12;
      const explosionId = Date.now();
      
      const newParticles = [];
      // Generar entre 20 y 35 píxeles al azar por cada clic
      const numParticles = Math.floor(Math.random() * 15) + 20; 
      
      for (let i = 0; i < numParticles; i++) {
        // Dispersión aleatoria
        const dx = Math.floor(Math.random() * 13) - 6; 
        const dy = Math.floor(Math.random() * 13) - 6;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Limitar la dispersión a un círculo perfecto en lugar de un cuadrado
        if (dist > 6) {
          i--; // Reintentar si cae fuera del círculo
          continue; 
        }
        
        // Píxeles más cercanos brillan mucho más (1.0). Píxeles lejanos brillan menos.
        let intensity = 1 - (dist / 7);
        if (intensity < 0.15) intensity = 0.15;
        
        // Pequeño retraso basado en la distancia para que parezca una onda expansiva
        const delay = dist * 25; 
        
        newParticles.push({
          id: `${explosionId}-${i}`,
          x: clickX + dx * 12,
          y: clickY + dy * 12,
          intensity,
          delay,
          isFlash: false,
        });
      }

      // Añadir siempre un píxel central súper brillante
      newParticles.push({
        id: `${explosionId}-center`,
        x: clickX,
        y: clickY,
        intensity: 1.2,
        delay: 0,
        isFlash: false,
      });

      setParticles((prev) => [...prev, ...newParticles]);

      // Limpiar los píxeles del DOM después de 800ms
      setTimeout(() => {
        setParticles((prev) => prev.filter(p => !p.id.startsWith(explosionId.toString())));
      }, 800);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-[400vh] pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => {
        return (
          <div
            key={p.id}
            className="absolute w-[10px] h-[10px] bg-[#ffffff]"
            style={{
              left: p.x + 1, 
              top: p.y + 1,
              opacity: 0,
              boxShadow: `
                0 0 6px 1px rgba(255, 255, 255, ${0.7 * p.intensity}), 
                0 0 20px 5px rgba(255, 34, 34, ${0.4 * p.intensity}),
                0 0 50px 20px rgba(255, 34, 34, ${0.1 * p.intensity})
              `,
              animation: `pixelFlash 0.5s step-end forwards ${p.delay}ms`
            }}
          />
        );
      })}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pixelFlash {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          30% {
            opacity: 0.8;
            transform: scale(1);
          }
          60% {
            opacity: 0.4;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0);
          }
        }
      `}} />
    </div>
  );
}
