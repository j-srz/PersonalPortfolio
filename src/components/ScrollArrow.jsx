import { useState, useEffect } from 'react';

const ARROW_FRAMES = [
  {
    // Estado inicial absoluto (cero scroll): Nada encendido
    matrix: [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ],
    color: 'transparent',
    shadow: 'none'
  },
  {
    // Estado 1 (poco scroll): Solo 2 píxeles
    matrix: [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ],
    color: '#ffffff',
    shadow: '0 0 6px 1px rgba(255, 255, 255, 0.7), 0 0 16px 5px rgba(255, 34, 34, 0.4)'
  },
  {
    // Estado 2 intermedio: Un pequeño triángulo / bloque
    matrix: [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0]
    ],
    color: '#ffffff',
    shadow: '0 0 6px 1px rgba(255, 255, 255, 0.7), 0 0 16px 5px rgba(255, 34, 34, 0.4)'
  },
  {
    // Estado 3 final (suficiente scroll): Gran flecha roja Brillante
    matrix: [
      [1, 1, 0, 0, 0, 1, 1],
      [0, 1, 1, 0, 1, 1, 0],
      [0, 0, 1, 1, 1, 0, 0]
    ],
    color: '#ffffff',
    shadow: '0 0 6px 1px rgba(255, 255, 255, 0.7), 0 0 16px 5px rgba(255, 34, 34, 0.4)'
  }
];

export default function ScrollArrow() {
  const [frameIndex, setFrameIndex] = useState(0);
  const [pos, setPos] = useState({ x: -9999, y: -9999 });

  // 1. Alinear perfectamente la flecha con la cuadrícula de 12px global
  useEffect(() => {
    const handleResize = () => {
      const arrowWidth = 7 * 12;
      const arrowHeight = 3 * 12;
      
      const targetX = window.innerWidth / 2 - arrowWidth / 2;
      const targetY = window.innerHeight - arrowHeight - 60; // Separación del fondo

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
      const maxScroll = window.innerHeight * 0.4; // Se carga completamente al bajar el 40%
      const currentScroll = Math.max(0, container.scrollTop || window.scrollY || 0);
      const scrollProgress = Math.min(currentScroll / maxScroll, 1);
      
      let opacity = 0;
      if (scrollProgress === 0) {
        setFrameIndex(0);
        opacity = 0;
      } else if (scrollProgress < 0.33) {
        setFrameIndex(1);
        opacity = 0.05;
      } else if (scrollProgress < 0.66) {
        setFrameIndex(2);
        opacity = 0.15;
      } else {
        setFrameIndex(3);
        opacity = 0.25;
      }

      // Enviar la posición y opacidad al grid global
      if (pos.x !== -9999) {
        document.documentElement.style.setProperty('--arrow-x', `${pos.x + 42}px`);
        document.documentElement.style.setProperty('--arrow-y', `${pos.y + 18}px`);
        document.documentElement.style.setProperty('--arrow-opacity', opacity);
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
      style={{ left: `${pos.x}px`, top: `${pos.y}px`, width: `${7 * 12}px`, height: `${3 * 12}px` }}
    >
      {/* Renderizamos solo la forma de los píxeles encendidos de la flecha */}
      {ARROW_FRAMES[3].matrix.map((row, rowIndex) =>
        row.map((maxVal, colIndex) => {
          if (maxVal === 1) { 
            const isLit = currentFrame.matrix[rowIndex][colIndex] === 1;
            
            // Si el pixel no está encendido en el frame actual, NO lo dibujamos.
            // Esto permite que el resplandor rojo del fondo ilumine la cuadrícula
            // y forme el pixel "apagado" perfecto.
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
