/**
 * PostPattern — Renders the unique DNA pattern for each post.
 * 
 * The pattern tiles/repeats to fill the ENTIRE available width
 * by dynamically adjusting cell size so there are no gaps and
 * no incomplete squares. Always red, sharp corners, transparent empties.
 */
import { useRef, useState, useEffect } from 'react';

export default function PostPattern({ dna, baseSize = 10, gap = 2 }) {
  if (!dna || !dna.pattern) return null;

  const { pattern, rows, cols } = dna;
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ cellSize: baseSize, repeatCount: 1 });

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;

      // How many total base-pattern columns fit (at least 1 repeat)
      const singleWidth = cols * baseSize + (cols - 1) * gap;
      const repeats = Math.max(1, Math.floor((w + gap) / (singleWidth + gap)));
      const totalCols = cols * repeats;

      // Adjust cell size so totalCols * cellSize + (totalCols-1) * gap === w
      // cellSize = (w - (totalCols - 1) * gap) / totalCols
      const cellSize = (w - (totalCols - 1) * gap) / totalCols;

      setDims({ cellSize: Math.max(1, cellSize), repeatCount: repeats });
    };

    update();
    const obs = new ResizeObserver(update);
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [cols, baseSize, gap]);

  const { cellSize, repeatCount } = dims;
  const totalCols = cols * repeatCount;

  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let rep = 0; rep < repeatCount; rep++) {
      for (let c = 0; c < cols; c++) {
        const val = pattern[r * cols + c];
        cells.push(
          <div
            key={`${r}-${rep}-${c}`}
            className={`post-dna-cell ${val ? 'filled' : 'empty'}`}
          />
        );
      }
    }
  }

  return (
    <div ref={containerRef} className="post-dna-wrapper">
      <div
        className="post-dna"
        style={{
          gridTemplateColumns: `repeat(${totalCols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          gap: `${gap}px`,
          width: '100%',
        }}
        aria-hidden="true"
      >
        {cells}
      </div>
    </div>
  );
}
