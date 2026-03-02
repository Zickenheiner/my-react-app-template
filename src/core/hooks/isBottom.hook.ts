import { useEffect, useState } from 'react';

export function useIsBottom(offset = 50) {
  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.innerHeight + window.scrollY;
      const fullHeight = document.body.offsetHeight;

      setIsBottom(scrolled >= fullHeight - offset);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [offset]);

  return isBottom;
}
