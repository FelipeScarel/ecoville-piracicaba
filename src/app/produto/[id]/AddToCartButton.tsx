'use client';

import { useState } from 'react';
import { useCart } from '@/components/CartContext';

interface Props {
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  disabled: boolean;
}

export default function AddToCartButton({ productId, name, price, imageUrl, disabled }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem({ productId, name, price, imageUrl });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
        added
          ? 'bg-green-500 text-white'
          : disabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-accent-500 text-eco-900 hover:bg-accent-400 shadow-lg hover:shadow-xl'
      }`}
    >
      {added ? 'Adicionado ao Carrinho!' : disabled ? 'Indisponível' : 'Adicionar ao Carrinho'}
    </button>
  );
}
