import useClickOutside from '@/core/hooks/clickOutside.hook';
import type { useDialog } from '@/core/hooks/dialog.hook';
import cn from '@/core/utils/cn';
import { useEffect } from 'react';

interface DialogProps extends React.ComponentProps<'div'> {
  controller: ReturnType<typeof useDialog>;
  clickOutside?: boolean;
}

export default function Dialog({
  controller,
  clickOutside = true,
  className,
  children,
  ...props
}: DialogProps) {
  const ref = useClickOutside(
    clickOutside ? () => controller.close() : () => {},
  );

  useEffect(() => {
    if (controller.isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => document.body.classList.remove('overflow-hidden');
  }, [controller.isOpen]);

  return (
    <div
      className={cn(
        'z-1000 fixed inset-0 transition duration-200 pointer-events-none',
        controller.isOpen && 'pointer-events-auto',
      )}
    >
      <div
        className={cn(
          'absolute inset-0 bg-black/50 backdrop-blur-xs opacity-0 transition duration-200',
          controller.isOpen && 'opacity-100',
        )}
      />
      <div
        className={cn(
          'w-full h-full flex items-center justify-center sm:p-8 opacity-0 transition duration-200',
          controller.isOpen && 'opacity-100',
        )}
      >
        <div ref={ref} className={cn('z-1', className)} {...props}>
          {children}
        </div>
      </div>
    </div>
  );
}
