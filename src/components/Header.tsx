'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from './CartContext';

export default function Header() {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 backdrop-blur-md bg-white/95">
      {/* Top bar */}
      <div className="bg-eco-800 text-white text-xs font-light tracking-wide py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span>Frete grátis para pedidos acima de R$ 150</span>
          <span className="hidden sm:block font-normal">contato@ecovillepiracicaba.com.br</span>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between">
          
          {/* Logo Redonda e Elegante */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-100 bg-gray-50 shadow-sm group-hover:shadow-md transition-shadow duration-300 flex items-center justify-center">
              <Image 
                src="https://i.imgur.com/aR1UiEt.jpeg" // Substitua pela URL da nova logo redonda
                alt="Ecoville Piracicaba" 
                fill
                sizes="48px"
                className="object-cover p-1" // O 'p-1' garante uma margem interna delicada se a imagem for até a borda
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-wide text-gray-800 font-sans leading-tight group-hover:text-eco-600 transition-colors">
                Ecoville
              </span>
              <span className="text-xs font-light tracking-widest text-eco-600 uppercase leading-none">
                Piracicaba
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-gray-600 hover:text-eco-600 font-medium tracking-wide transition-colors">
              Home
            </Link>
            <Link href="/catalogo" className="text-sm text-gray-600 hover:text-eco-600 font-medium tracking-wide transition-colors">
              Catálogo
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link href="/carrinho" className="relative p-2 text-gray-600 hover:text-eco-600 transition-colors rounded-full hover:bg-gray-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent-500 text-eco-900 text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-full"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2 animate-fadeIn">
            <Link href="/" className="text-sm text-gray-600 font-medium py-2 px-1" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link href="/catalogo" className="text-sm text-gray-600 font-medium py-2 px-1" onClick={() => setMenuOpen(false)}>
              Catálogo
            </Link>
            <Link href="/carrinho" className="text-sm text-gray-600 font-medium py-2 px-1" onClick={() => setMenuOpen(false)}>
              Carrinho {itemCount > 0 && `(${itemCount})`}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}