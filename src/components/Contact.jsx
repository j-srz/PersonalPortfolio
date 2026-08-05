import { useState } from 'react';
import { motion } from 'framer-motion';
import { TerminalSquare } from 'lucide-react';
import dragon from '../assets/Dragon_BL.png';

export default function Contact() {
  const [isNameHovered, setIsNameHovered] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    const form = e.target;
    const data = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xgogjrqd", {
        method: "POST",
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section id="contacto" className="w-full h-screen shrink-0 relative z-10 flex flex-col justify-center px-6 md:px-16 lg:px-24 snap-start py-20 md:py-24 overflow-hidden">

      {/* ── Dragón lado derecho ── */}
      <div className="absolute -rotate-60 top-3/4 -translate-y-1/2 -right-30 -md:right-1 w-[400px] md:w-[700px] h-[400px] md:h-[600px] pointer-events-none opacity-10 md:opacity-20 z-0">
        <img src={dragon} alt="" className="w-full h-full object-contain object-center-right" aria-hidden="true" />
      </div>

      <div className="flex-grow flex flex-col items-center justify-center max-w-2xl mx-auto w-full relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="font-geist text-white text-3xl md:text-5xl mb-2 text-center"
        >
          Conectemos
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-miranda text-gray-400 text-sm md:text-base mb-8 text-center max-w-lg"
        >
          ¿Tienes una idea en mente o buscas un desarrollador apasionado para tu equipo?
          Déjame un mensaje.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-1">
            <label className="font-miranda text-white text-[10px] tracking-widest uppercase">/ Nombre</label>
            <input
              type="text"
              name="nombre"
              required
              className="w-full bg-transparent border-b border-gray-600 p-2 text-white font-geist text-sm focus:outline-none focus:border-white transition-colors"
              placeholder="root"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-miranda text-white text-[10px] tracking-widest uppercase">/ E-mail</label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-transparent border-b border-gray-600 p-2 text-white font-geist text-sm focus:outline-none focus:border-white transition-colors"
              placeholder="root@localhost"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-miranda text-white text-[10px] tracking-widest uppercase">/ Mensaje</label>
            <textarea
              name="mensaje"
              required
              className="w-full bg-black/50 border border-gray-600 p-3 text-white font-geist text-sm focus:outline-none focus:border-white transition-colors resize-none h-20 mt-1"
              placeholder="> _"
            ></textarea>
          </div>

          <button
            disabled={status === 'loading' || status === 'success'}
            className={`w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-miranda font-medium text-sm transition-colors ${status === 'success' ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-gray-200'
              }`}
          >
            {status === 'loading' ? 'Enviando...' : status === 'success' ? '¡Mensaje Enviado!' : 'Enviar'}
          </button>

          {status === 'error' && (
            <p className="text-red-500 text-xs text-center font-geist mt-2">Hubo un error al enviar el mensaje. Inténtalo de nuevo.</p>
          )}
        </motion.form>
      </div>

    </section>
  );
}
