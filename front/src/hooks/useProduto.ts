import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'

export interface TipoProdutoSlim {
  id: number
  nome: string
}

export interface FornecedorSlim {
  id: number
  razaoSocial: string
}

export interface ProdutoDTO {
  id: number
  nome: string
  descricao?: string
  codigoInterno?: string
  numeroLote?: string
  marca?: string
  fabricante?: string
  unidadeMedida?: string
  quantidadeEstoque: number
  estoqueMinimo: number
  dataValidade?: string
  dataEntrada?: string
  localizacao?: string
  ativo: boolean
  tipoProduto?: TipoProdutoSlim
  fornecedor?: FornecedorSlim
  observacoes?: string
}

export const useProdutos = () =>
  useQuery<ProdutoDTO[]>({
    queryKey: ['produtos'],
    queryFn: () => api.get('/produtos').then(r => r.data),
    staleTime: 60_000,
  })

export const useProduto = (id?: number) =>
  useQuery<ProdutoDTO>({
    queryKey: ['produto', id],
    queryFn: () => api.get(`/produtos/${id}`).then(r => r.data),
    enabled: !!id,
    staleTime: 60_000,
  })
