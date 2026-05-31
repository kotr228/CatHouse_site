'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Props {
  children: React.ReactNode;
  variant: string;
}

export default function PageTransition({ children, variant }: Props) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const t = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(t);
  }, [pathname]);

  const cls = isVisible
    ? variant === 'none' ? '' : `anim-${variant}`
    : 'anim-hidden';

  return <div className={cls}>{children}</div>;
}
