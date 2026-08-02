import { useEffect, useState, useMemo, useRef } from 'react';

export default function GridShape({ matrix, scale = 1, color = '#ff2222', coreColor = '#ffffff' }) {
  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      const matrixWidth = matrix[0].length * 12 * scale;
      const matrixHeight = matrix.length * 12 * scale;

      let targetX = window.innerWidth * 0.70 - matrixWidth / 2;
      let targetY = window.innerHeight * 0.5 - matrixHeight / 2;

      if (window.innerWidth < 768) {
        targetX = window.innerWidth * 0.5 - matrixWidth / 2;
        targetY = window.innerHeight * 0.75 - matrixHeight / 2;
      }

      const finalX = Math.floor(targetX / 12) * 12;
      const finalY = Math.floor(targetY / 12) * 12;

      setPos({ x: finalX, y: finalY });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [matrix, scale]);

  const [pattern, setPattern] = useState(new Set());
  const [inverted, setInverted] = useState(false);

  // Escuchar clics sobre la lámpara de lava
  useEffect(() => {
    const handleLavaClick = (e) => {
      const matrixWidth = matrix[0].length * 12 * scale;
      const matrixHeight = matrix.length * 12 * scale;
      if (
        e.clientX >= pos.x && e.clientX <= pos.x + matrixWidth &&
        e.clientY >= pos.y && e.clientY <= pos.y + matrixHeight
      ) {
         setInverted(prev => !prev);
      }
    };
    window.addEventListener('click', handleLavaClick);
    return () => window.removeEventListener('click', handleLavaClick);
  }, [pos, matrix, scale]);

  // Generador de ruido orgánico con funciones matemáticas complejas
  useEffect(() => {
    if (!isDesktop) return; // Ahorrar batería y rendimiento en móviles/tablets
    
    const allPixels = [];
    matrix.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val === 1) allPixels.push({ r, c });
      });
    });

    const generatePattern = () => {
      const newPattern = new Set();
      const t = Date.now() / 2000; // Tiempo para animar fluidamente las ecuaciones

      allPixels.forEach(({ r, c }) => {
        // Interferencia de múltiples ondas para crear formas orgánicas (tipo "Lámpara de lava")
        const wave1 = Math.sin(c / 5 + t);
        const wave2 = Math.cos(r / 5 + t * 0.8);
        const wave3 = Math.sin((r + c) / 8 - t * 1.2);

        // Onda radial desde el centro para darle más dinamismo
        const centerR = matrix.length / 2;
        const centerC = matrix[0].length / 2;
        const dist = Math.sqrt(Math.pow(r - centerR, 2) + Math.pow(c - centerC, 2));
        const wave4 = Math.cos(dist / 4 - t * 1.5);

        // Sumamos las ondas. El valor oscilará entre -4 y 4
        const combined = wave1 + wave2 + wave3 + wave4;

        // Solo encendemos los píxeles según el estado (normal o invertido)
        const isActive = inverted ? combined < -0.5 : combined > 0.5;
        if (isActive) {
          newPattern.add(`${r}-${c}`);
        }
      });
      setPattern(newPattern);
    };

    generatePattern();
    // Actualizamos cada segundo, pero la transición CSS de 2000ms lo hará ver como líquido
    const interval = setInterval(generatePattern, 1000);
    return () => clearInterval(interval);
  }, [matrix, isDesktop, inverted]);

  const pixels = useMemo(() => {
    if (pos.x === -9999 || pattern.size === 0) return [];

    const arr = [];
    matrix.forEach((row, rowIndex) => {
      row.forEach((val, colIndex) => {
        if (val === 1 && pattern.has(`${rowIndex}-${colIndex}`)) {
          arr.push(
            <div
              key={`${rowIndex}-${colIndex}`}
              ref={(el) => (pixelsRef.current[`${rowIndex}-${colIndex}`] = el)}
              className="absolute pointer-events-none transition-opacity duration-[2000ms] ease-in-out"
              style={{
                top: `${pos.y + rowIndex * 12 * scale}px`,
                left: `${pos.x + colIndex * 12 * scale}px`,
                width: `${10 * scale}px`,
                height: `${10 * scale}px`,
                backgroundColor: coreColor,
                boxShadow: `
                0 0 6px 1px rgba(255, 255, 255, 0.7), 
                0 0 20px 5px rgba(255, 34, 34, 0.4),
                0 0 50px 20px rgba(255, 34, 34, 0.1)
                `
              }}
            />
          );
        }
      });
    });
    return arr;
  }, [matrix, coreColor, pos, scale, pattern]);

  const matrixWidth = matrix[0].length * 12 * scale;
  const matrixHeight = matrix.length * 12 * scale;
  const centerX = pos.x + matrixWidth / 2;
  const centerY = pos.y + matrixHeight / 2;
  const radius = Math.max(matrixWidth, matrixHeight) / 2 + 150;

  const mouseRef = useRef({ x: -9999, y: -9999, clientX: -9999, clientY: -9999 });
  const pixelsRef = useRef({});

  // Rastrear la posición del cursor de forma independiente para el efecto de proximidad
  useEffect(() => {
    const container = document.getElementById('scroll-container');
    const updateMouse = (e) => {
      if (e.clientX !== undefined) {
        mouseRef.current.clientX = e.clientX;
        mouseRef.current.clientY = e.clientY;
      }
      const scrollY = container ? container.scrollTop : 0;
      mouseRef.current.x = mouseRef.current.clientX;
      mouseRef.current.y = mouseRef.current.clientY + scrollY;
    };
    document.addEventListener('mousemove', updateMouse, true);
    if (container) container.addEventListener('scroll', updateMouse, true);

    return () => {
      document.removeEventListener('mousemove', updateMouse, true);
      if (container) container.removeEventListener('scroll', updateMouse, true);
    };
  }, []);

  // Calcular la distancia de cada píxel al cursor y aplicar la clase de parpadeo
  useEffect(() => {
    const interval = setInterval(() => {
      if (pos.x === -9999) return;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const key in pixelsRef.current) {
        const node = pixelsRef.current[key];
        if (!node) continue;
        
        const [r, c] = key.split('-').map(Number);
        // El centro del píxel
        const px = pos.x + c * 12 * scale + 5 * scale; 
        const py = pos.y + r * 12 * scale + 5 * scale;

        const dist = Math.sqrt(Math.pow(px - mx, 2) + Math.pow(py - my, 2));

        // 36px es aproximadamente 2 a 3 píxeles a la redonda
        if (dist < 36) { 
          if (!node.classList.contains('cursor-flicker')) {
            node.classList.add('cursor-flicker');
          }
        } else {
          if (node.classList.contains('cursor-flicker')) {
            node.classList.remove('cursor-flicker');
          }
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, [pos, scale, isDesktop]);

  if (!isDesktop || pos.x === -9999) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pixelFlicker {
          0%, 100% { opacity: 1; transform: scale(1); filter: brightness(1); }
          25% { opacity: 0.3; transform: scale(0.9); filter: brightness(0.5); }
          50% { opacity: 0.6; transform: scale(0.95); filter: brightness(0.7); }
          75% { opacity: 0.2; transform: scale(0.85); filter: brightness(0.4); }
        }
        .cursor-flicker {
          animation: pixelFlicker 0.2s infinite alternate !important;
          box-shadow: 0 0 4px 1px rgba(255, 34, 34, 0.2) !important; /* Baja la luz drásticamente */
          opacity: 0.5 !important;
        }
      `}} />
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true" style={{ height: '100%' }}>
        {pixels}
      </div>
    </>
  );
}
