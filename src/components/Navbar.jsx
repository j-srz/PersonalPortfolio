import { useState, useEffect } from 'react';
import iconWhite from '../assets/Icono_Principal_Bl.png';

const NAV_LINKS = [
  { label: 'Proyectos', id: 'proyectos' },
  { label: 'Sobre mi', id: 'sobre-mi' },
  { label: 'Mi blog', id: 'mi-blog', external: true },
  { label: 'Contacto', id: 'contacto' }
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const container = document.getElementById('scroll-container');
    if (!container) return;

    const handleScroll = () => {
      const sections = ['hero', 'proyectos', 'sobre-mi', 'contacto'];
      let current = '';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Si el centro de la pantalla está dentro de la sección
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    // Añadimos el listener al document en capture phase por si acaso (como en Luz.jsx)
    // o al container directamente. Dado que Navbar está fuera del flujo principal
    // (fixed), a veces es más seguro escuchar en document.
    document.addEventListener('scroll', handleScroll, true);
    handleScroll();
    
    return () => {
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  const handleClick = (e, link) => {
    if (link.external) return; 
    
    e.preventDefault();
    const element = document.getElementById(link.id);
    const container = document.getElementById('scroll-container');
    
    if (element && container) {
      container.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-10 md:px-16 py-6 flex items-center justify-between bg-gradient-to-b from-[#0a0a0a] to-transparent">
      {/* Lado Izquierdo — Logo + Nombre */}
      <div 
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => {
          const container = document.getElementById('scroll-container');
          if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <img
          src={iconWhite}
          alt="Logo Jesús Suárez"
          className="w-10 h-10 object-contain"
        />
        <span className="font-geist text-white text-xl hidden md:inline-block">
          Jesús Suárez
        </span>
      </div>

      {/* Lado Derecho — Enlaces */}
      <ul className="flex items-center gap-8 md:gap-12">
        {NAV_LINKS.map((link) => {
          const isActive = activeSection === link.id;
          
          return (
            <li key={link.label} className={link.id !== 'mi-blog' ? 'hidden md:block' : ''}>
              <a
                href={`#${link.id}`}
                onClick={(e) => handleClick(e, link)}
                className={`font-miranda transition-all duration-300 text-sm ${
                  isActive 
                    ? 'text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
                style={isActive ? { textShadow: '0 0 6px rgba(255, 34, 34, 0.7), 0 0 16px rgba(255, 34, 34, 0.4)' } : {}}
              >
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
