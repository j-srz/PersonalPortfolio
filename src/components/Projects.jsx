import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Atom, Terminal, Globe, Plus, GitBranch, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt } from 'react-icons/fa';
import { SiTailwindcss, SiVite, SiJavascript, SiTypescript } from 'react-icons/si';
import projectsData from '../data/projects.json';

// Cargar todas las imágenes de la carpeta assets para que Vite las reconozca al compilar
const images = import.meta.glob('../assets/*.{png,jpg,jpeg,svg}', { eager: true });

// Mapeo simple de nombres de iconos en el JSON a componentes reales
const iconMap = {
  React: FaReact,
  Node: FaNodeJs,
  Tailwind: SiTailwindcss,
  Vite: SiVite,
  JS: SiJavascript,
  TS: SiTypescript,
  CSS: FaCss3Alt,
  HTML: FaHtml5,
  Web: Globe,
  Plus: Plus,
  Git: GitBranch
};

export default function Projects() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -420, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 420, behavior: 'smooth' });
    }
  };

  return (
    <section id="proyectos" className="w-full min-h-screen shrink-0 relative z-10 flex flex-col justify-center px-6 md:px-16 lg:px-24 snap-start py-20 md:py-24">
      <div className="flex justify-between items-center mb-12 mt-16 md:mt-0">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="font-geist text-white text-4xl md:text-5xl"
        >
          Proyectos
        </motion.h2>
        
        {/* Controles de Carrusel */}
        <div className="flex gap-4 min-h-[42px]">
          {canScrollLeft && (
            <button 
              onClick={scrollLeft}
              className="flex items-center justify-center bg-transparent border border-white/30 text-white p-2 rounded-md hover:bg-white/10 hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.6)] transition-all duration-300"
              aria-label="Anterior proyecto"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          {canScrollRight && (
            <button 
              onClick={scrollRight}
              className="flex items-center justify-center bg-transparent border border-white/30 text-white p-2 rounded-md hover:bg-white/10 hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.6)] transition-all duration-300"
              aria-label="Siguiente proyecto"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      </div>
      
      {/* Carrusel */}
      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {projectsData.map((project, index) => (
          <motion.div 
            key={project.id}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="flex flex-col group w-[85vw] sm:w-[300px] md:w-[400px] max-w-[450px] snap-center shrink-0"
          >
            {/* Imagen del Proyecto */}
            <div className="relative rounded-lg overflow-hidden border border-gray-800 transition-all duration-300 group-hover:border-gray-500 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <img 
                src={images[`../assets/${project.image}`]?.default || ''} 
                alt={project.title} 
                className="w-full h-auto object-cover aspect-video"
              />
              
              {/* Badges superpuestos en la imagen */}
              <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 content-end">
                {project.tags.slice(0, 3).map((tag, index) => {
                  const IconComponent = iconMap[tag.icon] || Plus;
                  return (
                    <div 
                      key={index} 
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-miranda font-medium shadow-md border ${tag.color || 'bg-white text-black border-white'}`}
                    >
                      <IconComponent size={14} />
                      <span>{tag.name}</span>
                    </div>
                  );
                })}
                {project.tags.length > 3 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-miranda font-medium shadow-md border bg-black/60 backdrop-blur-sm text-white border-white/20">
                    <span>+{project.tags.length - 3}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Información del Proyecto */}
            <div className="mt-4 flex flex-col flex-grow">
              <h3 className="font-geist text-white text-xl font-bold mb-2">
                {project.title}
              </h3>
              <p className="font-miranda text-gray-400 text-sm md:text-base leading-relaxed mb-6">
                {project.description}
              </p>
              
              {/* Botones de acción */}
              <div className="flex gap-4 mt-auto">
                <a 
                  href={project.links.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md font-miranda font-medium text-sm hover:bg-gray-200 transition-colors"
                >
                  <GitBranch size={18} />
                  Git
                </a>
                <a 
                  href={project.links.demo} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md font-miranda font-medium text-sm hover:bg-gray-200 transition-colors"
                >
                  <ExternalLink size={18} />
                  Demo
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Ocultar barra de scroll en navegadores basados en webkit */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
}
