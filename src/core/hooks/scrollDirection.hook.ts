import { useEffect, useState } from 'react';

const useScrollDirection = () => {
  const [scrollUp, setScrollUp] = useState(false);
  const [scrollDown, setScrollDown] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY > lastY) {
        setScrollDown(true);
        setScrollUp(false);
      } else if (currentY < lastY) {
        setScrollDown(false);
        setScrollUp(true);
      }

      lastY = currentY;

      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        setScrollDown(false);
        setScrollUp(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollUp, scrollDown };
};

export default useScrollDirection;
