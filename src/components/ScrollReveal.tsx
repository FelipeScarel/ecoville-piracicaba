'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
}

export default function ScrollReveal({ children, delay = 0 }: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Altera o estado baseado se o elemento está visível ou não (permite ir e voltar)
        setIsVisible(entry.isIntersecting);
      },
      { 
        threshold: 0.05, // Ativa um pouco mais rápido para parecer mais responsivo
        rootMargin: '-20px 0px -40px 0px' // Margens ajustadas para uma transição suave em ambas as direções
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      style={{ 
        transitionDelay: `${delay}ms`,
        // Curva personalizada (cubic-bezier) para um movimento "solto" e elegante
        transitionTimingFunction: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)' 
      }}
      className={`transition-all duration-700 will-change-transform ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100 blur-0' 
          : 'opacity-0 translate-y-8 scale-[0.98] blur-[2px] pointer-events-none'
      }`}
    >
      {children}
    </div>
  );
}