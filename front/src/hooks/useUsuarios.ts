import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'

export interface PerfilResumo {
  id:    number
  nome:  string
}

export interface UsuarioDTO {
  id:            number
  nomeCompleto:  string
  email:         string
  perfil:        PerfilResumo
  ativo:         boolean
  dataCadastro:  string
}

export interface UsuarioCreate {
  nomeCompleto: string
  email:        string
  senhaPlain:   string
  perfilId:     number
}

export type UsuarioUpdate = Partial<
  Omit<UsuarioCreate, 'senha'>
> & { id: number }

export const useUsuarios = (page = 0, size = 20) =>
  useQuery<{ content: UsuarioDTO[]; totalElements: number }>({
    queryKey: ['usuarios', page, size],
    queryFn: () =>
      api
        .get('/usuarios', { params: { page, size } })
        .then(r => r.data),
    placeholderData: (prev) => prev,
  })

export const useUsuario = (id: number | undefined) =>
  useQuery<UsuarioDTO>({
    queryKey: ['usuario', id],
    queryFn: () => api.get(`/usuarios/${id}`).then(r => r.data),
    enabled: !!id,
  })

const invalidateList = (qc: ReturnType<typeof useQueryClient>) =>
  qc.invalidateQueries({ queryKey: ['usuarios'] })

export const useCriarUsuario = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UsuarioCreate) =>
      api.post<UsuarioDTO>('/usuarios', payload).then(r => r.data),
    onSuccess: () => invalidateList(qc),
  })
}

export const useAtualizarUsuario = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...rest }: UsuarioUpdate) =>
      api.put<UsuarioDTO>(`/usuarios/${id}`, rest).then(r => r.data),
    onSuccess: (_, { id }) => {
      invalidateList(qc)
      qc.invalidateQueries({ queryKey: ['usuario', id] })
    },
  })
}

export const useExcluirUsuario = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/usuarios/${id}`),
    onSuccess: (_, id) => {
      invalidateList(qc)
      qc.removeQueries({ queryKey: ['usuario', id] })
    },
  })
}
