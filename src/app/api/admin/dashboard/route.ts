import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthFromCookie } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Buscar pedidos
    const pedidos = await prisma.order.findMany({
      include: {
        items: { include: { product: true } },
      },
    });

    // Buscar produtos para métricas
    const produtos = await prisma.product.findMany();

    // Faturamento total (soma de todos os pedidos)
    const faturamentoTotal = pedidos.reduce((sum, p) => sum + p.total, 0);

    // Lucro líquido (soma do lucro de cada item vendido)
    let lucroLiquido = 0;
    let custoTotal = 0;
    for (const pedido of pedidos) {
      for (const item of pedido.items) {
        const product = produtos.find((p) => p.id === item.productId);
        if (product) {
          lucroLiquido += (item.unitPrice - product.costPrice) * item.quantity;
          custoTotal += product.costPrice * item.quantity;
        }
      }
    }

    // Margem de lucro média
    const margemLucro = faturamentoTotal > 0 ? (lucroLiquido / faturamentoTotal) * 100 : 0;

    // Ticket médio
    const ticketMedio = pedidos.length > 0 ? faturamentoTotal / pedidos.length : 0;

    // Produtos com estoque baixo
    const estoqueBaixo = produtos.filter((p) => p.stockQuantity < 5).length;

    // Total de produtos
    const totalProdutos = produtos.length;

    // Total de pedidos
    const totalPedidos = pedidos.length;

    // Vendas por categoria
    const vendasPorCategoria: Record<string, number> = {};
    for (const pedido of pedidos) {
      for (const item of pedido.items) {
        const product = produtos.find((p) => p.id === item.productId);
        if (product) {
          const catName = product.categoryId.toString();
          if (!vendasPorCategoria[catName]) vendasPorCategoria[catName] = 0;
          vendasPorCategoria[catName] += item.unitPrice * item.quantity;
        }
      }
    }

    // Últimos pedidos (top 5)
    const ultimosPedidos = pedidos.slice(0, 5).map((p) => ({
      id: p.id,
      cliente: p.customerName,
      total: p.total,
      status: p.status,
      data: p.createdAt.toISOString(),
      metodo: p.paymentMethod,
    }));

    // Dados mensais para gráfico (últimos 6 meses simulados)
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const dadosMensais = [];
    const hoje = new Date();

    for (let i = 5; i >= 0; i--) {
      const mesRef = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mesLabel = meses[mesRef.getMonth()];
      const pedidosMes = pedidos.filter((p) => {
        const d = new Date(p.createdAt);
        return d.getMonth() === mesRef.getMonth() && d.getFullYear() === mesRef.getFullYear();
      });
      const totalMes = pedidosMes.reduce((s, p) => s + p.total, 0);
      dadosMensais.push({ mes: mesLabel, faturamento: totalMes, pedidos: pedidosMes.length });
    }

    return NextResponse.json({
      faturamentoTotal,
      lucroLiquido,
      margemLucro: Math.round(margemLucro * 100) / 100,
      ticketMedio: Math.round(ticketMedio * 100) / 100,
      estoqueBaixo,
      totalProdutos,
      totalPedidos,
      ultimosPedidos,
      dadosMensais,
    });
  } catch (error) {
    console.error('Erro ao buscar dashboard:', error);
    return NextResponse.json({ error: 'Erro ao carregar dashboard' }, { status: 500 });
  }
}
