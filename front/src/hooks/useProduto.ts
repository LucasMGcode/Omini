import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'
import type { ProdutoDTO } from './useProdutos'

export const useProduto = (id: number) =>
  useQuery<ProdutoDTO>({
    queryKey: ['produtos', id],
    queryFn: () => api.get(`/produtos/${id}`).then(r => r.data),
    enabled: !!id,
  })
