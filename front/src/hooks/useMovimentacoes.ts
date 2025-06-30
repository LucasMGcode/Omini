import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'
export interface MovimentacaoDTO {
  id: number
  produtoId: number
  produtoNome: string
  usuarioId: number
  usuarioLogin: string
  tipoMovimentacao: 'ENTRADA' | 'SAIDA_USO' | 'SAIDA_DESCARTE' | 'AJUSTE_POSITIVO' | 'AJUSTE_NEGATIVO'
  quantidade: number
  dataMovimentacao: string
  justificativa?: string
  projetoAssociado?: string
  observacoes?: string
}

export interface MovimentacaoCreate {
  produtoId: number
  usuarioId: number
  tipoMovimentacao: MovimentacaoDTO['tipoMovimentacao']
  quantidade: number
  justificativa?: string
  projetoAssociado?: string
  observacoes?: string
}

export const useMovimentacoes = (page = 0, size = 10) =>
  useQuery<{
    content: MovimentacaoDTO[];
    totalPages: number;
    totalElements: number;
    number: number;
  }>({
    queryKey: ['movimentacoes', page, size],
    queryFn: () =>
      api.get('/movimentacoes', {
        params: { page, size }
      }).then(r => r.data),
    staleTime: 60_000,
  });


export const useMovimentacao = (id: number | undefined) =>
  useQuery<MovimentacaoDTO>({
    queryKey: ['movimentacao', id],
    queryFn: () => api.get(`/movimentacoes/${id}`).then(r => r.data),
    enabled: !!id,
  })

const invalidateMovs = (qc: ReturnType<typeof useQueryClient>) =>
  qc.invalidateQueries({ queryKey: ['movimentacoes'] })

export const useRegistrarMovimentacao = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: MovimentacaoCreate) =>
      api.post<MovimentacaoDTO>('/movimentacoes', payload).then(r => r.data),
    onSuccess: () => invalidateMovs(qc),
  })
}

export const useExcluirMovimentacao = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/movimentacoes/${id}`),
    onSuccess: (_, id) => {
      invalidateMovs(qc)
      qc.removeQueries({ queryKey: ['movimentacao', id] })
    },
  })
}
