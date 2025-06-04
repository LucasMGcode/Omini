import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'

export interface FornecedorDTO {
  id:                    number
  razaoSocial:           string
  nomeFantasia?:         string | null
  cnpj?:                 string | null
  contatoPrincipalNome?: string | null
  contatoPrincipalEmail?:string | null
  contatoPrincipalTelefone?: string | null
  endereco?:             string | null
  observacoes?:          string | null
  ativo:                 boolean
}

export type FornecedorPayload = Omit<FornecedorDTO, 'id' | 'ativo'> & {
  ativo?: boolean
}

export const useFornecedores = (page = 0, size = 20) =>
  useQuery<{ content: FornecedorDTO[]; totalElements: number }>({
    queryKey: ['fornecedores', page, size],
    queryFn: () =>
      api
        .get('/fornecedores', { params: { page, size } })
        .then(r => r.data),
    placeholderData: (prev) => prev,
  })

export const useFornecedor = (id: number | undefined) =>
  useQuery<FornecedorDTO>({
    queryKey: ['fornecedor', id],
    queryFn: () => api.get(`/fornecedores/${id}`).then(r => r.data),
    enabled: !!id,
  })

const invalidateList = (qc: ReturnType<typeof useQueryClient>) =>
  qc.invalidateQueries({ queryKey: ['fornecedores'] })

export const useCriarFornecedor = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p: FornecedorPayload) =>
      api.post<FornecedorDTO>('/fornecedores', p).then(r => r.data),
    onSuccess: () => invalidateList(qc),
  })
}

export const useAtualizarFornecedor = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...rest }: FornecedorPayload & { id: number }) =>
      api.put<FornecedorDTO>(`/fornecedores/${id}`, rest).then(r => r.data),
    onSuccess: (_, { id }) => {
      invalidateList(qc)
      qc.invalidateQueries({ queryKey: ['fornecedor', id] })
    },
  })
}

export const useExcluirFornecedor = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/fornecedores/${id}`),
    onSuccess: (_, id) => {
      invalidateList(qc)
      qc.removeQueries({ queryKey: ['fornecedor', id] })
    },
  })
}
