'use client';

import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';

interface DashboardData {
  faturamentoTotal: number;
  lucroLiquido: number;
  margemLucro: number;
  ticketMedio: number;
  estoqueBaixo: number;
  totalProdutos: number;
  totalPedidos: number;
  ultimosPedidos: {
    id: number;
    cliente: string;
    total: number;
    status: string;
    data: string;
    metodo: string;
  }[];
  dadosMensais: {
    mes: string;
    faturamento: number;
    pedidos: number;
  }[];
}

const statusLabels: Record<string, string> = {
  PENDING: 'Pendente',
  PAID: 'Pago',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
};

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-accent-100 text-accent-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-eco-600 border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-12 text-gray-500">Erro ao carregar dashboard.</div>;
  }

  const cards = [
    { label: 'Faturamento Total', value: data.faturamentoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), color: 'from-eco-500 to-eco-600' },
    { label: 'Lucro Líquido', value: data.lucroLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), color: 'from-emerald-500 to-emerald-600' },
    { label: 'Margem de Lucro Média', value: `${data.margemLucro}%`, color: 'from-blue-500 to-blue-600' },
    { label: 'Ticket Médio', value: data.ticketMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Financeiro</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => (
          <div key={i} className={`bg-gradient-to-r ${card.color} rounded-xl p-5 text-white shadow-lg`}>
            <p className="text-sm opacity-90 mb-1">{card.label}</p>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Sub cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estoque Baixo</p>
              <p className="text-xl font-bold text-gray-800">{data.estoqueBaixo} <span className="text-sm font-normal text-gray-500">produtos</span></p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-eco-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-eco-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total de Produtos</p>
              <p className="text-xl font-bold text-gray-800">{data.totalProdutos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total de Pedidos</p>
              <p className="text-xl font-bold text-gray-800">{data.totalPedidos}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Faturamento Mensal */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Faturamento Mensal</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.dadosMensais}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: number) => [value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 'Faturamento']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Bar dataKey="faturamento" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pedidos por Mês */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Pedidos por Mês</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.dadosMensais}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Line type="monotone" dataKey="pedidos" stroke="#16a34a" strokeWidth={3} dot={{ fill: '#16a34a', r: 5 }} name="Pedidos" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Últimos Pedidos */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Últimos Pedidos</h2>
        {data.ultimosPedidos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-3 font-medium">Pedido</th>
                  <th className="pb-3 font-medium">Cliente</th>
                  <th className="pb-3 font-medium">Método</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {data.ultimosPedidos.map((pedido) => (
                  <tr key={pedido.id} className="border-b last:border-0">
                    <td className="py-3 font-medium text-gray-800">#{pedido.id}</td>
                    <td className="py-3 text-gray-600">{pedido.cliente}</td>
                    <td className="py-3 text-gray-600">
                      {pedido.metodo === 'PIX' ? 'PIX' : pedido.metodo === 'CREDIT_CARD' ? 'Crédito' : 'Boleto'}
                    </td>
                    <td className="py-3 font-medium text-gray-800">
                      {pedido.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[pedido.status] || 'bg-gray-100 text-gray-800'}`}>
                        {statusLabels[pedido.status] || pedido.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">
                      {new Date(pedido.data).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">Nenhum pedido realizado ainda.</p>
        )}
      </div>
    </div>
  );
}
