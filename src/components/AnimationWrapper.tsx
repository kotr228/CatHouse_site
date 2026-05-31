'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type AnimationVariant = 'fade' | 'slide' | 'scale' | 'bounce' | 'none';

interface AnimationWrapperProps {
  variant?: AnimationVariant;
  delay?: number;
  children: ReactNode;
  className?: string;
}

const variantClassMap: Record<AnimationVariant, string> = {
  fade: 'anim-fade',
  slide: 'anim-slide',
  scale: 'anim-scale',
  bounce: 'anim-bounce',
  none: 'anim-none',
};

export default function AnimationWrapper({
  variant = 'fade',
  delay = 0,
  children,
  className = '',
}: AnimationWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || variant === 'none') return;

    const animClass = variantClassMap[variant];

    const timer = setTimeout(() => {
      el.classList.remove('anim-hidden');
      el.classList.add(animClass);
    }, delay);

    return () => clearTimeout(timer);
  }, [variant, delay]);

  if (variant === 'none') {
    return (
      <div className={`anim-none ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`anim-hidden ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
