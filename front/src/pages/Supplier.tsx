import React, { useState } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import UserCard from '../components/UserCard';
import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFornecedores, useExcluirFornecedor } from '@/hooks/useFornecedores';
import { Button } from '@/components/ui/button';

const Supplier = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const {data: suppliers} = useFornecedores();
  const excluirFornecedor = useExcluirFornecedor(); // Assuming you have a similar hook for suppliers

  const filteredFornecedores = suppliers?.filter((fornecedor) =>
    fornecedor?.razaoSocial?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fornecedor?.nomeFantasia?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fornecedor?.cnpj?.includes(searchQuery) ||
    fornecedor?.id?.toString().includes(searchQuery) ||
    fornecedor?.localizacao?.toLowerCase().includes(searchQuery.toLowerCase())
) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-poppins">Controle de fornecedores</h1>
            <p className="text-gray-600 font-montserrat mt-1">Gerencie os fornecedores do sistema</p>
          </div>
          <Link 
            to="/Supplier-Registration" 
            className="flex items-center bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-montserrat"
          >
            <Plus className="h-5 w-5 mr-2" />
            Cadastrar novo fornecedor
          </Link>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg mb-8 border-0">
          <div className="flex items-center border border-purple-200 rounded-xl px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50">
            <Search className="h-5 w-5 text-purple-500 mr-3" />
            <input 
              type="text" 
              placeholder="Buscar fornecedores por nome..." 
              className="w-full outline-none bg-transparent font-montserrat placeholder-purple-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredFornecedores.length > 0 ? (
            filteredFornecedores.map((fornecedor) => (
              <UserCard
                key={fornecedor.id}
                name={fornecedor.razaoSocial}
                role={fornecedor.nomeFantasia || 'Fornecedor sem nome fantasia'}
                onDelete={() => excluirFornecedor.mutate(fornecedor.id)} 
                //onEdit={() => window.location.href = `/User-Registration/id=${user.id}`} // TODO: implementar isso daqui - não sei se passar pela URL é a melhor forma ou sequer uma forma funcional
              />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
                <p className="font-montserrat">Nenhum fornecedor encontrado.</p>
              </div>
            </div>
          )}
        
        </div>
        <div className="mt-8">
            <Button type="button"
                onClick={() => navigate('/dashboard')}
                className=" bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 px-8 py-3 rounded-xl font-montserrat shadow-lg hover:shadow-xl transition-all duration-300 mr-500 hover:cursor-pointer flex items-center justify-center espace-x-2">
                Voltar
            </Button>
        </div>
      </main>
    </div>
  );
};

export default Supplier;