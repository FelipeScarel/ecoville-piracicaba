import Link from 'next/link';
import prisma from '@/lib/prisma';
import Banner from '@/components/Banner';
import ProductCard from '@/components/ProductCard';
import ScrollReveal from '@/components/ScrollReveal';

export const dynamic = 'force-dynamic';

async function getDestaques() {
  const produtos = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: 8,
  });
  return produtos;
}

async function getCategorias() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  });
}

export default async function HomePage() {
  const [destaques, categorias] = await Promise.all([getDestaques(), getCategorias()]);

  // Array fictícia com os links diretos de vídeo do Imgur (.mp4)
  const videosInstagram = [
    { id: 1, src: 'https://i.imgur.com/qzDwPeH.mp4', title: 'Dica de Limpeza 1' },
    { id: 2, src: 'https://i.imgur.com/vW4VInx.mp4', title: 'Bastidores Ecoville' },
    { id: 3, src: 'https://i.imgur.com/7qg0MBA.mp4', title: 'Uso Prático do Produto' },
    { id: 4, src: 'https://i.imgur.com/vOCsQij.mp4', title: 'Resultado Sustentável' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Banner / Carrossel */}
      <Banner />

      {/* Categorias */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
              Navegue por Categorias
            </h2>
          </ScrollReveal>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categorias.map((cat, index) => (
              <ScrollReveal key={cat.id} delay={index * 50}>
                <Link
                  href={`/catalogo?categoria=${cat.slug}`}
                  className="group bg-eco-50 rounded-xl p-6 text-center hover:bg-eco-100 transition-all duration-300 border border-eco-100 hover:border-eco-300 block transform hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="w-14 h-14 bg-eco-200 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-eco-300 group-hover:scale-110 transition-all duration-300">
                    <svg className="w-7 h-7 text-eco-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm group-hover:text-eco-900 transition-colors">{cat.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{cat._count.products} produtos</p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* NOVA SEÇÃO: Vídeos do Instagram (vividos via Imgur) */}
      <section className="py-14 bg-white border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Ecoville no Instagram
              </h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Acompanhe nossas demonstrações, dicas de economia e soluções de limpeza direto na nossa rede.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {videosInstagram.map((video, index) => (
              <ScrollReveal key={video.id} delay={index * 100}>
                <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-gray-900 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 group">
                  <video
                    src={video.src}
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                    playsInline
                  />
                  {/* Overlay discreto de efeito visual ao passar o mouse */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none transition-opacity duration-300 opacity-80 group-hover:opacity-40" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Produtos em Destaque */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                Produtos em Destaque
              </h2>
              <p className="text-gray-500 max-w-lg mx-auto">
                Os produtos mais vendidos da Ecoville. Qualidade, sustentabilidade e eficiência para o seu dia a dia.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {destaques.map((produto, index) => (
              <ScrollReveal key={produto.id} delay={(index % 4) * 100}>
                <div className="transform hover:-translate-y-2 transition-all duration-300">
                  <ProductCard
                    id={produto.id}
                    name={produto.name}
                    description={produto.description}
                    price={produto.salePrice}
                    imageUrl={produto.imageUrl}
                    stockQuantity={produto.stockQuantity}
                    categoryName={produto.category.name}
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={200}>
            <div className="text-center mt-12">
              <Link href="/catalogo" className="btn-eco-outline inline-block transform hover:scale-105 transition-transform duration-200">
                Ver Catálogo Completo
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <ScrollReveal delay={100}>
              <div className="text-center p-6 group">
                <div className="w-16 h-16 bg-eco-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-eco-600 group-hover:text-white transition-all duration-300 transform group-hover:rotate-12">
                  <svg className="w-8 h-8 text-eco-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">100% Sustentável</h3>
                <p className="text-gray-500 text-sm">Produtos biodegradáveis que não agridem o meio ambiente.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="text-center p-6 group">
                <div className="w-16 h-16 bg-eco-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-eco-600 group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                  <svg className="w-8 h-8 text-eco-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Qualidade Garantida</h3>
                <p className="text-gray-500 text-sm">Fórmulas testadas e aprovadas com os melhores resultados.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="text-center p-6 group">
                <div className="w-16 h-16 bg-eco-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-eco-600 group-hover:text-white transition-all duration-300 transform group-hover:-translate-y-1">
                  <svg className="w-8 h-8 text-eco-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Alta Performance</h3>
                <p className="text-gray-500 text-sm">Produtos concentrados que rendem mais com menor impacto ambiental.</p>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* CTA */}
      <ScrollReveal>
        <section className="py-16 bg-eco-700">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Pronto para fazer a diferença?
            </h2>
            <p className="text-eco-100 text-lg mb-8">
              Junte-se a centenas de clientes que já adotaram a limpeza sustentável no seu dia a dia.
            </p>
            <Link href="/catalogo" className="btn-accent !text-eco-900 hover:!bg-accent-300 inline-block transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
              Começar a Comprar
            </Link>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}