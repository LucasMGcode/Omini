import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'

export interface AlertaDTO {
  id:            number
  produtoId:     number
  produtoNome:   string
  tipoAlerta:    'ESTOQUE_MINIMO' | 'VALIDADE_PROXIMA'
  status:        'PENDENTE' | 'VISUALIZADO' | 'RESOLVIDO'
  dataGeracao:   string
  dataVisualizacao?: string
  dataResolucao?:   string
  mensagem:      string
}

export const useAlertas = () =>
  useQuery<AlertaDTO[]>({
    queryKey: ['alertas'],
    queryFn:  () => api.get('/alertas').then(r => r.data),
  })

export const useAlerta = (id: number | undefined) =>
  useQuery<AlertaDTO>({
    queryKey: ['alerta', id],
    queryFn:  () => api.get(`/alertas/${id}`).then(r => r.data),
    enabled:  !!id,
  })

const invalidateAlertas = (qc: ReturnType<typeof useQueryClient>) =>
  qc.invalidateQueries({ queryKey: ['alertas'] })

export const useMarcarVisualizado = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) =>
      api.put<AlertaDTO>(`/alertas/${id}/visualizar`).then(r => r.data),
    onSuccess: (_, id) => {
      invalidateAlertas(qc)
      qc.invalidateQueries({ queryKey: ['alerta', id] })
    },
  })
}

export const useResolverAlerta = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) =>
      api.put<AlertaDTO>(`/alertas/${id}/resolver`).then(r => r.data),
    onSuccess: (_, id) => {
      invalidateAlertas(qc)
      qc.invalidateQueries({ queryKey: ['alerta', id] })
    },
  })
}

export const useExcluirAlerta = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/alertas/${id}`),
    onSuccess: (_, id) => {
      invalidateAlertas(qc)
      qc.removeQueries({ queryKey: ['alerta', id] })
    },
  })
}
