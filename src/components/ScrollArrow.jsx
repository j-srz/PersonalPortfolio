import { useState, useEffect, useRef } from 'react';

const emptyRow = [0, 0, 0, 0, 0, 0, 0];
const s0 = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]
];
const s1 = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]
];
const s2 = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0]
];
const s3 = [
  [1, 1, 0, 0, 0, 1, 1],
  [0, 1, 1, 0, 1, 1, 0],
  [0, 0, 1, 1, 1, 0, 0]
];

const arrowStates = [s0, s1, s2, s3];

// Construimos los 10 frames (0 al 9)
const ARROW_FRAMES = [];
for (let i = 0; i <= 9; i++) {
  // Cuántos estados tiene cada flecha (0 a 3) dependiendo del frame
  const a1 = Math.min(3, Math.max(0, i));
  const a2 = Math.min(3, Math.max(0, i - 3));
  const a3 = Math.min(3, Math.max(0, i - 6));
  
  const matrix = [
    ...arrowStates[a1],
    emptyRow,
    ...arrowStates[a2],
    emptyRow,
    ...arrowStates[a3]
  ];
  
  ARROW_FRAMES.push({
    matrix,
    color: i === 0 ? 'transparent' : '#ffffff',
    shadow: i === 0 ? 'none' : '0 0 6px 1px rgba(255, 255, 255, 0.7), 0 0 16px 5px rgba(255, 34, 34, 0.4)'
  });
}


export default function ScrollArrow() {
  const [frameIndex, setFrameIndex] = useState(0);
  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  const lastScrollRef = useRef(0);

  // 1. Alinear perfectamente la flecha con la cuadrícula de 12px global
  useEffect(() => {
    const handleResize = () => {
      const arrowWidth = 7 * 12;
      const arrowHeight = 11 * 12;

      
      const targetX = window.innerWidth / 2 - arrowWidth / 2;
      const targetY = window.innerHeight - arrowHeight + 24; // Empujado más abajo (2 bloques por debajo del borde visible inicial)

      setPos({
        x: Math.floor(targetX / 12) * 12,
        y: Math.floor(targetY / 12) * 12
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Leer el scroll nativo del contenedor
  useEffect(() => {
    const container = document.getElementById('scroll-container') || window;
    
    const handleScroll = () => {
      const currentScroll = Math.max(0, container.scrollTop || window.scrollY || 0);
      const isScrollingDown = currentScroll > lastScrollRef.current;
      lastScrollRef.current = currentScroll;
      
      const vh = window.innerHeight;
      const progress = currentScroll / vh;
      
      let fIndex = 0;
      
      if (!isScrollingDown && currentScroll > 0) {
        // Al volver hacia arriba, no se muestran
        fIndex = 0;
      } else {
        if (progress < 0.02) fIndex = 0;
        else if (progress < 0.04) fIndex = 1;
        else if (progress < 0.06) fIndex = 2;
        else if (progress < 0.10) fIndex = 3;  // Flecha 1 completa (fácil)
        else if (progress < 0.14) fIndex = 4;
        else if (progress < 0.18) fIndex = 5;
        else if (progress < 0.25) fIndex = 6;  // Flecha 2 completa (medio)
        else if (progress < 0.32) fIndex = 7;
        else if (progress < 0.40) fIndex = 8;
        else if (progress < 0.95) fIndex = 9;  // Flecha 3 completa (se mantiene encendida hasta casi llegar a la sig. sección)
        else fIndex = 0;                       // Se apagan completamente al llegar a la siguiente sección
      }

      setFrameIndex(fIndex);
      const opacity = fIndex === 0 ? 0 : 0.05 + (fIndex / 9) * 0.4;

      // Enviar las posiciones y opacidades al grid global para 3 luces dinámicas
      if (pos.x !== -9999) {
        document.documentElement.style.setProperty('--arrow-x', `${pos.x + 42}px`);
        
        // Flecha 1
        const op1 = fIndex >= 1 ? (fIndex >= 3 ? 0.3 : 0.15) : 0;
        document.documentElement.style.setProperty('--arrow-y-1', `${pos.y + 18}px`);
        document.documentElement.style.setProperty('--arrow-opacity-1', op1);

        // Flecha 2
        const op2 = fIndex >= 4 ? (fIndex >= 6 ? 0.3 : 0.15) : 0;
        document.documentElement.style.setProperty('--arrow-y-2', `${pos.y + 66}px`);
        document.documentElement.style.setProperty('--arrow-opacity-2', op2);

        // Flecha 3
        const op3 = fIndex >= 7 ? (fIndex >= 9 ? 0.3 : 0.15) : 0;
        document.documentElement.style.setProperty('--arrow-y-3', `${pos.y + 114}px`);
        document.documentElement.style.setProperty('--arrow-opacity-3', op3);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => container.removeEventListener('scroll', handleScroll);
  }, [pos]); // Depende de pos para actualizar las variables cuando se define la posición

  if (pos.x === -9999) return null;

  const currentFrame = ARROW_FRAMES[frameIndex];

  return (
    <div 
      className="absolute pointer-events-none z-20 flex justify-center items-center"
      style={{ left: `${pos.x}px`, top: `${pos.y}px`, width: `${7 * 12}px`, height: `${11 * 12}px` }}
    >
      {/* Renderizamos solo la forma de los píxeles encendidos de la flecha */}
      {ARROW_FRAMES[9].matrix.map((row, rowIndex) =>
        row.map((maxVal, colIndex) => {
          if (maxVal === 1) { 
            const isLit = currentFrame.matrix[rowIndex][colIndex] === 1;
            
            // Si el pixel no está encendido en el frame actual, NO lo dibujamos.
            if (!isLit) return null;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="absolute pointer-events-none transition-all duration-300 ease-out"
                style={{
                  top: `${rowIndex * 12}px`,
                  left: `${colIndex * 12}px`,
                  width: '10px',
                  height: '10px',
                  backgroundColor: currentFrame.color,
                  boxShadow: currentFrame.shadow,
                  opacity: 1
                }}
              />
            );
          }
          return null;
        })
      )}
    </div>
  );
}
