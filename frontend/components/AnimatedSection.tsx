'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  sectionId: string;
  animationClass: string;
  children: React.ReactNode;
  className?: string;
};

export function AnimatedSection({ sectionId, animationClass, children, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!animationClass) {
      setHasAnimated(true);
      return;
    }
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      setHasAnimated(true);
      return;
    }
    if (typeof IntersectionObserver === 'undefined') {
      setHasAnimated(true);
      return;
    }
    let revealed = false;
    const reveal = () => {
      if (!revealed) {
        revealed = true;
        setHasAnimated(true);
      }
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal();
          }
        });
      },
      { rootMargin: '0px 0px -80px 0px', threshold: 0.1 }
    );
    const fallbackTimer = window.setTimeout(() => {
      reveal();
    }, 1200);
    observer.observe(el);
    return () => {
      window.clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, [animationClass]);

  const showAnimation = hasAnimated && animationClass;
  const baseClass = !hasAnimated ? 'opacity-0' : '';

  return (
    <div
      ref={ref}
      data-section={sectionId}
      className={`${baseClass} ${showAnimation ? animationClass : ''} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
