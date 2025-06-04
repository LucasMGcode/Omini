import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'

export interface MovimentacaoDTO {
  id: number
  produtoId: number
  usuarioId: number
  tipoMovimentacao: 'ENTRADA' | 'SAIDA_USO' | 'SAIDA_DESCARTE' | 'AJUSTE_POSITIVO' | 'AJUSTE_NEGATIVO'
  quantidade: number
  dataMovimentacao: string
  observacoes?: string
}

export const useMovimentacoes = () =>
  useQuery<MovimentacaoDTO[]>({
    queryKey: ['movimentacoes'],
    queryFn: () => api.get('/movimentacoes').then(r => r.data),
  })

export const useRegistrarMovimentacao = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (m: Omit<MovimentacaoDTO, 'id' | 'dataMovimentacao'>) =>
      api.post<MovimentacaoDTO>('/movimentacoes', m),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['movimentacoes', 'produtos'] }),
  })
}