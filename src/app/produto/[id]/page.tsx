import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import AddToCartButton from './AddToCartButton';

export const dynamic = 'force-dynamic';

async function getProduto(id: number) {
  const produto = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!produto) notFound();
  return produto;
}

async function getRelacionados(categoryId: number, excludeId: number) {
  return prisma.product.findMany({
    where: { categoryId, id: { not: excludeId } },
    include: { category: true },
    take: 4,
  });
}

export default async function ProdutoPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const produto = await getProduto(id);
  const relacionados = await getRelacionados(produto.categoryId, id);

  const lucro = produto.salePrice - produto.costPrice;
  const margem = ((lucro / produto.salePrice) * 100).toFixed(0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-8">
        <a href="/" className="hover:text-eco-600">Home</a>
        <span className="mx-2">/</span>
        <a href={`/catalogo?categoria=${produto.category.slug}`} className="hover:text-eco-600">
          {produto.category.name}
        </a>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{produto.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Imagem */}
        <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
          <img
            src={produto.imageUrl}
            alt={produto.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-eco-600 bg-eco-50 px-3 py-1 rounded-full w-fit mb-4">
            {produto.category.name}
          </span>

          <h1 className="text-3xl font-bold text-gray-800 mb-4">{produto.name}</h1>

          <p className="text-gray-600 leading-relaxed mb-6">{produto.description}</p>

          {/* Preço */}
          <div className="bg-eco-50 rounded-xl p-6 mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-eco-700">
                {produto.salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
              <span className="text-sm text-gray-500">
                em até 3x de {(produto.salePrice / 3).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
          </div>

          {/* Estoque */}
          <div className="mb-6">
            {produto.stockQuantity > 5 ? (
              <span className="text-sm text-eco-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Em estoque ({produto.stockQuantity} unidades)
              </span>
            ) : produto.stockQuantity > 0 ? (
              <span className="text-sm text-accent-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Apenas {produto.stockQuantity} unidades restantes
              </span>
            ) : (
              <span className="text-sm text-red-600">Produto indisponível no momento</span>
            )}
          </div>

          {/* CTA */}
          <AddToCartButton
            productId={produto.id}
            name={produto.name}
            price={produto.salePrice}
            imageUrl={produto.imageUrl}
            disabled={produto.stockQuantity === 0}
          />

          {/* Frete */}
          <div className="mt-4 p-4 bg-gray-50 rounded-xl flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-700">Frete grátis acima de R$ 150</p>
              <p className="text-xs text-gray-500">Consulte o prazo de entrega no checkout</p>
            </div>
          </div>
        </div>
      </div>

      {/* Produtos Relacionados */}
      {relacionados.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Produtos Relacionados</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relacionados.map((p) => (
              <div key={p.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <a href={`/produto/${p.id}`}>
                  <div className="aspect-square bg-gray-100">
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">{p.name}</h3>
                    <span className="text-eco-700 font-bold">
                      {p.salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
