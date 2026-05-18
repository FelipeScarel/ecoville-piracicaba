'use client';

import Link from 'next/link';
import { useCart } from './CartContext';

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  categoryName?: string;
}

export default function ProductCard({ id, name, description, price, imageUrl, stockQuantity, categoryName }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: id,
      name,
      price,
      imageUrl,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-eco-200 transition-all duration-300 group flex flex-col">
      <Link href={`/produto/${id}`} className="block">
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {stockQuantity < 5 && stockQuantity > 0 && (
            <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Últimas unidades
            </span>
          )}
          {stockQuantity === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full">
                Indisponível
              </span>
            </div>
          )}
          {categoryName && (
            <span className="absolute top-3 right-3 bg-white/90 text-eco-700 text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              {categoryName}
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link href={`/produto/${id}`} className="block flex-1">
          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 hover:text-eco-600 transition-colors">
            {name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{description}</p>
        </Link>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-eco-600">
            {price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <Link
            href={`/produto/${id}`}
            className="text-center text-sm text-eco-600 border border-eco-300 rounded-lg py-2 hover:bg-eco-50 transition-colors font-medium"
          >
            Ver Detalhes
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={stockQuantity === 0}
            className="text-sm bg-accent-500 text-eco-900 rounded-lg py-2 hover:bg-accent-400 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
