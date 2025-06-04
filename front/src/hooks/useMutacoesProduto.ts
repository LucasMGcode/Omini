import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'
import type { ProdutoDTO } from './useProdutos'

const invalidate = (qc: ReturnType<typeof useQueryClient>) =>
  qc.invalidateQueries({ queryKey: ['produtos'] })

export const useCriarProduto = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p: Omit<ProdutoDTO, 'id'>) =>
      api.post<ProdutoDTO>('/produtos', p),
    onSuccess: () => invalidate(qc),
  })
}

export const useAtualizarProduto = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...rest }: ProdutoDTO) =>
      api.put<ProdutoDTO>(`/produtos/${id}`, rest),
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
