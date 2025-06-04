import React, { useState } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import AlertBanner from '../components/AlertBanner';

// Mock data for demonstration
const mockProducts = [
  { id: 1, name: 'Etanol Absoluto', currentQuantity: 5, totalQuantity: 30, status: 'Pouco estoque' as const, expiryDate: 'Venc. 17/10/2025' },
  { id: 2, name: 'Ácido Sulfúrico', currentQuantity: 20, totalQuantity: 30, status: 'No estoque' as const, expiryDate: 'Venc. 05/04/2026' },
  { id: 3, name: 'Placas de Petri', currentQuantity: 150, totalQuantity: 200, status: 'No estoque' as const, expiryDate: 'Venc. 20/12/2026' },
  { id: 4, name: 'Microscópio Binocular', currentQuantity: 3, totalQuantity: 5, status: 'No estoque' as const, expiryDate: 'N/A' },
  { id: 5, name: 'Hidróxido de Sódio', currentQuantity: 0, totalQuantity: 15, status: 'Em falta' as const, expiryDate: 'Venc. 08/09/2025' },
  { id: 6, name: 'Tubos de Ensaio', currentQuantity: 48, totalQuantity: 100, status: 'No estoque' as const, expiryDate: 'N/A' },
];

const Dashboard = () => {
  const [alerts, setAlerts] = useState([
    'O reagente Etanol Absoluto está no final do estoque (5/30)',
    'Hidróxido de Sódio está em falta e precisa ser reposto'
  ]);

  const dismissAlert = (index: number) => {
    setAlerts(alerts.filter((_, i) => i !== index));
  };

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
          {mockProducts.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              currentQuantity={product.currentQuantity}
              totalQuantity={product.totalQuantity}
              status={product.status}
              expiryDate={product.expiryDate}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;