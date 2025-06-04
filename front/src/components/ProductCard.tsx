import React from 'react';

type ProductStatus = 'No estoque' | 'Em falta' | 'Pouco estoque';

interface ProductCardProps {
  name: string;
  currentQuantity: number;
  totalQuantity: number;
  status: ProductStatus;
  expiryDate: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  name, 
  currentQuantity, 
  totalQuantity, 
  status, 
  expiryDate 
}) => {
  const getStatusColor = (status: ProductStatus) => {
    switch (status) {
      case 'No estoque':
        return 'bg-green-100 text-green-700 border border-green-200';
      case 'Em falta':
        return 'bg-red-100 text-red-700 border border-red-200';
      case 'Pouco estoque':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };
  
  const getQuantityColor = () => {
    const percentage = (currentQuantity / totalQuantity) * 100;
    if (percentage <= 20) return 'text-red-600';
    if (percentage <= 50) return 'text-yellow-600';
    return 'text-green-600';
  };
  
  const getProgressColor = () => {
    const percentage = (currentQuantity / totalQuantity) * 100;
    if (percentage <= 20) return 'bg-red-500';
    if (percentage <= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const percentage = Math.min((currentQuantity / totalQuantity) * 100, 100);
  
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
      <h3 className="font-semibold text-gray-800 text-lg mb-3 font-poppins">{name}</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-medium text-gray-600 mr-2 font-montserrat">Quantidade:</span>
            <span className={`font-bold font-montserrat ${getQuantityColor()}`}>
              {currentQuantity}/{totalQuantity}
            </span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1 font-montserrat">{percentage.toFixed(1)}% disponível</div>
        </div>
        
        <div className="text-sm text-gray-600 font-montserrat">
          {expiryDate}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
