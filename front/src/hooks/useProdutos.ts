import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'

export interface ProdutoDTO {
  id: number
  nome: string
  marca: string
  quantidadeEstoque: number
  estoqueMinimo: number
  dataValidade: string | null
  tipoProdutoId: number | null
  fornecedorId: number | null
}

export const useProdutos = () =>
  useQuery<ProdutoDTO[]>({
    queryKey: ['produtos'],
    queryFn: () =>
      api.get('/produtos').then(r => r.data.content),
    staleTime: 60_000,
  })

export const useProduto = (id: number | undefined) =>
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
    mutationFn: (p: Omit<ProdutoDTO, 'id'>) =>
      api.post<ProdutoDTO>('/produtos', p).then(r => r.data),
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
