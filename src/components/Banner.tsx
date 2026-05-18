'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const slides = [
  {
    title: 'Limpeza Sustentável',
    subtitle: 'Produtos ecológicos que respeitam o meio ambiente',
    cta: 'Ver Produtos',
    href: '/catalogo',
    bg: 'from-eco-900 via-eco-800 to-eco-700',
    /* IMPORTAR IMAGEM AQUI: Substituir bg gradiente por imagem de fundo */
    imagePlaceholder: true,
  },
  {
    title: 'Frete Grátis',
    subtitle: 'Em compras acima de R$ 150 para todo Brasil',
    cta: 'Aproveitar Oferta',
    href: '/catalogo',
    bg: 'from-eco-700 via-emerald-700 to-emerald-600',
    imagePlaceholder: true,
  },
  {
    title: 'Linha Automotiva',
    subtitle: 'Cuide do seu carro com produtos biodegradáveis',
    cta: 'Conhecer Linha',
    href: '/catalogo?categoria=limpeza-automotiva',
    bg: 'from-eco-900 via-eco-800 to-eco-700',
    imagePlaceholder: true,
  },
];

export default function Banner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-eco-900">
      {/* IMPORTAR IMAGENS AQUI: Substituir o bg-gradient por <img> tags ou Next/Image com as fotos reais */}
      <div className="relative h-[400px] md:h-[500px]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-gradient-to-r ${slide.bg} transition-opacity duration-700 ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Placeholder para imagem de fundo */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full flex items-center justify-center text-white/10 text-9xl">
                {index === 0 ? '🌿' : index === 1 ? '🚚' : '🚗'}
              </div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
              <div className="max-w-lg">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
                  {slide.title}
                </h2>
                <p className="text-lg text-eco-100 mb-8">{slide.subtitle}</p>
                <Link
                  href={slide.href}
                  className="inline-block bg-accent-400 text-eco-900 font-semibold px-8 py-3 rounded-full hover:bg-accent-300 transition-colors shadow-lg"
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === current ? 'bg-white w-8' : 'bg-white/50'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
