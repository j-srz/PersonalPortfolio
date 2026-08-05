import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PostPattern from './PostPattern';

const API_URL = 'https://j-srz.github.io/blog/api/posts/index.json';
const BASE_URL = 'https://j-srz.github.io/blog';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parts[0];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return `${day} de ${months[monthIndex]} ${year}`;
}

const defaultDescription = "Todo esto hice y asi paso y no se paso y esto y mas y todo eso que pasa cuando sucede cualquier cosa super interesante. POero en fi.";

export default function SobreMi() {
  const [posts, setPosts] = useState([]);
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

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(async (data) => {
        // Tomamos los últimos 3 posts
        const topPosts = data.slice(0, 3);
        
        // Obtenemos el contenido individual de cada uno para poder mostrar su texto original
        const postsWithContent = await Promise.all(
          topPosts.map(async (post) => {
            try {
              const detailRes = await fetch(`${BASE_URL}/api/posts/${post.slug}.json`);
              if (!detailRes.ok) return post;
              const detailData = await detailRes.json();
              return { ...post, excerpt: detailData.content };
            } catch (e) {
              console.error("Error fetching post details:", e);
              return post;
            }
          })
        );
        
        setPosts(postsWithContent);
        // Wait for render, then check scroll
        setTimeout(checkScroll, 100);
      })
      .catch((err) => console.error("Error fetching posts:", err));
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
    <section id="sobre-mi" className="w-full min-h-screen shrink-0 relative z-10 flex flex-col justify-center px-6 md:px-16 lg:px-24 snap-start py-20 md:py-24">
      
      {/* Título de la sección */}
      <div className="flex justify-between items-center mb-12 mt-16 md:mt-0">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="font-geist text-white text-4xl md:text-5xl"
        >
          Sobre mi
        </motion.h2>

        {/* Controles de Carrusel */}
        <div className="flex gap-4 min-h-[42px]">
          {canScrollLeft && (
            <button 
              onClick={scrollLeft}
              className="flex items-center justify-center bg-transparent border border-white/30 text-white p-2 rounded-md hover:bg-white/10 hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.6)] transition-all duration-300"
              aria-label="Anterior"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          {canScrollRight && posts.length > 0 && (
            <button 
              onClick={scrollRight}
              className="flex items-center justify-center bg-transparent border border-white/30 text-white p-2 rounded-md hover:bg-white/10 hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.6)] transition-all duration-300"
              aria-label="Siguiente"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Contenedor relativo para los gradientes y el carrusel */}
      <div className="relative w-full">
        {/* Gradiente Izquierdo */}
        <div className={`hidden md:block absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none transition-opacity duration-500 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* Gradiente Derecho */}
        <div className={`hidden md:block absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none transition-opacity duration-500 ${canScrollRight && posts.length > 0 ? 'opacity-100' : 'opacity-0'}`} />

        {/* Contenedor de las tarjetas */}
        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
        {posts.map((post, index) => (
          <motion.div 
            key={post.slug}
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="bg-white rounded-xl w-[85vw] md:w-[750px] shrink-0 snap-center p-4 md:p-5 flex flex-col md:flex-row gap-4 md:gap-6 shadow-2xl"
          >
            {/* Lado izquierdo (Texto + DNA) */}
            <div className="w-full md:w-[45%] flex flex-col justify-between px-2 pt-2">
              <div>
                <h3 className="text-[2rem] md:text-[2.2rem] font-bold font-['Times_New_Roman',_Times,_serif] text-black leading-tight mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm mb-3">
                  {formatDate(post.date)}
                </p>
                <hr className="border-gray-200 mb-4" />
                <p className="text-gray-800 text-sm md:text-base leading-snug line-clamp-3 md:line-clamp-6">
                  {post.excerpt || defaultDescription}
                </p>
              </div>
              
              <div className="mt-4 md:mt-6 w-full mb-1 hidden md:block">
                <PostPattern dna={post.dna} baseSize={12} gap={3} />
              </div>
            </div>

            {/* Lado derecho (Imagen) */}
            <div className="w-full md:w-[55%] h-[240px] md:h-[400px] rounded-lg overflow-hidden bg-gray-100 shrink-0">
              {post.main_img ? (
                <img 
                  src={`${BASE_URL}${post.main_img}`} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-miranda">
                  Sin imagen
                </div>
              )}
            </div>
          </motion.div>
        ))}
        </div>
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
