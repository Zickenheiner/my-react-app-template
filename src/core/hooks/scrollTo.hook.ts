import { useRef } from 'react';

interface Options {
  behavior?: ScrollBehavior;
  offset?: number;
}

export const useScrollTo = (options?: Options) => {
  const ref = useRef<HTMLDivElement>(null);
  const scrollTo = () => {
    if (!ref.current) return;
    window.scrollTo({
      top: ref.current.offsetTop + (options?.offset || 0),
      behavior: options?.behavior || 'smooth',
    });
  };
  return { ref, scrollTo };
};
