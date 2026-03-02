import {
  useInView,
  type IntersectionOptions,
} from 'react-intersection-observer';
import cn from '../utils/cn';

const useScrollReveal = (options?: IntersectionOptions) => {
  const { ref, inView } = useInView({ triggerOnce: true, ...options });

  return {
    ref,
    classScroll: cn(
      'transition duration-500',
      inView ? 'translate-y-0 opacity-100' : 'translate-y-[30%] opacity-0',
    ),
  };
};

export default useScrollReveal;
