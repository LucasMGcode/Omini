import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  "Reagente",
  "Equipamento",
  "Vidraria",
  "Material de Consumo",
  "Instrumento"
];

const ProductRegistration = () => {
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [productCode, setProductCode] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* <Header /> */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-poppins">Cadastro de Produtos</h1>
          <p className="text-gray-600 font-montserrat mt-1">Adicione um novo produto ao estoque</p>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-2xl mx-auto border-0">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-purple-700 mb-2 font-poppins">
                  Nome do produto
                </label>
                <input
                  id="productName"
                  type="text"
                  className="form-input border border-purple-200 rounded-xl w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="productCode" className="block text-sm font-medium text-purple-700 mb-2 font-poppins">
                  Código
                </label>
                <input
                  id="productCode"
                  type="text"
                  className="form-input border border-purple-200 rounded-xl w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-purple-700 mb-2 font-poppins">
                  Categoria
                </label>
                <select
                  id="category"
                  className="form-input border border-purple-200 rounded-xl w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="" disabled>Selecione uma categoria</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-purple-700 mb-2 font-poppins">
                  Quantidade em estoque
                </label>
                <input
                  id="quantity"
                  type="number"
                  min="0"
                  className="form-input border border-purple-200 rounded-xl w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2 font-poppins">
                  Validade
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal border-purple-200 hover:bg-purple-50 rounded-xl",
                        !expiryDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expiryDate ? format(expiryDate, "dd/MM/yyyy") : <span>Selecione uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto">
                    <Calendar
                      mode="single"
                      selected={expiryDate}
                      onSelect={setExpiryDate}
                      initialFocus
                      className="p-3"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex justify-end pt-6">
                <Button
                  type="button"
                  onClick={() => navigate('/Dashboard')}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 px-8 py-3 rounded-xl font-montserrat shadow-lg hover:shadow-xl transition-all duration-300 mr-75 "
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  disabled={!productName || !productCode || !category || !quantity || !expiryDate}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 px-8 py-3 rounded-xl font-montserrat shadow-lg hover:shadow-xl transition-all duration-300 "
                >
                  Finalizar Cadastro
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProductRegistration;