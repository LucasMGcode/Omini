import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export interface ProdutoDTO {
  id: number
  nome: string
  marca: string
  quantidadeEstoque: number
  estoqueMinimo: number
  dataValidade: string | null
  tipoProdutoId: number | null
  fornecedorId: number | null
}

export const useProdutos = () =>
  useQuery<ProdutoDTO[]>({
    queryKey: ['produtos'],
    queryFn: () => api.get('/produtos').then(r => r.data),
    staleTime: 60_000,
  })
