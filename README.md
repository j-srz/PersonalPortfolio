# 🌌 Portafolio Web Interactivo - Jesús Suárez

Bienvenido al repositorio de mi portafolio personal. Este proyecto no es solo una tarjeta de presentación, sino una demostración interactiva de mis habilidades en el desarrollo frontend, la manipulación de DOM, y la renderización de animaciones complejas basadas en matemáticas.

## 🚀 Tecnologías Utilizadas

- **React.js**: Librería principal para la arquitectura de componentes.
- **Vite**: Entorno de desarrollo ultrarrápido y empaquetador para producción.
- **Tailwind CSS**: Framework de utilidad para un diseño responsivo, limpio y consistente.
- **react-icons / lucide-react**: Para la iconografía dinámica e integrada.

## ✨ Características Destacadas

### 1. Motor de Fondo Orgánico (GridShape)
El fondo del portafolio no es un video ni un GIF. Es una matriz matemática de 900 píxeles renderizados individualmente que responden en tiempo real a:
- **Ecuaciones de Onda Multidimensionales**: Se utiliza la suma de funciones seno y coseno con un desplazamiento temporal (`Date.now()`) para crear un efecto de "lámpara de lava" fluida y orgánica.
- **Interacción de Inversión de Fase**: Al hacer clic exactamente sobre el fluido, el sistema invierte la condición matemática del umbral, intercambiando instantáneamente los picos y valles de las ondas.
- **Optimización Inteligente**: La matriz se apaga completamente en dispositivos móviles para conservar la batería y mejorar el rendimiento.

### 2. Sistema Global de Partículas (ClickEffects)
Al hacer clic en cualquier parte de la pantalla, se dispara un generador de partículas estilo 8-bits:
- Las partículas se dispersan en un radio circular perfecto.
- Calcula dinámicamente la distancia de cada partícula respecto al clic inicial.
- Ajusta exponencialmente el resplandor (`box-shadow` tipo neón rojo) basado en esta distancia: los píxeles más cercanos deslumbran, los lejanos se desvanecen sutilmente en la oscuridad. Todo esto mapeado a la perfección bajo la máscara de cuadrícula para revelar los módulos ocultos de la red.

### 3. Diseño Ultra-Compacto e Inmersivo
- Un flujo de navegación de **scroll magnético (snap scrolling)** fluido.
- Diseños de componentes compactados para eliminar desbordamientos y mantener cada sección enmarcada exactamente en el 100% de la altura de la pantalla (100vh).
- Botones unificados con una interfaz de usuario minimalista y transiciones suaves.

## 💻 Instalación y Uso Local

Para correr este proyecto en tu entorno local:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/iosoishui/portafolio.git
   ```
2. Navega al directorio:
   ```bash
   cd portafolio
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
5. Abre `http://localhost:5173` en tu navegador.

## 📦 Construcción para Producción

Para compilar la aplicación para producción:

```bash
npm run build
```

El código resultante se guardará en la carpeta `dist/`, listo para ser desplegado en plataformas como Vercel, Netlify o GitHub Pages.

---

> Construido con pasión, código y mucho café. ☕
