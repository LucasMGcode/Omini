import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'

/* ---------- Tipagem (DTO) ---------- */
export interface TipoProdutoDTO {
  id: number
  nome: string
  descricao?: string | null
}

/* ---------- Query de lista ---------- */
export const useTiposProduto = () =>
  useQuery<TipoProdutoDTO[]>({
    queryKey: ['tiposProduto'],
    queryFn: () => api.get('/tipos-produto').then(r => r.data),
    staleTime: 60_000, // 1 min – ajuste se quiser
  })

/* ---------- Query de detalhe ---------- */
export const useTipoProduto = (id: number) =>
  useQuery<TipoProdutoDTO>({
    queryKey: ['tiposProduto', id],
    queryFn: () => api.get(`/tipos-produto/${id}`).then(r => r.data),
    enabled: !!id,
  })

/* ---------- Invalidador de cache ---------- */
const invalidate = (qc: ReturnType<typeof useQueryClient>) =>
  qc.invalidateQueries({ queryKey: ['tiposProduto'] })

/* ---------- Mutations ---------- */
export const useCriarTipoProduto = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Omit<TipoProdutoDTO, 'id'>) =>
      api.post<TipoProdutoDTO>('/tipos-produto', payload),
    onSuccess: () => invalidate(qc),
  })
}

export const useAtualizarTipoProduto = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...rest }: TipoProdutoDTO) =>
      api.put<TipoProdutoDTO>(`/tipos-produto/${id}`, rest),
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