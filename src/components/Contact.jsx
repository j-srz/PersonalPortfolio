import { useState } from 'react';
import { TerminalSquare } from 'lucide-react';

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
    <section id="contacto" className="w-full h-screen shrink-0 relative z-10 flex flex-col justify-between px-6 md:px-16 lg:px-24 snap-start pt-24 pb-6">

      <div className="flex-grow flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        <h2 className="font-geist text-white text-3xl md:text-5xl mb-2 text-center">Conectemos</h2>
        <p className="font-miranda text-gray-400 text-sm md:text-base mb-8 text-center max-w-lg">
          ¿Tienes una idea en mente o buscas un desarrollador apasionado para tu equipo?
          Déjame un mensaje.
        </p>

        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
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
        </form>
      </div>

      {/* Footer integrado */}
      <footer className="w-full pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onMouseEnter={() => setIsNameHovered(true)}
          onMouseLeave={() => setIsNameHovered(false)}
        >
          <TerminalSquare className="text-white" size={18} />
          <span className="font-geist text-white text-sm transition-all duration-300">
            {isNameHovered ? '@iosoishui' : 'Jesús Suárez'}
          </span>
        </div>

        <div className="font-miranda text-gray-500 text-xs md:text-sm text-center">
          © {new Date().getFullYear()} - Construido con pasión, código y mucho café.
        </div>
      </footer>
    </section>
  );
}
