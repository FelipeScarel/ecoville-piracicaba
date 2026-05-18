'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Props {
  categorias: Category[];
  categoriaAtual: string;
  buscaAtual: string;
}

export default function CatalogFilters({ categorias, categoriaAtual, buscaAtual }: Props) {
  const router = useRouter();
  const [busca, setBusca] = useState(buscaAtual);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (busca) params.set('busca', busca);
    if (categoriaAtual) params.set('categoria', categoriaAtual);
    router.push(`/catalogo?${params.toString()}`);
  }

  function handleCategoryClick(slug: string) {
    const params = new URLSearchParams();
    if (slug && slug !== categoriaAtual) {
      params.set('categoria', slug);
    }
    if (buscaAtual) params.set('busca', buscaAtual);
    router.push(`/catalogo?${params.toString()}`);
  }

  function handleClear() {
    setBusca('');
    router.push('/catalogo');
  }

  return (
    <div className="space-y-6">
      {/* Busca */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Buscar</h3>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Nome do produto..."
            className="input-eco text-sm flex-1"
          />
          <button type="submit" className="btn-eco text-sm !px-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
      </div>

      {/* Categorias */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Categorias</h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => handleCategoryClick('')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                !categoriaAtual
                  ? 'bg-eco-50 text-eco-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Todas as categorias
            </button>
          </li>
          {categorias.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => handleCategoryClick(cat.slug)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  categoriaAtual === cat.slug
                    ? 'bg-eco-50 text-eco-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Limpar filtros */}
      {(categoriaAtual || buscaAtual) && (
        <button
          onClick={handleClear}
          className="w-full text-center text-sm text-eco-600 hover:text-eco-800 transition-colors font-medium"
        >
          Limpar todos os filtros
        </button>
      )}
    </div>
  );
}
