import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'

export interface PerfilDTO {
  id:        number
  nome:      string
  descricao: string | null
}

export interface PerfilCreate {
  nome:      string
  descricao?: string
}

export type PerfilUpdate = Partial<PerfilCreate> & { id: number }

export const usePerfis = () =>
  useQuery<PerfilDTO[]>({
    queryKey: ['perfis'],
    queryFn:  () => api.get('/perfis').then(r => r.data),
  })

export const usePerfil = (id: number | undefined) =>
  useQuery<PerfilDTO>({
    queryKey: ['perfil', id],
    queryFn:  () => api.get(`/perfis/${id}`).then(r => r.data),
    enabled:  !!id,
  })

const invalidatePerfis = (qc: ReturnType<typeof useQueryClient>) =>
  qc.invalidateQueries({ queryKey: ['perfis'] })

export const useCriarPerfil = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: PerfilCreate) =>
      api.post<PerfilDTO>('/perfis', payload).then(r => r.data),
    onSuccess: () => invalidatePerfis(qc),
  })
}

export const useAtualizarPerfil = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...rest }: PerfilUpdate) =>
      api.put<PerfilDTO>(`/perfis/${id}`, rest).then(r => r.data),
    onSuccess: (_, { id }) => {
      invalidatePerfis(qc)
      qc.invalidateQueries({ queryKey: ['perfil', id] })
    },
  })
}

export const useExcluirPerfil = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/perfis/${id}`),
    onSuccess: (_, id) => {
      invalidatePerfis(qc)
      qc.removeQueries({ queryKey: ['perfil', id] })
    },
  })
}
