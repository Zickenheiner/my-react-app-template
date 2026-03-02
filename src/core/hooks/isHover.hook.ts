import { useCallback, useRef, useState } from 'react';

const useIsHover = <T extends HTMLElement>() => {
  const [isHover, setIsHover] = useState(false);

  const handlersRef = useRef<{
    onEnter: () => void;
    onLeave: () => void;
  } | null>(null);

  const ref = useCallback((node: T | null) => {
    const prev = (ref as any)._node as T | null;
    if (prev && handlersRef.current) {
      prev.removeEventListener('mouseenter', handlersRef.current.onEnter);
      prev.removeEventListener('mouseleave', handlersRef.current.onLeave);
    }
    (ref as any)._node = node;

    if (!node) return;

    const onEnter = () => setIsHover(true);
    const onLeave = () => setIsHover(false);
    handlersRef.current = { onEnter, onLeave };

    node.addEventListener('mouseenter', onEnter);
    node.addEventListener('mouseleave', onLeave);
  }, []);

  return { isHover, ref };
};

export default useIsHover;
