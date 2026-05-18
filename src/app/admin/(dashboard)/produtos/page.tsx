'use client';

import { useEffect, useState } from 'react';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  costPrice: number;
  salePrice: number;
  stockQuantity: number;
  imageUrl: string;
  categoryId: number;
  category: Category;
}

const emptyForm = {
  name: '',
  description: '',
  costPrice: 0,
  salePrice: 0,
  stockQuantity: 0,
  categoryId: 0,
  imageUrl: '',
};

export default function AdminProdutosPage() {
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function loadData() {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/produtos?limit=100'),
        fetch('/api/categorias'),
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();

      setProdutos(prodData.produtos || []);
      setCategorias(catData || []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm, categoryId: categorias[0]?.id || 0 });
    setError('');
    setShowModal(true);
  }

  function openEdit(produto: Product) {
    setEditingId(produto.id);
    setForm({
      name: produto.name,
      description: produto.description,
      costPrice: produto.costPrice,
      salePrice: produto.salePrice,
      stockQuantity: produto.stockQuantity,
      categoryId: produto.categoryId,
      imageUrl: produto.imageUrl,
    });
    setError('');
    setShowModal(true);
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Tem certeza que deseja excluir "${name}"?`)) return;

    try {
      const res = await fetch(`/api/produtos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProdutos((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error('Erro ao excluir:', err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = editingId ? `/api/produtos/${editingId}` : '/api/produtos';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao salvar');
      }

      if (editingId) {
        setProdutos((prev) => prev.map((p) => (p.id === editingId ? data : p)));
      } else {
        setProdutos((prev) => [data, ...prev]);
      }

      setShowModal(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const margemLucro = form.salePrice > 0
    ? (((form.salePrice - form.costPrice) / form.salePrice) * 100).toFixed(1)
    : '0';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-eco-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Produtos</h1>
          <p className="text-sm text-gray-500 mt-1">{produtos.length} produto(s) cadastrado(s)</p>
        </div>
        <button onClick={openCreate} className="btn-eco flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Produto
        </button>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-600 border-b">
                <th className="px-4 py-3 font-medium">Produto</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Preço Custo</th>
                <th className="px-4 py-3 font-medium">Preço Venda</th>
                <th className="px-4 py-3 font-medium">Margem</th>
                <th className="px-4 py-3 font-medium">Estoque</th>
                <th className="px-4 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => {
                const margem = ((produto.salePrice - produto.costPrice) / produto.salePrice * 100).toFixed(1);
                return (
                  <tr key={produto.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={produto.imageUrl} alt={produto.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{produto.name}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[200px]">{produto.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{produto.category.name}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {produto.costPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {produto.salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        Number(margem) >= 50 ? 'bg-accent-100 text-accent-700' :
                        Number(margem) >= 30 ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {margem}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {produto.stockQuantity < 5 ? (
                        <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          {produto.stockQuantity === 0 ? 'Esgotado' : produto.stockQuantity}
                        </span>
                      ) : (
                        <span className="text-gray-700">{produto.stockQuantity} unid.</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(produto)}
                          className="p-2 text-gray-400 hover:text-eco-600 transition-colors"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(produto.id, produto.name)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Excluir"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {produtos.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            Nenhum produto cadastrado ainda.
          </div>
        )}
      </div>

      {/* Modal - Criar/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-eco"
                  required
                  placeholder="Nome do produto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-eco"
                  rows={3}
                  required
                  placeholder="Descrição detalhada do produto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: parseInt(e.target.value) })}
                  className="input-eco"
                  required
                >
                  <option value={0} disabled>Selecione uma categoria</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Custo (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.costPrice || ''}
                    onChange={(e) => setForm({ ...form, costPrice: parseFloat(e.target.value) || 0 })}
                    className="input-eco"
                    required
                    placeholder="0,00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Venda (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.salePrice || ''}
                    onChange={(e) => setForm({ ...form, salePrice: parseFloat(e.target.value) || 0 })}
                    className="input-eco"
                    required
                    placeholder="0,00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade em Estoque *</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stockQuantity || ''}
                    onChange={(e) => setForm({ ...form, stockQuantity: parseInt(e.target.value) || 0 })}
                    className="input-eco"
                    required
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Margem calculada */}
              {form.salePrice > 0 && form.costPrice > 0 && (
                <div className={`p-3 rounded-lg text-sm ${
                  Number(margemLucro) >= 30 ? 'bg-accent-50 text-accent-700' : 'bg-yellow-50 text-yellow-700'
                }`}>
                  Margem de lucro: <strong>{margemLucro}%</strong>
                  {Number(margemLucro) < 30 && ' (Abaixo do recomendado)'}
                </div>
              )}

              {/* Estoque baixo alerta */}
              {form.stockQuantity < 5 && form.stockQuantity > 0 && (
                <div className="p-3 bg-accent-50 border border-accent-200 rounded-lg text-sm text-accent-700 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Estoque baixo! Apenas {form.stockQuantity} unidades.
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="input-eco"
                  placeholder="https://placehold.co/600x400/e2e8f0/475569?text=Produto"
                />
                <p className="text-xs text-gray-400 mt-1">Deixe em branco para usar imagem padrão. {/* IMPORTAR UPLOAD DE IMAGEM AQUI */}</p>
              </div>

              {/* Preview */}
              {form.imageUrl && (
                <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                  <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 btn-eco py-3 rounded-xl"
                >
                  {saving ? 'Salvando...' : editingId ? 'Atualizar Produto' : 'Criar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
