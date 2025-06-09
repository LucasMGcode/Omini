import React, { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useProdutos } from '@/hooks/useProdutos'
import {
  useCriarProduto,
  useAtualizarProduto,
  useExcluirProduto,
  useAjustarEstoque,
} from '@/hooks/useMutacoesProduto'
import type { ProdutoForm } from '@/hooks/useMutacoesProduto'

const ProdutosDemoPage: React.FC = () => {
  const { data: produtos, isLoading, error } = useProdutos()
  const criarProduto     = useCriarProduto()
  const excluirProduto   = useExcluirProduto()
  const ajustarEstoque   = useAjustarEstoque()
  const atualizarProduto = useAtualizarProduto()

  const [form, setForm] = useState<ProdutoForm>({
    nome: '',
    descricao: '',
    tipoProdutoId: 1,
    fornecedorId: undefined,
    unidadeMedida: '',
    marca: '',
    fabricante: '',
    quantidadeEstoque: 0,
    estoqueMinimo: 0,
    dataValidade: '',
    codigoInterno: '',
    numeroLote: '',
    localizacao: '',
  })

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name.startsWith('quant') || name === 'estoqueMinimo' || name.includes('Id')
        ? value === '' ? undefined : Number(value)
        : value
    }))
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    criarProduto.mutate(form, {
      onSuccess: () =>
        setForm({
          nome: '',
          descricao: '',
          tipoProdutoId: 1,
          fornecedorId: undefined,
          unidadeMedida: '',
          marca: '',
          fabricante: '',
          quantidadeEstoque: 0,
          estoqueMinimo: 0,
          dataValidade: '',
          codigoInterno: '',
          numeroLote: '',
          localizacao: '',
        }),
    })
  }

  if (isLoading) return <p className="p-6">Carregando produtos…</p>
  if (error) return <p className="p-6 text-red-500">Erro ao carregar produtos</p>

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Demo – Integração de Produtos</h1>

      <form onSubmit={onSubmit} className="max-w-3xl space-y-3">
        <h2 className="font-medium">Novo produto</h2>

        <input
          name="nome"
          placeholder="Nome do produto (ex: Álcool 70%)"
          value={form.nome}
          onChange={onChange}
          className="w-full rounded border px-3 py-2"
          required
        />

        <input
          name="descricao"
          placeholder="Descrição do produto (opcional)"
          value={form.descricao}
          onChange={onChange}
          className="w-full rounded border px-3 py-2"
        />

        <input
          name="tipoProdutoId"
          placeholder="ID do Tipo de Produto (ex: 1)"
          type="number"
          value={form.tipoProdutoId}
          onChange={onChange}
          className="w-full rounded border px-3 py-2"
          required
        />

        <input
          name="fornecedorId"
          placeholder="ID do Fornecedor (opcional)"
          type="number"
          value={form.fornecedorId ?? ''}
          onChange={onChange}
          className="w-full rounded border px-3 py-2"
        />

        <input
          name="unidadeMedida"
          placeholder="Unidade de Medida (ex: unidade, litro, kg)"
          value={form.unidadeMedida}
          onChange={onChange}
          className="w-full rounded border px-3 py-2"
        />

        <div className="flex gap-3">
          <input
            name="marca"
            placeholder="Marca (opcional)"
            value={form.marca}
            onChange={onChange}
            className="flex-1 rounded border px-3 py-2"
          />
          <input
            name="fabricante"
            placeholder="Fabricante (opcional)"
            value={form.fabricante}
            onChange={onChange}
            className="flex-1 rounded border px-3 py-2"
          />
        </div>

        <div className="flex gap-3">
          <input
            name="quantidadeEstoque"
            type="number"
            placeholder="Quantidade em estoque (ex: 50)"
            value={form.quantidadeEstoque}
            onChange={onChange}
            className="flex-1 rounded border px-3 py-2"
            required
          />
          <input
            name="estoqueMinimo"
            type="number"
            placeholder="Estoque mínimo (ex: 10)"
            value={form.estoqueMinimo}
            onChange={onChange}
            className="flex-1 rounded border px-3 py-2"
            required
          />
        </div>

        <input
          name="dataValidade"
          type="date"
          placeholder="Data de validade"
          value={form.dataValidade}
          onChange={onChange}
          className="w-full rounded border px-3 py-2"
        />

        <div className="flex gap-3">
          <input
            name="codigoInterno"
            placeholder="Código interno do produto (opcional)"
            value={form.codigoInterno}
            onChange={onChange}
            className="flex-1 rounded border px-3 py-2"
          />
          <input
            name="numeroLote"
            placeholder="Número do lote (opcional)"
            value={form.numeroLote}
            onChange={onChange}
            className="flex-1 rounded border px-3 py-2"
          />
        </div>

        <input
          name="localizacao"
          placeholder="Localização no estoque (opcional)"
          value={form.localizacao}
          onChange={onChange}
          className="w-full rounded border px-3 py-2"
        />

        <button
          type="submit"
          disabled={criarProduto.isPending}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {criarProduto.isPending ? 'Salvando…' : 'Cadastrar'}
        </button>
      </form>

      <table className="w-full border text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Nome</th>
            <th className="p-2">Estoque</th>
            <th className="p-2">Mínimo</th>
            <th className="p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos?.map(p => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.id}</td>
              <td className="p-2">{p.nome}</td>
              <td className="p-2">{p.quantidadeEstoque}</td>
              <td className="p-2">{p.estoqueMinimo}</td>
              <td className="flex gap-2 p-2">
                <button
                  onClick={() => ajustarEstoque.mutate({ id: p.id, delta: 1 })}
                  className="rounded bg-green-600/80 px-2 py-1 text-white"
                >
                  +1
                </button>
                <button
                  onClick={() => ajustarEstoque.mutate({ id: p.id, delta: -1 })}
                  className="rounded bg-yellow-500/90 px-2 py-1 text-white"
                >
                  –1
                </button>
                <button
                  onClick={() => excluirProduto.mutate(p.id)}
                  className="rounded bg-red-600/80 px-2 py-1 text-white"
                >
                  Del
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProdutosDemoPage
