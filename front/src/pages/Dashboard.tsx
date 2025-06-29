import { useMemo, useRef, useState } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import AlertSection from '../components/AlertSection';
import Pagination from '@/components/Pagination';
import { useProdutos } from '@/hooks/useProdutos';
import { toDate } from 'date-fns';

const Dashboard = () => {
  const [paginaAtual, setPaginaAtual] = useState(0);
  const tamanhoPagina = 15;
  const [textoBusca, setTextoBusca] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const { data } = useProdutos(paginaAtual, tamanhoPagina, textoBusca);
  const listaProdutos = data?.content ?? [];
  const totalPaginas = data?.totalPages ?? 0;
  const [alertasIgnorados, setAlertasIgnorados] = useState<number[]>([]);

  const obterStatusEstoque = (produto: any) => {
    if (produto.quantidadeEstoque <= 0) return 'SEM ESTOQUE';
    if (produto.quantidadeEstoque <= produto.estoqueMinimo) return 'BAIXO';
    if (produto.quantidadeEstoque <= produto.estoqueMinimo * 2) return 'MODERADO';
    return 'CONFORTÁVEL';
  };

  const alertasGerados = useMemo(() => {
    return listaProdutos.flatMap((produto: any, indice: number) => {
      const statusEstoque = obterStatusEstoque(produto);
      if (statusEstoque === 'SEM ESTOQUE')
        return [{ index: indice, message: `${produto.nome} está SEM ESTOQUE e precisa ser reposto.` }];
      if (statusEstoque === 'BAIXO')
        return [{ index: indice, message: `${produto.nome} está com o ESTOQUE BAIXO (${produto.quantidadeEstoque}/${produto.estoqueMinimo}).` }];
      return [];
    });
  }, [listaProdutos]);

  const alertasAtivos = alertasGerados.filter(alerta => !alertasIgnorados.includes(alerta.index));
  const ignorarAlerta = (indiceAlerta: number) => setAlertasIgnorados(prevState => [...prevState, indiceAlerta]);

  const alterarPagina = (novaPagina: number) => {
    const scrollY = window.scrollY;
    setPaginaAtual(novaPagina);
    setTimeout(() => window.scrollTo({ top: scrollY, behavior: 'auto' }), 40);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />
      <main ref={containerRef} className="container mx-auto px-6 py-8">
        <section className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-poppins">
            Painel de Controle
          </h1>
          <p className="text-base text-gray-700 font-medium mt-1">
            Visualize, acompanhe e mantenha o controle dos seus materiais com praticidade e eficiência.
          </p>
        </section>

        <AlertSection alerts={alertasAtivos} onDismiss={ignorarAlerta} />

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-poppins border-b pb-2 border-purple-200">
            Materiais Disponíveis
          </h2>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Buscar por nome, código ou localização..."
              value={textoBusca}
              onChange={evento => {
                setTextoBusca(evento.target.value);
                setPaginaAtual(0);
              }}
              className="w-full px-4 py-2 border border-purple-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listaProdutos.map((produto: any) => (
              <ProductCard
                key={produto.id}
                name={produto.nome}
                currentQuantity={produto.quantidadeEstoque}
                minimumQuantity={produto.estoqueMinimo}
                status={obterStatusEstoque(produto)}
                expiryDate={
                  toDate(produto.dataValidade).toLocaleDateString('pt-BR') === 'Invalid Date'
                    ? 'N/A'
                    : toDate(produto.dataValidade).toLocaleDateString('pt-BR')
                }
                controladoPelaPF={produto.controladoPelaPF}
              />
            ))}
          </div>

          <Pagination
            currentPage={paginaAtual}
            totalPages={totalPaginas}
            onPageChange={alterarPagina}
          />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
