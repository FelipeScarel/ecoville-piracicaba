import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-eco-900 text-white">
      {/* Instagram Section */}
      <section className="border-b border-eco-800 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-2">Siga nosso Instagram</h3>
          <p className="text-eco-300 mb-6">@ecovillepiracicaba</p>

          {/* Instagram Feed Placeholder */}
         
  {/* Instagram Feed */}
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
    {[
      'https://i.imgur.com/brQUVgA.jpeg',
      'https://linktr.ee/og/image/ecovillepiracicaba.jpg',
      'https://linktr.ee/og/image/ecovillepiracicaba.jpg',
      'https://i.imgur.com/brQUVgA.jpeghttps://i.imgur.com/foto4.jpg',
      'https://i.imgur.com/brQUVgA.jpeg',
      'https://linktr.ee/og/image/ecovillepiracicaba.jpg',
    ].map((src, i) => (
      <a
        key={i}
        href="https://www.instagram.com/ecovillepiracicaba/"
        target="_blank"
        rel="noopener noreferrer"
        className="aspect-square bg-eco-800 rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
      >
        <img src={src} alt={`Instagram ${i + 1}`} className="w-full h-full object-cover" />
      </a>
    ))}
  </div>
        </div>
      </section>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-eco-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              {/* IMPORTAR LOGO AQUI: Substituir por imagem da logo */}
              <div>
                <h4 className="text-lg font-bold">Ecoville</h4>
                <p className="text-xs text-eco-400">Piracicaba</p>
              </div>
            </div>
            <p className="text-eco-300 text-sm leading-relaxed">
              Produtos de limpeza sustentáveis que respeitam o meio ambiente e cuidam da sua família.
            </p>
          </div>

          {/* Links */}
          <div>
            <h5 className="font-semibold mb-4 text-eco-200">Links Rápidos</h5>
            <ul className="space-y-2 text-sm text-eco-300">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/catalogo" className="hover:text-white transition-colors">Catálogo</Link></li>
              <li><Link href="/carrinho" className="hover:text-white transition-colors">Carrinho</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h5 className="font-semibold mb-4 text-eco-200">Categorias</h5>
            <ul className="space-y-2 text-sm text-eco-300">
              <li><Link href="/catalogo?categoria=limpeza-automotiva" className="hover:text-white transition-colors">Limpeza Automotiva</Link></li>
              <li><Link href="/catalogo?categoria=lavanderia" className="hover:text-white transition-colors">Lavanderia</Link></li>
              <li><Link href="/catalogo?categoria=cozinha" className="hover:text-white transition-colors">Cozinha</Link></li>
              <li><Link href="/catalogo?categoria=limpeza-industrial" className="hover:text-white transition-colors">Limpeza Industrial</Link></li>
              <li><Link href="/catalogo?categoria=casa-e-jardim" className="hover:text-white transition-colors">Casa e Jardim</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="font-semibold mb-4 text-eco-200">Contato</h5>
            <ul className="space-y-2 text-sm text-eco-300">
              <li>contato@ecovillepiracicaba.com.br</li>
              <li>(19) 99999-9999</li>
              <li>Piracicaba - SP</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-eco-800 text-center text-sm text-eco-500">
          <p>&copy; {new Date().getFullYear()} Ecoville Piracicaba. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
