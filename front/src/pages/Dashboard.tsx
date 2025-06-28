import React, { useState } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import AlertBanner from '../components/AlertBanner';
import { useProdutos } from '@/hooks/useProdutos';  
import { toDate } from 'date-fns';


const Dashboard = () => {

  const {data: products} = useProdutos();

  const [alerts, setAlerts] = useState([
    'O reagente Etanol Absoluto está no final do estoque (5/30)',
    'Hidróxido de Sódio está em falta e precisa ser reposto'
  ]);

  const dismissAlert = (index: number) => {
    setAlerts(alerts.filter((_, i) => i !== index));
  };
  console.log(products);
  return (
    
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2 font-poppins">Dashboard</h1>
          <p className="text-gray-600 font-montserrat">Os seus materiais todos agora em uma plataforma. Simples, eficiente e econômica!</p>
        </div>

        {/* Alerts */}
        {alerts.map((alert, index) => (
          <AlertBanner 
            key={index} 
            message={alert} 
            onDismiss={() => dismissAlert(index)} 
          />
        ))}
        
        <h2 className="text-xl font-semibold text-purple-700 mb-6 font-poppins">Produtos em Estoque</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product) => (
            <ProductCard
              key={product.id}
              name={product.nome}
              currentQuantity={product.quantidadeEstoque}
              minimumQuantity={product.estoqueMinimo}
              status={
                product.quantidadeEstoque <= 0
                  ? 'SEM ESTOQUE' 
                  : product.quantidadeEstoque <= product.estoqueMinimo
                  ? 'BAIXO'
                  : product.quantidadeEstoque > product.estoqueMinimo && product.quantidadeEstoque <= (product.estoqueMinimo * 2)
                  ? 'MODERADO'
                  : product.quantidadeEstoque > (product.estoqueMinimo * 2)
                  ? 'CONFORTÁVEL'
                  : 'MODERADO'
              }
              expiryDate={toDate(product.dataValidade).toLocaleDateString('pt-BR') === 'Invalid Date' ? 'N/A' : toDate(product.dataValidade).toLocaleDateString('pt-BR')}
              ativo = {product.ativo}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;