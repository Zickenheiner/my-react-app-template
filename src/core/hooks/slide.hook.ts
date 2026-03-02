import { useState } from 'react';

interface Options {
  length: number;
  inifinity?: boolean;
}

export const useSlide = ({ length, inifinity = true }: Options) => {
  const [current, setCurrent] = useState<number>(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) =>
      prev === 0 ? (inifinity ? length - 1 : 0) : prev - 1,
    );
  };

  const next = () => {
    setDirection(1);
    setCurrent((prev) =>
      prev === length - 1 ? (inifinity ? 0 : length - 1) : prev + 1,
    );
  };

  const select = (index: number) => {
    if (current < index) {
      setDirection(1);
    } else if (current > index) {
      setDirection(-1);
    }
    setCurrent(index);
  };

  return {
    current,
    direction,
    prev,
    next,
    select,
  };
};
