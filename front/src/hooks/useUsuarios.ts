import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'

export interface UsuarioDTO {
  id: number
  nomeCompleto: string
  login: string
  email: string
  perfilId: number
  ativo: boolean
  dataCadastro: string
}

/** Payload de criação / edição (id gerado pelo back-end)                    */
export type UsuarioForm = Omit<
  UsuarioDTO,
  'id' | 'ativo' | 'dataCadastro'
> & { senha: string }            // senha necessária apenas na criação

/* Payload de alteração de senha                                             */
export interface TrocaSenhaForm {
  id: number
  senhaAtual: string
  novaSenha: string
}

/** Lista completa – ajuste se quiser paginação server-side                  */
export const useUsuarios = () =>
  useQuery<UsuarioDTO[]>({
    queryKey: ['usuarios'],
    queryFn: () => api.get('/usuarios').then(r => r.data),
    staleTime: 60_000,
  })

/** Detalhe de 1 usuário                                                     */
export const useUsuario = (id: number) =>
  useQuery<UsuarioDTO>({
    queryKey: ['usuarios', id],
    queryFn: () => api.get(`/usuarios/${id}`).then(r => r.data),
    enabled: !!id,
  })

const invalidate = (qc: ReturnType<typeof useQueryClient>) =>
  qc.invalidateQueries({ queryKey: ['usuarios'] })

/* Criar -------------------------------------------------------------------- */
export const useCriarUsuario = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UsuarioForm) =>
      api.post<UsuarioDTO>('/usuarios', payload).then(r => r.data),
    onSuccess: () => invalidate(qc),
  })
}

/* Atualizar (sem trocar senha) -------------------------------------------- */
export const useAtualizarUsuario = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...rest }: Partial<UsuarioDTO> & { id: number }) =>
      api.put<UsuarioDTO>(`/usuarios/${id}`, rest).then(r => r.data),
    onSuccess: () => invalidate(qc),
  })
}

/* Alterar senha ------------------------------------------------------------ */
export const useTrocarSenha = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: TrocaSenhaForm) =>
      api.post(`/usuarios/${data.id}/senha`, data),
    onSuccess: () => invalidate(qc),
  })
}

/* Ativar / inativar -------------------------------------------------------- */
export const useToggleAtivo = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ativo }: { id: number; ativo: boolean }) =>
      api.patch<UsuarioDTO>(`/usuarios/${id}/ativo`, null, {
        params: { valor: ativo },
      }),
    onSuccess: () => invalidate(qc),
  })
}

/* Excluir (hard delete, se o endpoint existir) ---------------------------- */
export const useExcluirUsuario = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/usuarios/${id}`),
    onSuccess: () => invalidate(qc),
  })
}
