import { useMemo, useState } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import AlertSection from '../components/AlertSection';
import { useProdutos } from '@/hooks/useProdutos';
import { toDate } from 'date-fns';

const Dashboard = () => {
  const [paginaAtual, setPaginaAtual] = useState(0); // 0-based
  const tamanhoPagina = 15;

  const [search, setSearch] = useState('');
  const { data } = useProdutos(paginaAtual, tamanhoPagina, search);
  const products = data?.content ?? [];
  const totalPaginas = data?.totalPages ?? 0;
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

  const gerarIntervaloPaginas = (paginaAtual: number, totalPaginas: number, visao = 2) => {
    const paginas = [];
    const atual = paginaAtual + 1;
    const inicio = Math.max(1, atual - visao);
    const fim = Math.min(totalPaginas, atual + visao);

    if (inicio > 1) {
      paginas.push(1);
      if (inicio > 2) paginas.push('...');
    }

    for (let i = inicio; i <= fim; i++) {
      paginas.push(i);
    }

    if (fim < totalPaginas) {
      if (fim < totalPaginas - 1) paginas.push('...');
      paginas.push(totalPaginas);
    }

    return paginas;
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

          <div className="mb-6">
            <input
              type="text"
              placeholder="Buscar por nome, código ou localização..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPaginaAtual(0);
              }}
              className="w-full px-4 py-2 border border-purple-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
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

          {totalPaginas > 1 && (
            <div className="flex justify-center flex-wrap gap-1 mt-8">
              <button
                onClick={() => setPaginaAtual(p => Math.max(p - 1, 0))}
                disabled={paginaAtual === 0}
                className="px-3 py-1 rounded-md border text-purple-700 border-purple-300 hover:bg-purple-100 disabled:opacity-50"
              >
                Anterior
              </button>

              {gerarIntervaloPaginas(paginaAtual, totalPaginas).map((p, i) =>
                typeof p === 'number' ? (
                  <button
                    key={i}
                    onClick={() => setPaginaAtual(p - 1)}
                    className={`px-3 py-1 rounded-md border ${
                      paginaAtual === p - 1
                        ? 'bg-purple-600 text-white'
                        : 'text-purple-700 border-purple-300 hover:bg-purple-100'
                    }`}
                  >
                    {p}
                  </button>
                ) : (
                  <span key={i} className="px-2 text-purple-400 font-semibold">...</span>
                )
              )}

              <button
                onClick={() => setPaginaAtual(p => Math.min(p + 1, totalPaginas - 1))}
                disabled={paginaAtual === totalPaginas - 1}
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
