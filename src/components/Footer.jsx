import { useState } from 'react';
import { TerminalSquare } from 'lucide-react';

export default function Footer() {
  const [isNameHovered, setIsNameHovered] = useState(false);

  return (
    <footer className="fixed bottom-0 left-0 w-full z-50 px-10 md:px-16 py-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-t from-[#0a0a0a] to-transparent">
      <div
        className="flex items-center gap-2 cursor-pointer group z-10"
        onMouseEnter={() => setIsNameHovered(true)}
        onMouseLeave={() => setIsNameHovered(false)}
      >
        <TerminalSquare className="text-white" size={18} />
        <span className="font-geist text-white text-sm transition-all duration-300">
          {isNameHovered ? '@iosoishui' : 'Jesús Suárez'}
        </span>
      </div>

      <div className="font-miranda text-gray-500 text-xs md:text-sm text-center z-10">
        © {new Date().getFullYear()} - Construido con pasión, código y mucho café.
      </div>
    </footer>
  );
}
