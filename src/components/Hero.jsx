import TypewriterText from './TypewriterText';
import { motion } from 'framer-motion';
import flor1 from '../assets/Flor_1 copia.png';
import flor2 from '../assets/Flor_2 copia.png';
import ScrollArrow from './ScrollArrow';

export default function Hero() {
  return (
    <section id="hero" className="relative w-full h-screen shrink-0 z-10 flex flex-col md:flex-row items-center justify-center px-10 md:px-16 snap-start">

      {/* ── Rama de cerezo esquina superior izquierda ── */}
      <div className="absolute top-15 -left-10 w-[400px] h-[200px] pointer-events-none opacity-20">
        <img src={flor1} alt="" className="w-full h-full object-contain object-top-left -rotate-6" aria-hidden="true" />
      </div>

      {/* ── Rama de cerezo centro-derecha ── */}
      <div className="absolute rotate-120 top-1/2 -right-10 w-[350px] h-[400px] pointer-events-none opacity-15">
        <img src={flor2} alt="" className="w-full h-full object-contain object-center-right " aria-hidden="true" />
      </div>

      {/* ── Lado Izquierdo: Typewriter + Bio ── */}
      <div className="w-full flex flex-col justify-center">
        <TypewriterText />

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-miranda text-gray-300 text-base md:text-lg max-w-xl leading-relaxed"
        >
          Soy Jesús, desarrollador de software y estudiante de TICs en el ITA, a un semestre de graduarme. Me apasiona construir soluciones tecnológicas completas, desarrollando proyectos independientes que abarcan desde aplicaciones web hasta implementaciones de bases de datos y redes.
        </motion.p>
      </div>

      <ScrollArrow />
    </section>
  );
}
