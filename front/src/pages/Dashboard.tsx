import React, { useMemo, useState } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import AlertSection from '../components/AlertSection';
import { useProdutos } from '@/hooks/useProdutos';
import { toDate } from 'date-fns';

const Dashboard: React.FC = () => {
  const { data: products } = useProdutos();
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([]);

  // Função para determinar o status do produto
  const getStatus = (produto: any): string => {
    const { quantidadeEstoque, estoqueMinimo} = produto;
    if (quantidadeEstoque <= 0) return 'SEM ESTOQUE';
    if (quantidadeEstoque <= estoqueMinimo) return 'BAIXO';
    if (quantidadeEstoque <= estoqueMinimo * 2) return 'MODERADO';
    return 'CONFORTÁVEL';
  };

  // Lista de alertas gerados dinamicamente
  const generatedAlerts = useMemo(() => {
    if (!products) return [];
    return products
      .map((produto, index) => {
        const status = getStatus(produto);
        if (status === 'SEM ESTOQUE') {
          return { index, message: `${produto.nome} está SEM ESTOQUE e precisa ser reposto.` };
        } else if (status === 'BAIXO') {
          return { index, message: `${produto.nome} está com ESTOQUE BAIXO (${produto.quantidadeEstoque}/${produto.estoqueMinimo}).` };
        }
        return null;
      })
      .filter(Boolean);
  }, [products]);

  // Filtra os alertas não descartados
  const activeAlerts = generatedAlerts.filter(a => !dismissedAlerts.includes(a.index));

  const dismissAlert = (index: number) => {
    setDismissedAlerts(prev => [...prev, index]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2 font-poppins">Dashboard</h1>
          <p className="text-gray-600 font-montserrat">Os seus materiais todos agora em uma plataforma. Simples, eficiente e econômica!</p>
        </div>

        <AlertSection alerts={activeAlerts} onDismiss={dismissAlert} />

        <h2 className="text-xl font-semibold text-purple-700 mb-6 font-poppins">Produtos em Estoque</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product) => (
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
      </main>
    </div>
  );
};

export default Dashboard;
