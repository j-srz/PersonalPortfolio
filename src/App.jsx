import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Luz from './components/Luz';
import Hero from './components/Hero';
import Projects from './components/Projects';
import GridShape from './components/GridShape';
import Contact from './components/Contact';
import ClickEffects from './components/ClickEffects';
import SobreMi from './components/SobreMi';

const MATRIX = Array(30).fill(Array(30).fill(1)); // 40x40 para un tamaño más razonable

export default function App() {
  return (
    <div 
      id="scroll-container"
      className="h-[100dvh] w-full text-white relative overflow-x-hidden overflow-y-scroll snap-y snap-mandatory"
    >
      <Navbar />
      <Footer />
      <Luz />
      <ClickEffects />
      <GridShape matrix={MATRIX} />
      
      {/* Capa superior de la cuadrícula: Máscara negra con agujeros */}
      <div 
        className="absolute top-0 left-0 w-full h-[400vh] pointer-events-none z-0" 
        style={{
          backgroundImage: `
            linear-gradient(to right, transparent 10px, #0a0a0a 10px),
            linear-gradient(to bottom, transparent 10px, #0a0a0a 10px)
          `,
          backgroundSize: '12px 12px, 12px 12px'
        }} 
      />

      {/* Secciones de contenido */}
      <Hero />
      <Projects />
      
      {/* Secciones del portafolio */}
      <SobreMi />

      <Contact />
    </div>
  );
}
