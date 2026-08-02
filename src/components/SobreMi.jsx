import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1280);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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
      })
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  return (
    <section id="sobre-mi" className="w-full min-h-screen shrink-0 relative z-10 flex flex-col justify-center px-6 md:px-16 lg:px-24 snap-start pt-32 pb-10">
      
      {/* Título de la sección y Botón */}
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

        <motion.a 
          href={BASE_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md font-miranda font-medium text-sm hover:bg-gray-200 transition-colors"
        >
          <ExternalLink size={18} />
          <span className="hidden sm:inline">Visitar Blog</span>
          <span className="sm:hidden">Blog</span>
        </motion.a>
      </div>

      {/* Contenedor de las tarjetas */}
      <div className="flex-grow flex flex-col xl:flex-row items-center justify-center gap-6 xl:gap-10 relative w-full h-[550px] xl:h-auto pb-8 mt-4 xl:mt-0">
          {posts.map((post, index) => {
            const rotations = [-2, 3, -1];
            
            // Lógica para la pila en móvil:
            const stackPos = (index - activeIndex + posts.length) % posts.length;
            
            const mobileAnimate = {
              zIndex: 30 - stackPos * 10,
              scale: 1 - stackPos * 0.05,
              y: stackPos * 25,
              opacity: 1 - stackPos * 0.3,
              rotate: rotations[index % 3]
            };

            const desktopAnimate = {
              zIndex: 10,
              scale: 1,
              y: 0,
              opacity: 1,
              rotate: rotations[index % 3]
            };

            return (
              <motion.div 
                key={post.slug}
                onClick={() => {
                  if (isMobile) {
                    setActiveIndex((prev) => (prev + 1) % posts.length);
                  }
                }}
                className={`w-[300px] md:w-[380px] xl:w-auto xl:flex-1 ${isMobile ? 'absolute cursor-pointer left-0 right-0 mx-auto top-10 md:top-20' : 'block'}`}
                initial={{ opacity: 0, scale: 0.95, y: 50 }}
                animate={isMobile ? mobileAnimate : desktopAnimate}
                whileHover={!isMobile ? { rotate: 0, scale: 1.02 } : {}}
                transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
              >
              {/* Tarjeta */}
              <div className="w-full h-full min-h-[420px] bg-[#111] border border-white/20 rounded-lg p-4 shadow-2xl flex flex-col relative overflow-hidden">
                
                {/* Listón (Ribbon) */}
                <svg width="32" height="48" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -top-1 left-8 drop-shadow-md z-30">
                  <path d="M0 0H32V48L16 38L0 48V0Z" fill="white"/>
                </svg>

                {/* Imagen del post (con fallback) */}
                <div className="w-full h-52 md:h-56 border border-white/20 rounded-md overflow-hidden relative z-10 bg-neutral-900">
                  
                  {/* Fecha */}
                  <div className="absolute top-[15px] right-[15px] text-white text-xl font-caveat rotate-[-4deg] z-20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {formatDate(post.date)}
                  </div>

                  {post.main_img ? (
                    <img 
                      src={`${BASE_URL}${post.main_img}`} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30 text-sm font-geist">
                      No Image
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
                  {post.tags && post.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="px-2 py-1 rounded-sm border border-white/20 text-[10px] md:text-xs text-neutral-300 whitespace-nowrap font-['Times_New_Roman',_Times,_serif]">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Título y texto */}
                <h3 className="mt-3 text-lg md:text-xl font-bold font-['Times_New_Roman',_Times,_serif] text-white leading-tight">
                  {post.title}
                </h3>
                
                <p className="mt-2 text-xs md:text-sm text-neutral-400 font-['Times_New_Roman',_Times,_serif] line-clamp-3 leading-relaxed">
                  {post.excerpt || defaultDescription}
                </p>
                
              </div>
            </motion.div>
            );
          })}
      </div>
    </section>
  );
}
