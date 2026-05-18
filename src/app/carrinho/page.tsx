'use client';

import Link from 'next/link';
import { useCart } from '@/components/CartContext';

export default function CarrinhoPage() {
  const { items, updateQuantity, removeItem, subtotal, clearCart } = useCart();

  const shipping = subtotal > 150 ? 0 : 19.90;
  const total = subtotal + shipping;
  const faltaParaFreteGratis = subtotal < 150 ? 150 - subtotal : 0;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <svg className="w-20 h-20 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-700 mb-3">Seu carrinho está vazio</h2>
        <p className="text-gray-500 mb-8">Adicione produtos ao carrinho para continuar comprando.</p>
        <Link href="/catalogo" className="btn-eco inline-block">
          Ver Produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Seu Carrinho</h1>

      {/* Frete grátis progress */}
      {faltaParaFreteGratis > 0 && (
        <div className="bg-accent-50 border border-accent-200 rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-accent-800">
              Faltam {faltaParaFreteGratis.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} para frete grátis
            </span>
            <span className="text-xs text-accent-600">R$ 150</span>
          </div>
          <div className="w-full bg-accent-200 rounded-full h-2">
            <div
              className="bg-accent-400 rounded-full h-2 transition-all"
              style={{ width: `${Math.min((subtotal / 150) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Itens */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4">
              <Link href={`/produto/${item.productId}`} className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/produto/${item.productId}`} className="font-semibold text-gray-800 hover:text-eco-600 transition-colors">
                  {item.name}
                </Link>
                <p className="text-eco-600 font-bold mt-1">
                  {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>

                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="px-3 py-1 text-gray-500 hover:text-eco-600 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-sm font-medium min-w-[40px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-3 py-1 text-gray-500 hover:text-eco-600 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-sm text-red-500 hover:text-red-700 font-medium"
                  >
                    Remover
                  </button>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="font-bold text-gray-800">
                  {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>
          ))}

          <button onClick={clearCart} className="text-sm text-gray-500 hover:text-red-500 transition-colors">
            Limpar carrinho
          </button>
        </div>

        {/* Resumo */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
            <h2 className="font-bold text-gray-800 text-lg mb-4">Resumo do Pedido</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} itens)</span>
                <span className="font-medium">{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Frete</span>
                <span className={shipping === 0 ? 'text-accent-600 font-medium' : 'font-medium'}>
                  {shipping === 0 ? 'Grátis' : shipping.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-eco-700">{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="btn-accent block text-center mt-6 w-full"
            >
              Finalizar Compra
            </Link>

            <Link href="/catalogo" className="block text-center text-sm text-eco-600 hover:text-eco-800 mt-4 transition-colors">
              Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
