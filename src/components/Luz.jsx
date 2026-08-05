import { useEffect, useRef, useState } from 'react';

export default function Luz() {
  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  const clientPosRef = useRef({ x: -9999, y: -9999 });
  const pixelRef = useRef(null);

  useEffect(() => {
    let isTouch = false;

    const updatePos = () => {
      const container = document.getElementById('scroll-container');
      const scrollTop = container ? container.scrollTop : 0;
      requestAnimationFrame(() => {
        if (clientPosRef.current.x === -9999) {
          setPos({ x: -9999, y: -9999 });
        } else {
          setPos({
            x: clientPosRef.current.x,
            y: clientPosRef.current.y + scrollTop
          });
        }
      });
    };

    const handleMouseMove = (e) => {
      if (isTouch) return;
      clientPosRef.current = { x: e.clientX, y: e.clientY };
      updatePos();
    };

    const handleMouseLeave = () => {
      clientPosRef.current = { x: -9999, y: -9999 };
      updatePos();
    };

    const handleTouchStart = () => {
      isTouch = true;
      clientPosRef.current = { x: -9999, y: -9999 };
      updatePos();
    };

    const handleScroll = () => {
      updatePos();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    // Usamos capture (true) para interceptar el evento de scroll del contenedor hijo
    document.addEventListener('scroll', handleScroll, true); 

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  const snappedX = Math.floor(pos.x / 12) * 12;
  const snappedY = Math.floor(pos.y / 12) * 12;

  return (
    <div className="absolute top-0 left-0 w-full h-[400vh] pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* 
        Fondo cuadriculado iluminado único. 
        Ambas luces ahora tienen exactamente el mismo color y opacidad.
      */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: 'transparent',
          backgroundImage: `
            radial-gradient(circle 35px at ${pos.x}px ${pos.y}px, rgba(255, 34, 34, 0.2) 20%, transparent 100%),
            radial-gradient(circle 60px at var(--arrow-x, -999px) var(--arrow-y-1, -999px), rgba(255, 34, 34, var(--arrow-opacity-1, 0)) 20%, transparent 100%),
            radial-gradient(circle 60px at var(--arrow-x, -999px) var(--arrow-y-2, -999px), rgba(255, 34, 34, var(--arrow-opacity-2, 0)) 20%, transparent 100%),
            radial-gradient(circle 60px at var(--arrow-x, -999px) var(--arrow-y-3, -999px), rgba(255, 34, 34, var(--arrow-opacity-3, 0)) 20%, transparent 100%)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%',
        }}
      />

      {/* El píxel luminoso del ratón */}
      {pos.x !== -9999 && (
        <div
          ref={pixelRef}
          className="absolute top-0 left-0 pointer-events-none"
          style={{
            width: '10px',
            height: '10px',
            backgroundColor: '#ffffff',
            boxShadow: '0 0 6px 1px rgba(255, 255, 255, 0.7), 0 0 16px 5px rgba(255, 34, 34, 0.4)',
            transform: `translate(${snappedX}px, ${snappedY}px)`,
          }}
        />
      )}
    </div>
  );
}
