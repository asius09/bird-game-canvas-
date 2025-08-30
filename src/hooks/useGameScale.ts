import { BASE_HEIGHT, BASE_WIDTH } from '@/constant/constants';
import { useState, useEffect } from 'react';
// --- Responsive Scaling Helper ---
export function useGameScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function updateScale() {
      const widthScale = window.innerWidth / BASE_WIDTH;
      const heightScale = window.innerHeight / BASE_HEIGHT;
      setScale(Math.min(widthScale, heightScale, 1));
    }
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return scale;
}
