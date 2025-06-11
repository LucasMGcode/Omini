import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'

import { useTiposProduto } from '@/hooks/useTiposProduto'
import { useFornecedores } from '@/hooks/useFornecedores'
import { useCriarProduto } from '@/hooks/useMutacoesProduto'
import type { ProdutoForm } from '@/hooks/useMutacoesProduto'

/* ---------- componente ---------- */
export default function ProductRegistration() {
  const navigate = useNavigate()

  /* ---------- hooks de apoio ---------- */
  const { data: tipos = [], isLoading: loadingTipos } = useTiposProduto()
  const { data: fornecedores = [], isLoading: loadingForn } = useFornecedores()
  const criarProduto = useCriarProduto()

  /* ---------- estado local ---------- */
  const [form, setForm] = useState<ProdutoForm>({
    nome: '',
    descricao: '',
    codigoInterno: '',
    numeroLote: '',
    marca: '',
    fabricante: '',
    tipoProdutoId: 1,
    fornecedorId: undefined,
    unidadeMedida: '',
    quantidadeEstoque: 0,
    estoqueMinimo: 0,
    dataValidade: '',        // string yyyy-MM-dd
    dataEntrada: new Date().toISOString().slice(0, 10), // data atual
    localizacao: '',
    observacoes: '',
  })

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name.startsWith('quant') || name === 'estoqueMinimo' || name.includes('Id')
        ? value === '' ? undefined : Number(value)
        : value
    }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payload: ProdutoForm = {
      ...form,
      dataValidade: form.dataValidade || undefined, // se vazio envia undefined
    }

    criarProduto.mutate(payload, {
      onSuccess: () => {
        alert('Produto cadastrado com sucesso!')
        navigate('/dashboard')
      },
      onError: (err: any) => {
        console.error(err)
        alert('Erro ao cadastrar. Veja o console para detalhes.')
      },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-6">
          Cadastro de Produtos
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur p-8 rounded-2xl shadow-xl max-w-3xl space-y-5 mx-auto"
        >
          {/* nome + descrição */}
          <div className="space-y-2">
            <label className="block font-medium">Nome *</label>
            <input
              name="nome"
              value={form.nome}
              onChange={onChange}
              placeholder="Ex: Álcool 70 %"
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block font-medium">Descrição</label>
            <input
              name="descricao"
              value={form.descricao}
              onChange={onChange}
              placeholder="Descrição opcional"
              className="w-full rounded border px-3 py-2"
            />
          </div>

          {/* tipo & fornecedor */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block font-medium">Tipo de Produto *</label>
              <select
                name="tipoProdutoId"
                value={form.tipoProdutoId}
                onChange={onChange}
                className="w-full rounded border px-3 py-2"
                disabled={loadingTipos}
                required
              >
                {tipos.map(t => (
                  <option key={t.id} value={t.id}>{t.nome}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block font-medium">Fornecedor</label>
              <select
                name="fornecedorId"
                value={form.fornecedorId ?? ''}
                onChange={onChange}
                className="w-full rounded border px-3 py-2"
                disabled={loadingForn}
              >
                <option value="">-- sem fornecedor --</option>
                {(Array.isArray(fornecedores)
                  ? fornecedores
                  : fornecedores.content ?? []
                ).map(f => (
                  <option key={f.id} value={f.id}>{f.razaoSocial}</option>
                ))}
              </select>
            </div>
          </div>

          {/* códigos/lote/marca/fabricante */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="codigoInterno"
              value={form.codigoInterno}
              onChange={onChange}
              placeholder="Código interno"
              className="w-full rounded border px-3 py-2"
            />
            <input
              name="numeroLote"
              value={form.numeroLote}
              onChange={onChange}
              placeholder="Número do lote"
              className="w-full rounded border px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              name="marca"
              value={form.marca}
              onChange={onChange}
              placeholder="Marca"
              className="w-full rounded border px-3 py-2"
            />
            <input
              name="fabricante"
              value={form.fabricante}
              onChange={onChange}
              placeholder="Fabricante"
              className="w-full rounded border px-3 py-2"
            />
          </div>

          {/* quantidade, estoque mínimo, unidade */}
          <div className="grid grid-cols-3 gap-4">
            <input
              name="unidadeMedida"
              value={form.unidadeMedida}
              onChange={onChange}
              placeholder="kg / L / un"
              className="w-full rounded border px-3 py-2"
            />
            <input
              name="quantidadeEstoque"
              type="number"
              min={0}
              value={form.quantidadeEstoque}
              onChange={onChange}
              className="w-full rounded border px-3 py-2"
              required
            />
            <input
              name="estoqueMinimo"
              type="number"
              min={0}
              value={form.estoqueMinimo}
              onChange={onChange}
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>

          {/* datas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block font-medium">Data de Validade *</label>
              <input
                name="dataValidade"
                type="date"
                value={form.dataValidade}
                onChange={onChange}
                className="w-full rounded border px-3 py-2"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block font-medium">Data de Entrada *</label>
              <input
                name="dataEntrada"
                type="date"
                value={form.dataEntrada}
                onChange={onChange}
                className="w-full rounded border px-3 py-2"
              />
            </div>
          </div>

          {/* local + observações */}
          <input
            name="localizacao"
            value={form.localizacao}
            onChange={onChange}
            placeholder="Localização (Ex.: Freezer -20 °C)"
            className="w-full rounded border px-3 py-2"
          />
          <textarea
            name="observacoes"
            value={form.observacoes}
            onChange={onChange}
            rows={3}
            placeholder="Observações"
            className="w-full rounded border px-3 py-2 resize-none"
          />

          {/* Botões */}
          <div className="flex justify-between mt-6">
            <Button type="button"
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 px-8 py-3 rounded-xl font-montserrat shadow-lg hover:shadow-xl transition-all duration-300 mr-75 hover:cursor-pointer">
              Voltar
            </Button>
            <Button type="submit"
              className="bg-gradient-to-r 
                    from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 px-8 py-3 rounded-xl font-montserrat shadow-lg hover:shadow-xl transition-all duration-300 hover:cursor-pointer" >
              Salvar
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
