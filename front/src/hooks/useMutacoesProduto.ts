import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'
import type { ProdutoDTO } from './useProdutos'

export interface ProdutoForm {
  nome:              string
  descricao?:        string
  codigoInterno?:    string
  numeroLote?:       string
  marca?:            string
  fabricante?:       string
  tipoProdutoId:     number
  fornecedorId?:     number
  unidadeMedida?:    string
  quantidadeEstoque: number
  estoqueMinimo:     number
  dataValidade?:     string
  dataEntrada?:      string
  observacoes?:      string
}

const invalidateProdutos = (qc: ReturnType<typeof useQueryClient>) =>
  qc.invalidateQueries({ queryKey: ['produtos'] })

export const useCriarProduto = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (form: ProdutoForm) =>
      api.post<ProdutoDTO>('/produtos', form).then(r => r.data),
    onSuccess: () => invalidateProdutos(qc),
  })
}

export const useAtualizarProduto = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, form }: { id: number; form: ProdutoForm }) =>
      api.put<ProdutoDTO>(`/produtos/${id}`, form).then(r => r.data),
    onSuccess: (_, { id }) => {
      invalidateProdutos(qc)
      qc.invalidateQueries({ queryKey: ['produto', id] })
    },
  })
}

export const useExcluirProduto = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/produtos/${id}`),
    onSuccess: (_, id) => {
      invalidateProdutos(qc)
      qc.removeQueries({ queryKey: ['produto', id] })
    },
  })
}

export const useAjustarEstoque = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, delta }: { id: number; delta: number }) =>
      api.patch<ProdutoDTO>(`/produtos/${id}/estoque`, null, { params: { delta } })
         .then(r => r.data),
    onSuccess: data => {
      invalidateProdutos(qc)
      qc.setQueryData(['produto', data.id], data)
    },
  })
}
