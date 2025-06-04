import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'

export interface AlertaDTO {
  id: number
  produtoId: number
  tipoAlerta: 'ESTOQUE_MINIMO' | 'VALIDADE_PROXIMA'
  mensagem: string
  status: 'PENDENTE' | 'VISUALIZADO' | 'RESOLVIDO'
  dataGeracao: string
}

export const useAlertasPendentes = () =>
  useQuery<AlertaDTO[]>({
    queryKey: ['alertas', 'pendentes'],
    queryFn: () => api.get('/alertas?status=PENDENTE').then(r => r.data),
    refetchInterval: 30_000,
  })

export const useMarcarAlertaResolvido = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.patch(`/alertas/${id}/resolver`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['alertas'] }),
  })
}