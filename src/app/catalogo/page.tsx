import prisma from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import CatalogFilters from './CatalogFilters';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: { categoria?: string; busca?: string; page?: string };
}

async function getProdutos(categoria?: string, busca?: string, page = 1) {
  const limit = 12;
  const where: any = {};

  if (categoria) {
    where.category = { slug: categoria };
  }

  if (busca) {
    where.OR = [
      { name: { contains: busca } },
      { description: { contains: busca } },
    ];
  }

  const [produtos, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  return { produtos, total, page, totalPages: Math.ceil(total / limit), limit };
}

async function getCategorias() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
}

export default async function CatalogoPage({ searchParams }: Props) {
  const categoriaSlug = searchParams.categoria || '';
  const busca = searchParams.busca || '';
  const page = parseInt(searchParams.page || '1');

  const [{ produtos, total, totalPages }, categorias] = await Promise.all([
    getProdutos(categoriaSlug, busca, page),
    getCategorias(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-eco-600">Home</a>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">Catálogo</span>
        {categoriaSlug && (
          <>
            <span className="mx-2">/</span>
            <span className="text-eco-600 font-medium">
              {categorias.find((c) => c.slug === categoriaSlug)?.name || categoriaSlug}
            </span>
          </>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar / Filtros */}
        <aside className="lg:w-64 flex-shrink-0">
          <CatalogFilters
            categorias={categorias}
            categoriaAtual={categoriaSlug}
            buscaAtual={busca}
          />
        </aside>

        {/* Produtos */}
        <div className="flex-1">
          {/* Cabeçalho */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {categoriaSlug
                ? categorias.find((c) => c.slug === categoriaSlug)?.name || 'Catálogo'
                : busca
                ? `Resultados para "${busca}"`
                : 'Todos os Produtos'}
            </h1>
            <span className="text-sm text-gray-500">{total} produto(s) encontrado(s)</span>
          </div>

          {/* Grid */}
          {produtos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {produtos.map((produto) => (
                  <ProductCard
                    key={produto.id}
                    id={produto.id}
                    name={produto.name}
                    description={produto.description}
                    price={produto.salePrice}
                    imageUrl={produto.imageUrl}
                    stockQuantity={produto.stockQuantity}
                    categoryName={produto.category.name}
                  />
                ))}
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    const params = new URLSearchParams();
                    if (categoriaSlug) params.set('categoria', categoriaSlug);
                    if (busca) params.set('busca', busca);
                    params.set('page', pageNum.toString());

                    return (
                      <a
                        key={pageNum}
                        href={`/catalogo?${params.toString()}`}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors ${
                          pageNum === page
                            ? 'bg-eco-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-700 hover:border-eco-300'
                        }`}
                      >
                        {pageNum}
                      </a>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-500">Tente ajustar os filtros ou fazer uma nova busca.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
