import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'

export interface TipoProdutoDTO {
  id: number
  nome: string
  descricao: string | null
}

export const useTiposProduto = () =>
  useQuery<TipoProdutoDTO[]>({
    queryKey: ['tiposProduto'],
    queryFn: () => api.get('/tipos-produto').then(r => r.data),
    staleTime: 60_000,
  })

export const useTipoProduto = (id: number | undefined) =>
  useQuery<TipoProdutoDTO>({
    queryKey: ['tiposProduto', id],
    queryFn: () => api.get(`/tipos-produto/${id}`).then(r => r.data),
    enabled: !!id,
  })

const invalidate = (qc: ReturnType<typeof useQueryClient>) =>
  qc.invalidateQueries({ queryKey: ['tiposProduto'] })

export const useCriarTipoProduto = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (t: Omit<TipoProdutoDTO, 'id'>) =>
      api.post<TipoProdutoDTO>('/tipos-produto', t).then(r => r.data),
    onSuccess: () => invalidate(qc),
  })
}

export const useAtualizarTipoProduto = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...rest }: TipoProdutoDTO) =>
      api.put<TipoProdutoDTO>(`/tipos-produto/${id}`, rest).then(r => r.data),
    onSuccess: () => invalidate(qc),
  })
}

export const useExcluirTipoProduto = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/tipos-produto/${id}`),
    onSuccess: () => invalidate(qc),
  })
}
