import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useTiposProduto } from '@/hooks/useTiposProduto';
import { useFornecedores } from '@/hooks/useFornecedores';
import { useCriarProduto } from '@/hooks/useMutacoesProduto';
import type { ProdutoForm } from '@/hooks/useMutacoesProduto';
import { Save, ArrowLeft } from 'lucide-react';

export default function ProductRegistration() {
  const navigate = useNavigate();
  const { data: tipos = [], isLoading: loadingTipos } = useTiposProduto();
  const { data: fornecedores = [], isLoading: loadingForn } = useFornecedores();
  const criarProduto = useCriarProduto();
  const [showErrors, setShowErrors] = useState(false);

  const [form, setForm] = useState<ProdutoForm>({
    nome: '', descricao: '', codigoInterno: '', numeroLote: '', marca: '', fabricante: '',
    tipoProdutoId: 1, fornecedorId: undefined, unidadeMedida: '', quantidadeEstoque: 0,
    estoqueMinimo: 0, dataValidade: '', dataEntrada: new Date().toISOString().slice(0, 10),
    localizacao: '', observacoes: '', ativo: false, controladoPelaPF: false
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : (name.startsWith('quant') || name === 'estoqueMinimo' || name.includes('Id')
              ? value === '' ? undefined : Number(value)
              : value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);
    if (!form.nome || !form.dataValidade || !form.localizacao) return;

    const payload: ProdutoForm = { ...form, dataValidade: form.dataValidade || undefined };

    criarProduto.mutate(payload, {
      onSuccess: () => {
        alert('Produto cadastrado com sucesso!');
        navigate('/dashboard');
      },
      onError: (err: any) => {
        console.error(err);
        alert('Erro ao cadastrar. Veja o console para detalhes.');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-6">
          Cadastro de Produtos
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-4xl space-y-6 mx-auto"
        >
          <section>
            <h2 className="text-xl font-semibold text-purple-700 mb-2">Informações do Produto</h2>
            <div className="space-y-4">
              <label className="block font-medium text-gray-700 dark:text-gray-300">Nome *</label>
              <input
                name="nome"
                value={form.nome}
                onChange={onChange}
                placeholder="Ex.: Álcool 70%"
                className={`w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400 ${showErrors && !form.nome ? 'border-red-500' : 'border-gray-300'}`}
                required
              />
              {showErrors && !form.nome && <p className="text-sm text-red-500">Este campo é obrigatório.</p>}

              <label className="block font-medium text-gray-700 dark:text-gray-300">Descrição</label>
              <input name="descricao" value={form.descricao} onChange={onChange} placeholder="Descrição opcional"
                className="w-full rounded-xl border border-gray-300 px-4 py-2 placeholder:text-gray-400" />

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300">Tipo de Produto *</label>
                  <select name="tipoProdutoId" value={form.tipoProdutoId} onChange={onChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2" required disabled={loadingTipos}>
                    {tipos.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300">Fornecedor</label>
                  <select name="fornecedorId" value={form.fornecedorId ?? ''} onChange={onChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2" disabled={loadingForn}>
                    <option value="">-- sem fornecedor --</option>
                    {(Array.isArray(fornecedores) ? fornecedores : fornecedores.content ?? []).map(f => (
                      <option key={f.id} value={f.id}>{f.razaoSocial}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-purple-700 mb-2">Estoque e Identificação</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300">Código Interno</label>
                <input name="codigoInterno" value={form.codigoInterno} onChange={onChange} placeholder="Código Interno"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 placeholder:text-gray-400" />
              </div>
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300">Número do lote</label>
                <input name="numeroLote" value={form.numeroLote} onChange={onChange} placeholder="Número do lote"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 placeholder:text-gray-400" />
              </div>
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300">Marca</label>
                <input name="marca" value={form.marca} onChange={onChange} placeholder="Marca"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 placeholder:text-gray-400" />
              </div>
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300">Fabricante</label>
                <input name="fabricante" value={form.fabricante} onChange={onChange} placeholder="Fabricante"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 placeholder:text-gray-400" />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300">Unidade de Medida</label>
                <input name="unidadeMedida" value={form.unidadeMedida} onChange={onChange} placeholder="Unidade (kg, L, un)"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 placeholder:text-gray-400" />
              </div>
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300">Quantidade</label>
                <input name="quantidadeEstoque" type="number" min={0} value={form.quantidadeEstoque} onChange={onChange} placeholder="0"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 placeholder:text-gray-400" required />
              </div>
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300">Qtd. Mínima</label>
                <input name="estoqueMinimo" type="number" min={0} value={form.estoqueMinimo} onChange={onChange} placeholder="0"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 placeholder:text-gray-400" required />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-purple-700 mb-2">Datas</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300">Data de Validade *</label>
                <input name="dataValidade" type="date" value={form.dataValidade} onChange={onChange}
                  className={`w-full rounded-xl border px-4 py-2 placeholder:text-gray-400 ${showErrors && !form.dataValidade ? 'border-red-500' : 'border-gray-300'}`} required />
                {showErrors && !form.dataValidade && <p className="text-sm text-red-500">Campo obrigatório.</p>}
              </div>
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300">Data de Entrada</label>
                <input name="dataEntrada" type="date" value={form.dataEntrada} onChange={onChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 placeholder:text-gray-400" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-purple-700 mb-2">Armazenamento e Controle</h2>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Localização *</label>
            <input
              name="localizacao"
              value={form.localizacao}
              onChange={onChange}
              placeholder="Ex.: Freezer -20 ºC"
              title="Informe o local de armazenamento, ex.: Freezer -20 ºC"
              className={`w-full rounded-xl border px-4 py-2 placeholder:text-gray-400 ${showErrors && !form.localizacao ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {showErrors && !form.localizacao && <p className="text-sm text-red-500">Este campo é obrigatório.</p>}

            <div className="mt-4">
              <label className="block font-medium text-gray-700 dark:text-gray-300">Produto controlado pela Polícia Federal?</label>
              <select name="controladoPelaPF" value={form.controladoPelaPF.toString()} onChange={onChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-2">
                <option value="false">NÃO</option>
                <option value="true">SIM</option>
              </select>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-purple-700 mb-2">Observações</h2>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Observações adicionais</label>
            <textarea name="observacoes" value={form.observacoes} onChange={onChange} rows={3}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 resize-none placeholder:text-gray-400" placeholder="Ex: Produto entregue com embalagem danificada." />
          </section>

          <div className="flex justify-between mt-8">
            <Button type="button" onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Voltar
            </Button>
            <Button type="submit"
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2">
              <Save className="w-4 h-4" /> Salvar
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}