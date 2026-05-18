import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Limpar dados existentes
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.admin.deleteMany();

  // Criar Admin
  const passwordHash = await bcrypt.hash('admin123', 12);
  await prisma.admin.create({
    data: { username: 'admin', passwordHash },
  });
  console.log('Admin criado: admin / admin123');

  // Criar Categorias
  const categorias = await Promise.all([
    prisma.category.create({ data: { name: 'Limpeza Automotiva', slug: 'limpeza-automotiva' } }),
    prisma.category.create({ data: { name: 'Lavanderia', slug: 'lavanderia' } }),
    prisma.category.create({ data: { name: 'Cozinha', slug: 'cozinha' } }),
    prisma.category.create({ data: { name: 'Limpeza Industrial', slug: 'limpeza-industrial' } }),
    prisma.category.create({ data: { name: 'Casa e Jardim', slug: 'casa-e-jardim' } }),
    prisma.category.create({ data: { name: 'Higiene Pessoal', slug: 'higiene-pessoal' } }),
  ]);

  // Criar Produtos
  const produtos = [
    // Limpeza Automotiva
    { name: 'Shampoo Automotivo Eco 5L', description: 'Shampoo biodegradável para lavagem de veículos. Remove sujeira pesada sem agredir a pintura. Fórmula concentrada que rende até 50 lavagens.', costPrice: 18.50, salePrice: 34.90, stockQuantity: 45, categoryId: categorias[0].id, imageUrl: 'https://placehold.co/600x400/22c55e/ffffff?text=Shampoo+Automotivo' },
    { name: 'Cera Líquida Ecológica 500ml', description: 'Cera vegetal que proporciona brilho intenso e proteção UV. Não contém silicones ou derivados de petróleo.', costPrice: 22.00, salePrice: 42.90, stockQuantity: 30, categoryId: categorias[0].id, imageUrl: 'https://placehold.co/600x400/16a34a/ffffff?text=Cera+Liquida' },
    { name: 'Limpador de Estofados 1L', description: 'Limpa profundamente estofados e carpetes automotivos. Fórmula antialérgica com extrato de coco.', costPrice: 12.00, salePrice: 24.90, stockQuantity: 60, categoryId: categorias[0].id, imageUrl: 'https://placehold.co/600x400/15803d/ffffff?text=Limpador+Estofados' },
    { name: 'Desengraxante Automotivo 2L', description: 'Desengraxante potente para motores e peças. Biodegradável e seguro para uso em qualquer superfície metálica.', costPrice: 15.00, salePrice: 29.90, stockQuantity: 3, categoryId: categorias[0].id, imageUrl: 'https://placehold.co/600x400/166534/ffffff?text=Desengraxante' },

    // Lavanderia
    { name: 'Sabão Líquido Concentrado 2L', description: 'Sabão líquido ecológico para roupas. Remove manchas difíceis com fórmula à base de coco e glicerina vegetal.', costPrice: 8.00, salePrice: 18.90, stockQuantity: 100, categoryId: categorias[1].id, imageUrl: 'https://placehold.co/600x400/4ade80/166534?text=Sabao+Liquido' },
    { name: 'Amaciante Natural 2L', description: 'Amaciante com óleos essenciais de lavanda. Proporciona maciez sem resíduos químicos agressivos.', costPrice: 9.50, salePrice: 22.90, stockQuantity: 80, categoryId: categorias[1].id, imageUrl: 'https://placehold.co/600x400/86efac/166534?text=Amaciante' },
    { name: 'Tira Manchas Poderoso 500ml', description: 'Removedor de manchas para todos os tipos de tecido. Eficaz contra gordura, vinho, grama e sangue.', costPrice: 7.00, salePrice: 16.90, stockQuantity: 55, categoryId: categorias[1].id, imageUrl: 'https://placehold.co/600x400/bbf7d0/166534?text=Tira+Manchas' },
    { name: 'Alvejante Sem Cloro 1L', description: 'Alvejante oxigenado seguro para roupas coloridas. Alternativa ecológica ao cloro tradicional.', costPrice: 6.00, salePrice: 14.90, stockQuantity: 2, categoryId: categorias[1].id, imageUrl: 'https://placehold.co/600x400/dcfce7/166534?text=Alvejante' },

    // Cozinha
    { name: 'Desengordurante Cozinha 500ml', description: 'Desengordurante multiuso para fogões, coifas e superfícies. Fórmula cítrica com alto poder de corte de gordura.', costPrice: 6.50, salePrice: 15.90, stockQuantity: 120, categoryId: categorias[2].id, imageUrl: 'https://placehold.co/600x400/fbbf24/ffffff?text=Desengordurante' },
    { name: 'Detergente Lava-Louças 500ml', description: 'Detergente concentrado biodegradável. Remove gordura sem agredir as mãos.', costPrice: 3.50, salePrice: 8.90, stockQuantity: 200, categoryId: categorias[2].id, imageUrl: 'https://placehold.co/600x400/f59e0b/ffffff?text=Detergente' },
    { name: 'Limpador de Eletrodomésticos 500ml', description: 'Limpa e protege micro-ondas, geladeiras e fogões. Fórmula antialérgica e sem cheiro residual.', costPrice: 8.00, salePrice: 19.90, stockQuantity: 40, categoryId: categorias[2].id, imageUrl: 'https://placehold.co/600x400/d97706/ffffff?text=Limpador+Eletro' },

    // Limpeza Industrial
    { name: 'Desinfetante Industrial 5L', description: 'Desinfetante de amplo espectro para indústrias. Elimina 99,9% das bactérias. Registrado na ANVISA.', costPrice: 35.00, salePrice: 69.90, stockQuantity: 25, categoryId: categorias[3].id, imageUrl: 'https://placehold.co/600x400/0ea5e9/ffffff?text=Desinfetante+Industrial' },
    { name: 'Removedor de Ferrugem 1L', description: 'Fórmula avançada para remoção de ferrugem em máquinas e equipamentos industriais. Não corrosivo.', costPrice: 28.00, salePrice: 54.90, stockQuantity: 4, categoryId: categorias[3].id, imageUrl: 'https://placehold.co/600x400/0284c7/ffffff?text=Remove+Ferrugem' },
    { name: 'Desengraxante Pesado 5L', description: 'Desengraxante alcalino para uso industrial pesado. Ideal para pisos e maquinário.', costPrice: 42.00, salePrice: 79.90, stockQuantity: 18, categoryId: categorias[3].id, imageUrl: 'https://placehold.co/600x400/0369a1/ffffff?text=Desengraxante+Pesado' },

    // Casa e Jardim
    { name: 'Limpador Multiuso 1L', description: 'Limpa todas as superfícies laváveis da casa. Aroma natural de eucalipto. Não tóxico para pets.', costPrice: 5.50, salePrice: 13.90, stockQuantity: 150, categoryId: categorias[4].id, imageUrl: 'https://placehold.co/600x400/84cc16/ffffff?text=Multiuso' },
    { name: 'Limpador de Pisos 2L', description: 'Limpa e perfuma pisos frios, laminados e porcelanatos. Fórmula com extrato de laranja.', costPrice: 7.00, salePrice: 17.90, stockQuantity: 90, categoryId: categorias[4].id, imageUrl: 'https://placehold.co/600x400/65a30d/ffffff?text=Limpador+Pisos' },
    { name: 'Adubo Líquido para Plantas 1L', description: 'Fertilizante orgânico líquido para jardins. Rico em nutrientes essenciais. Embalagem reciclada.', costPrice: 10.00, salePrice: 24.90, stockQuantity: 35, categoryId: categorias[4].id, imageUrl: 'https://placehold.co/600x400/4d7c0f/ffffff?text=Adubo+Liquido' },

    // Higiene Pessoal
    { name: 'Sabonete Líquido Corporal 500ml', description: 'Sabonete hidratante com óleo de coco e aloe vera. Livre de sulfatos e parabenos.', costPrice: 8.50, salePrice: 19.90, stockQuantity: 75, categoryId: categorias[5].id, imageUrl: 'https://placehold.co/600x400/a855f7/ffffff?text=Sabonete+Corporal' },
    { name: 'Shampoo Sólido Anticaspa', description: 'Shampoo em barra artesanal com óleo de melaleuca. Zero plástico. Dura até 80 lavagens.', costPrice: 9.00, salePrice: 26.90, stockQuantity: 1, categoryId: categorias[5].id, imageUrl: 'https://placehold.co/600x400/9333ea/ffffff?text=Shampoo+Solido' },
    { name: 'Desodorante Natural 100g', description: 'Desodorante em creme com bicarbonato e óleo de coco. Proteção 24h sem alumínio.', costPrice: 6.00, salePrice: 17.90, stockQuantity: 55, categoryId: categorias[5].id, imageUrl: 'https://placehold.co/600x400/7e22ce/ffffff?text=Desodorante+Natural' },
  ];

  for (const produto of produtos) {
    await prisma.product.create({ data: produto });
  }

  console.log(`${produtos.length} produtos criados em ${categorias.length} categorias.`);
  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
