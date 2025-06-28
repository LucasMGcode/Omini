import React from 'react';
import { format } from 'date-fns';
import { AlertCircle, X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type ProductStatus = 'ESTOQUE CONFORTÁVEL' | 'ESTOQUE MODERADO' | 'SEM ESTOQUE' | 'ESTOQUE BAIXO';

interface ProductCardProps {
  name: string;
  currentQuantity: number;
  minimumQuantity: number;
  status: string;
  expiryDate: string;
  controladoPelaPF: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  name, 
  currentQuantity, 
  minimumQuantity,
  status, 
  expiryDate, 
  controladoPelaPF
}) => {
  const getStatusColor = (status: string) => {
    if(currentQuantity <= 0) return 'bg-red-500 text-white';
    if(currentQuantity <= minimumQuantity) return 'bg-orange-500 text-white';
    if(currentQuantity > minimumQuantity && currentQuantity <= (minimumQuantity * 2)) return 'bg-blue-500 text-white';
    if(currentQuantity > (minimumQuantity * 2)) return 'bg-green-500 text-white';
    return 'bg-green-500 text-white'; 
  };
  
  const getQuantityColor = () => {
    if(currentQuantity <= 0) return 'text-red-500';
    if(currentQuantity <= minimumQuantity) return 'text-orange-500';
    if(currentQuantity > minimumQuantity && currentQuantity <= (minimumQuantity * 2)) return ' text-blue-500';
    if(currentQuantity > (minimumQuantity * 2)) return ' text-green-500';
    return 'text-white'; 
  };
  
  const getProgressColor = () => {
    if(currentQuantity <= 0) return 'bg-red-500';
    if(currentQuantity <= minimumQuantity) return 'bg-orange-500';
    if(currentQuantity > minimumQuantity && currentQuantity <= (minimumQuantity * 2)) return 'bg-blue-500';
    if(currentQuantity > (minimumQuantity * 2)) return 'bg-green-500';
    return 'bg-green-500';
  };

  //const percentage = Math.min((currentQuantity / minimumQuantity) * 100, 100);
  
  return (
    <div className=" relvative bg-white/100 backdrop-blur-sm rounded-2xl shadow-lg p-9 border-0 hover:shadow-xl transition-all duration-500 hover:-translate-y-5">
      <div className="flex items-center text-center justify-between mb-4 overflow-visible">
        <h3 className="text-lg font-bold text-center w-full font-montserrat">{name}</h3>
        {controladoPelaPF && (
          <TooltipProvider >
            <Tooltip >
              <TooltipTrigger asChild>
                <AlertCircle className="h-6 w-6 text-amber-700 cursor-pointer opacity-100 absolute top-2 right-4" />
              </TooltipTrigger>
              <TooltipContent className="z-50 opacity-100 overflow-visible">
                <p className="font-medium text-gray-600 font-montserrat opacity-100">
                  Produto controlado pela PRF
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className="relative space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-medium text-gray-600 mr-2 font-montserrat">Qnt. Disponível:</span>
            <span className={`font-bold font-montserrat ${getQuantityColor()}`}>
              {currentQuantity}
            </span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-600 mr-2 font-montserrat ">Qnt. Mínima:</span>
            <span className={`font-bold font-montserrat ${getQuantityColor()}`}>
              {minimumQuantity}
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
              //style={{ width: `${percentage}%` }}
            ></div>
          </div>
          {/*<div className="text-xs text-gray-500 mt-1 font-montserrat">{percentage.toFixed(1)}% disponível</div>*/}

        </div>
        
        <div className="font-medium text-gray-600 mr-2 font-montserrat">
          {expiryDate}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
