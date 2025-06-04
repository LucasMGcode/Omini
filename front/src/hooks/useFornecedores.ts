// src/hooks/useProdutos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'

export interface ProdutoDTO {
  id: number
  nome: string
  descricao?: string | null
  codigoInterno?: string | null
  numeroLote?: string | null
  marca?: string | null
  fabricante?: string | null
  unidadeMedida?: string | null
  quantidadeEstoque: number
  estoqueMinimo: number
  dataValidade?: string | null
  dataEntrada?: string | null
  localizacao?: string | null
  observacoes?: string | null
  ativo: boolean
  tipoProdutoId?: number | null
  fornecedorId?: number | null
}

export type ProdutoForm = Omit<ProdutoDTO, 'id' | 'quantidadeEstoque'>

export const useProdutos = () =>
  useQuery<ProdutoDTO[]>({
    queryKey: ['produtos'],
    queryFn: () => api.get('/produtos').then(r => r.data),
    staleTime: 60_000,
  })

export const useProduto = (id: number) =>
  useQuery<ProdutoDTO>({
    queryKey: ['produtos', id],
    queryFn: () => api.get(`/produtos/${id}`).then(r => r.data),
    enabled: !!id,
  })

const invalidate = (qc: ReturnType<typeof useQueryClient>) =>
  qc.invalidateQueries({ queryKey: ['produtos'] })

export const useCriarProduto = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: ProdutoForm) =>
      api.post<ProdutoDTO>('/produtos', payload).then(r => r.data),
    onSuccess: () => invalidate(qc),
  })
}

export const useAtualizarProduto = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...rest }: ProdutoDTO) =>
      api.put<ProdutoDTO>(`/produtos/${id}`, rest).then(r => r.data),
    onSuccess: () => invalidate(qc),
  })
}

export const useExcluirProduto = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/produtos/${id}`),
    onSuccess: () => invalidate(qc),
  })
}

export const useMovimentarEstoque = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: { id: number; delta: number }) =>
      api.post<ProdutoDTO>(
        `/produtos/${params.id}/movimentar`,
        null,
        { params: { delta: params.delta } }
      ).then(r => r.data),
    onSuccess: () => invalidate(qc),
  })
}
