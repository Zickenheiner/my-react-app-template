import cn from '@/core/utils/cn';
import { LoaderCircle } from 'lucide-react';

interface SpinnerProps extends React.ComponentProps<typeof LoaderCircle> {}

export default function Spinner({ className, ...props }: SpinnerProps) {
  return <LoaderCircle className={cn('animate-spin', className)} {...props} />;
}
