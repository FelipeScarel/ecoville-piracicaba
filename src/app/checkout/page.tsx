'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartContext';

type PaymentMethod = 'PIX' | 'CREDIT_CARD' | 'BOLETO';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [step, setStep] = useState<'form' | 'confirmation'>('form');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState<number | null>(null);
  const [pixCode, setPixCode] = useState('');

  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const shipping = subtotal > 150 ? 0 : 19.90;
  const total = subtotal + shipping;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function generatePixCode() {
    // Código PIX fictício para simulação
    return '00020126580014br.gov.bcb.pix0136ecoville-piracicaba@email.com.br5204000053039865405' + total.toFixed(2).replace('.', '') + '5802BR5925Ecoville Piracicaba6009Sao Paulo62070503***6304E3CA';
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          paymentMethod,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao processar pedido');
      }

      setOrderId(data.id);
      if (paymentMethod === 'PIX') {
        setPixCode(generatePixCode());
      }
      setStep('confirmation');
      clearCart();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0 && step === 'form') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-3">Carrinho vazio</h2>
        <p className="text-gray-500 mb-8">Adicione produtos antes de finalizar a compra.</p>
        <button onClick={() => router.push('/catalogo')} className="btn-accent">
          Ver Produtos
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Checkout</h1>

      {step === 'confirmation' ? (
        /* Confirmação do Pedido */
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pedido Confirmado!</h2>
          <p className="text-gray-500 mb-2">Pedido #{orderId} realizado com sucesso.</p>
          <p className="text-gray-500 mb-8">Enviaremos atualizações para {form.customerEmail}</p>

          {/* Payment instructions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 text-left">
            {paymentMethod === 'PIX' && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Pagamento via PIX</h3>
                {/* QR Code Placeholder */}
                <div className="w-48 h-48 bg-gray-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  {/* IMPORTAR QR CODE REAL AQUI: Integrar com API de pagamento */}
                  <div className="text-center">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2m4 0h-2m-6-8v1m6 4h2m-6 0h-2m4 0h-2M6 8h2m0 0h2M8 8v4m0 0H6m2 0h2" />
                    </svg>
                    <span className="text-xs text-gray-400">QR Code PIX</span>
                  </div>
                </div>

                <label className="text-sm font-medium text-gray-700">Código PIX (Copia e Cola):</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={pixCode}
                    readOnly
                    className="input-eco text-xs bg-gray-50 flex-1"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(pixCode);
                    }}
                    className="btn-eco text-sm !px-4 whitespace-nowrap"
                  >
                    Copiar
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">O código PIX expira em 30 minutos.</p>
              </div>
            )}

            {paymentMethod === 'CREDIT_CARD' && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Pagamento com Cartão</h3>
                <p className="text-accent-600 font-medium">
                  Pagamento aprovado! (Simulação)
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Seu cartão foi processado com sucesso. O valor de {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} será cobrado na sua fatura.
                </p>
              </div>
            )}

            {paymentMethod === 'BOLETO' && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Boleto Bancário</h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2">Código de barras:</p>
                  <p className="text-lg font-mono font-bold text-gray-800 tracking-wider">
                    34191.79001 01043.510047 91020.150008 9 999900000{total.toFixed(2).replace('.', '')}
                  </p>
                </div>
                <button className="btn-accent-outline text-sm w-full">
                  Baixar Boleto (PDF)
                </button>
                <p className="text-xs text-gray-400 mt-2">Vencimento em 3 dias úteis.</p>
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-center">
            <button onClick={() => router.push('/catalogo')} className="btn-eco-outline">
              Continuar Comprando
            </button>
            <button onClick={() => router.push('/')} className="btn-accent">
              Ir para Home
            </button>
          </div>
        </div>
      ) : (
        /* Formulário */
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna esquerda - Formulário */}
            <div className="lg:col-span-2 space-y-6">
              {/* Dados Pessoais */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-bold text-gray-800 text-lg mb-4">Dados de Entrega</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                    <input type="text" name="customerName" value={form.customerName} onChange={handleChange} required className="input-eco" placeholder="Seu nome completo" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                    <input type="email" name="customerEmail" value={form.customerEmail} onChange={handleChange} required className="input-eco" placeholder="seu@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
                    <input type="tel" name="customerPhone" value={form.customerPhone} onChange={handleChange} required className="input-eco" placeholder="(19) 99999-9999" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Endereço *</label>
                    <input type="text" name="address" value={form.address} onChange={handleChange} required className="input-eco" placeholder="Rua, número, complemento" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
                    <input type="text" name="city" value={form.city} onChange={handleChange} required className="input-eco" placeholder="Piracicaba" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                    <input type="text" name="state" value={form.state} onChange={handleChange} required className="input-eco" placeholder="SP" maxLength={2} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CEP *</label>
                    <input type="text" name="zipCode" value={form.zipCode} onChange={handleChange} required className="input-eco" placeholder="13400-000" />
                  </div>
                </div>
              </div>

              {/* Pagamento */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-bold text-gray-800 text-lg mb-4">Forma de Pagamento</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  {[
                    { value: 'PIX' as PaymentMethod, label: 'PIX', desc: 'Aprovação instantânea', icon: '⚡' },
                    { value: 'CREDIT_CARD' as PaymentMethod, label: 'Cartão de Crédito', desc: 'Até 3x sem juros', icon: '💳' },
                    { value: 'BOLETO' as PaymentMethod, label: 'Boleto', desc: 'Vencimento em 3 dias', icon: '📄' },
                  ].map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setPaymentMethod(method.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        paymentMethod === method.value
                          ? 'border-accent-500 bg-accent-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <h3 className="font-semibold text-gray-800 mt-2">{method.label}</h3>
                      <p className="text-xs text-gray-500">{method.desc}</p>
                    </button>
                  ))}
                </div>

                {/* Campos cartão de crédito */}
                {paymentMethod === 'CREDIT_CARD' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Número do Cartão</label>
                      <input type="text" className="input-eco bg-white" placeholder="0000 0000 0000 0000" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Validade</label>
                      <input type="text" className="input-eco bg-white" placeholder="MM/AA" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input type="text" className="input-eco bg-white" placeholder="123" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome no Cartão</label>
                      <input type="text" className="input-eco bg-white" placeholder="Nome impresso no cartão" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Coluna direita - Resumo */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
                <h2 className="font-bold text-gray-800 text-lg mb-4">Resumo do Pedido</h2>

                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3 text-sm">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-700 truncate">{item.name}</p>
                        <p className="text-gray-500">Qtd: {item.quantity}</p>
                      </div>
                      <span className="font-medium flex-shrink-0">
                        {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Frete</span>
                    <span className={shipping === 0 ? 'text-accent-600' : ''}>
                      {shipping === 0 ? 'Grátis' : shipping.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-eco-700">{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-accent w-full mt-6"
                >
                  {loading ? 'Processando...' : 'Finalizar Pedido'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
