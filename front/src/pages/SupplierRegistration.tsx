import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { useFornecedores, useCriarFornecedor } from '@/hooks/useFornecedores';
import type { FornecedorDTO } from '@/hooks/useFornecedores';



const Supplier = () => {
  const navigate = useNavigate();

  const [Form, setForm] = useState<FornecedorDTO>({
    id: 0, // Inicialmente 0, será atualizado pelo backend
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    contatoPrincipalNome: '',
    contatoPrincipalEmail: '',
    contatoPrincipalTelefone: '',
    endereco: '',
    observacoes: '',
    ativo: true, // padrão é true
  }); 

  const criarFornecedor = useCriarFornecedor()

   const onChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setForm(prev => ({
        ...prev,
        [name]: name === 'ativo' && e.target instanceof HTMLInputElement ? e.target.checked : value
      }));
    };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()

      criarFornecedor.mutate(Form, {
        onSuccess: () => {
          alert('Fornecedor cadastrado com sucesso!')
          navigate('/dashboard')
        },
        onError: (err: any) => {
          console.error(err)
          alert('Erro ao cadastrar. Veja o console para detalhes.')
        },
      })
    }
    
    console.log('Formulário de fornecedor:', Form);

   

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-poppins">Cadastro de Fornecedores</h1>
          <p className="text-gray-600 font-montserrat mt-1">Adicione um novo fornecedor ao sistema</p>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-2xl mx-auto border-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="supplierName" className="w-full block text-sm font-medium text-purple-700 mb-2 font-poppins">
                  Razão Social
                </label>
                <input
                  id="supplierName"
                  name='razaoSocial'
                  type="text"
                  className="form-input w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={Form.razaoSocial}
                  onChange={onChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="supplierFantasyName" className="block text-sm font-medium text-purple-700 mb-2 font-poppins">
                  Nome fantasia
                </label>
                <input
                  id="supplierFantasyName"
                  name='nomeFantasia'
                  type="text"
                  className="form-input w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={Form.nomeFantasia}
                  onChange={onChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="supplierCode" className="block text-sm font-medium text-purple-700 mb-2 font-poppins">
                  CNPJ
                </label>
                <input
                  id="supplierCode"
                  name='cnpj'
                  type="text"
                  placeholder="00.000.000/0000-00"
                  className="form-input w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={Form.cnpj}
                  onChange={onChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="responsupplier" className="block text-sm font-medium text-purple-700 mb-2 font-poppins">
                  Nome do responsável
                </label>
                <input
                  id="responsupplier"
                  name='contatoPrincipalNome'
                  type="text"
                  className="form-input w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={Form.contatoPrincipalNome}
                  onChange={onChange}
                  required
                />
              </div>
              
              
              <div>
                <label htmlFor="supplierPhone" className="block text-sm font-medium text-purple-700 mb-2 font-poppins">
                  Telefone do responsável
                </label>
                <input
                  type="tel"
                  placeholder="(00) 00000-0000"
                  id="supplierPhone"
                  name='contatoPrincipalTelefone'
                  className="form-input w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={Form.contatoPrincipalTelefone}
                  onChange={onChange}
                  required
                >
                </input>
                
              </div>
              <div>
                <label htmlFor="supplierEmail" className="block text-sm font-medium text-purple-700 mb-2 font-poppins ">
                  E-mail do responsável
                </label>
                <input
                  id="supplierEmail"
                  name='contatoPrincipalEmail'
                  type="email"
                  className="form-input w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={Form.contatoPrincipalEmail}
                  onChange={onChange}
                  required
                />
                </div>
              <div>
                <label htmlFor="supplierAddress" className="block text-sm font-medium text-purple-700 mb-2 font-poppins">
                  Endereço
                </label>
                <input
                  id="supplierAddress"
                  name='endereco'
                  type="text"
                  className="form-input w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={Form.endereco}
                  onChange={onChange}
                  required
                />
              </div>
                <div>
                    <label htmlFor="supplierobservations" className="block text-sm font-medium text-purple-700 mb-2 font-poppins">
                    Observações
                    </label>
                    <textarea
                    id="supplierobservations"
                    name='observacoes'
                    rows={3}
                    className="form-input w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={Form.observacoes}
                    onChange={onChange}
                    />
              </div>

              <div className="flex justify-end pt-6">
                <Button type="button"
                    onClick={() => navigate('/dashboard')}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 px-8 py-3 rounded-xl font-montserrat shadow-lg hover:shadow-xl transition-all duration-300 mr-75 hover:cursor-pointer">
                    Voltar
                </Button>
                <Button
                  type="submit"
                    disabled= {!Form.razaoSocial || !Form.nomeFantasia || !Form.cnpj || !Form.contatoPrincipalNome || !Form.contatoPrincipalEmail || !Form.contatoPrincipalTelefone || !Form.endereco}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 px-8 py-3 rounded-xl font-montserrat shadow-lg hover:shadow-xl transition-all duration-300"
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

export default Supplier;
