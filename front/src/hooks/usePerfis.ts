// src/hooks/usePerfis.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'

/** Registro que o back-end devolve */
export interface PerfilDTO {
  id: number
  nome: string
  descricao?: string
}

/** Payload de criação / edição */
export type PerfilForm = Omit<PerfilDTO, 'id'>

/** Lista de perfis (sem paginação) */
export const usePerfis = () =>
  useQuery<PerfilDTO[]>({
    queryKey: ['perfis'],
    queryFn: () => api.get('/perfis').then(r => r.data),
    staleTime: 60_000,
  })

/** Detalhe de um perfil */
export const usePerfil = (id: number) =>
  useQuery<PerfilDTO>({
    queryKey: ['perfis', id],
    queryFn: () => api.get(`/perfis/${id}`).then(r => r.data),
    enabled: !!id,
  })

const invalidate = (qc: ReturnType<typeof useQueryClient>) =>
  qc.invalidateQueries({ queryKey: ['perfis'] })

/* Criar -------------------------------------------------------------------- */
export const useCriarPerfil = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: PerfilForm) =>
      api.post<PerfilDTO>('/perfis', data).then(r => r.data),
    onSuccess: () => invalidate(qc),
  })
}

/* Atualizar ---------------------------------------------------------------- */
export const useAtualizarPerfil = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...rest }: PerfilForm & { id: number }) =>
      api.put<PerfilDTO>(`/perfis/${id}`, rest).then(r => r.data),
    onSuccess: () => invalidate(qc),
  })
}

/* Excluir (se permitido) ---------------------------------------------------- */
export const useExcluirPerfil = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/perfis/${id}`),
    onSuccess: () => invalidate(qc),
  })
}
