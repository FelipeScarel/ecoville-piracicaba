import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthFromCookie } from '@/lib/auth';

// POST /api/pedidos - Criar pedido (checkout)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validar campos obrigatórios
    const required = ['customerName', 'customerEmail', 'customerPhone', 'address', 'city', 'state', 'zipCode', 'paymentMethod', 'items'];
    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json({ error: `Campo obrigatório: ${field}` }, { status: 400 });
      }
    }

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 });
    }

    // Calcular total e verificar estoque
    let subtotal = 0;
    const orderItems = [];

    for (const item of data.items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        return NextResponse.json({ error: `Produto ID ${item.productId} não encontrado` }, { status: 400 });
      }

      if (product.stockQuantity < item.quantity) {
        return NextResponse.json(
          { error: `Estoque insuficiente para "${product.name}". Disponível: ${product.stockQuantity}` },
          { status: 400 }
        );
      }

      subtotal += product.salePrice * item.quantity;
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.salePrice,
      });
    }

    const shipping = subtotal > 150 ? 0 : 19.90; // Frete grátis acima de R$150
    const total = subtotal + shipping;

    // Criar pedido e atualizar estoque
    const order = await prisma.order.create({
      data: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        paymentMethod: data.paymentMethod,
        subtotal,
        shipping,
        total,
        items: {
          create: orderItems,
        },
      },
      include: { items: true },
    });

    // Atualizar estoque
    for (const item of data.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { decrement: item.quantity } },
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return NextResponse.json({ error: 'Erro ao processar pedido' }, { status: 500 });
  }
}

// GET /api/pedidos - Listar pedidos (admin)
export async function GET() {
  try {
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const pedidos = await prisma.order.findMany({
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(pedidos);
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    return NextResponse.json({ error: 'Erro ao listar pedidos' }, { status: 500 });
  }
}
