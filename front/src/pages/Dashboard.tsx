import { useMemo, useState } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import AlertSection from '../components/AlertSection';
import { useProdutos } from '@/hooks/useProdutos';
import { toDate } from 'date-fns';

const Dashboard = () => {
  const { data: products } = useProdutos();
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
          <h1 className="text-4xl font-extrabold text-purple-700 font-poppins">Painel de Controle</h1>
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
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
