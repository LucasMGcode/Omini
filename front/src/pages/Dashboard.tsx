import { useMemo, useState } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import AlertSection from '../components/AlertSection';
import { useProdutos } from '@/hooks/useProdutos';
import { toDate } from 'date-fns';

const gerarIntervaloPaginas = (paginaAtual: number, totalPaginas: number, visao: number = 2) => {
  const paginas = [];
  const inicio = Math.max(1, paginaAtual - visao + 1);
  const fim = Math.min(totalPaginas, paginaAtual + visao + 1);

  if (inicio > 1) paginas.push('start');

  for (let i = inicio; i < fim; i++) {
    paginas.push(i);
  }

  if (fim < totalPaginas) paginas.push('end');

  return paginas;
};

const Dashboard = () => {
  const [paginaAtual, setPaginaAtual] = useState(0);
  const tamanhoPagina = 15;

  const { data } = useProdutos(paginaAtual, tamanhoPagina);
  const products = data?.content ?? [];
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([]);

  const getStatus = (produto: any): string => {
    const { quantidadeEstoque, estoqueMinimo } = produto;
    if (quantidadeEstoque <= 0) return 'SEM ESTOQUE';
    if (quantidadeEstoque <= estoqueMinimo) return 'BAIXO';
    if (quantidadeEstoque <= estoqueMinimo * 2) return 'MODERADO';
    return 'CONFORTÁVEL';
  };

  const generatedAlerts = useMemo(() => {
    if (!products) return [];
    return products.flatMap((produto, index) => {
      const status = getStatus(produto);
      if (status === 'SEM ESTOQUE')
        return [{ index, message: `${produto.nome} está SEM ESTOQUE e precisa ser reposto.` }];
      if (status === 'BAIXO')
        return [{ index, message: `${produto.nome} está com o ESTOQUE BAIXO (${produto.quantidadeEstoque}/${produto.estoqueMinimo}).` }];
      return [];
    });
  }, [products]);

  const activeAlerts = generatedAlerts.filter(a => !dismissedAlerts.includes(a.index));

  const dismissAlert = (index: number) => {
    setDismissedAlerts(prev => [...prev, index]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <section className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-poppins">Painel de Controle</h1>
          <p className="text-base text-gray-700 font-medium mt-1">
            Visualize, acompanhe e mantenha o controle dos seus materiais com praticidade e eficiência.
          </p>
        </section>

        <AlertSection alerts={activeAlerts} onDismiss={dismissAlert} />

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-poppins border-b pb-2 border-purple-200">
            Materiais Disponíveis
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products?.map(product => (
              <ProductCard
                key={product.id}
                name={product.nome}
                currentQuantity={product.quantidadeEstoque}
                minimumQuantity={product.estoqueMinimo}
                status={getStatus(product)}
                expiryDate={
                  toDate(product.dataValidade).toLocaleDateString('pt-BR') === 'Invalid Date'
                    ? 'N/A'
                    : toDate(product.dataValidade).toLocaleDateString('pt-BR')
                }
                controladoPelaPF={product.controladoPelaPF}
              />
            ))}
          </div>
          {data?.totalPages > 1 && (
            <div className="flex justify-center flex-wrap gap-1 mt-6">
              <button
                onClick={() => setPaginaAtual(p => Math.max(p - 1, 0))}
                disabled={paginaAtual === 0}
                className="px-3 py-1 rounded-md border text-purple-700 border-purple-300 hover:bg-purple-100 disabled:opacity-50"
              >
                Anterior
              </button>

              {gerarIntervaloPaginas(paginaAtual + 1, data.totalPages).map((p, i) => {
                if (p === 'start') {
                  return <span key={`start-${i}`} className="px-2">...</span>;
                }
                if (p === 'end') {
                  return <span key={`end-${i}`} className="px-2">...</span>;
                }

                return (
                  <button
                    key={p}
                    onClick={() => setPaginaAtual(p - 1)}
                    className={`px-3 py-1 rounded-md border ${paginaAtual === p - 1
                        ? 'bg-purple-600 text-white'
                        : 'text-purple-700 border-purple-300 hover:bg-purple-100'
                      }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() => setPaginaAtual(p => Math.min(p + 1, data.totalPages - 1))}
                disabled={paginaAtual === data.totalPages - 1}
                className="px-3 py-1 rounded-md border text-purple-700 border-purple-300 hover:bg-purple-100 disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
