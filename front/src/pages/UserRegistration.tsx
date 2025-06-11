import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { useCriarUsuario } from '../hooks/useUsuarios';
import { toast } from '@/hooks/use-toast';

const roles = [
  "Administrador",
  "Supervisor",
  "Funcionário"
];

const UserRegistration = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [passwordWarning, setPasswordWarning] = React.useState('');
  const [login, setLogin] = React.useState('');

  const criarUsuario = useCriarUsuario();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setPasswordWarning('Senha deve ter no mínimo 8 caracteres.');
      return;
    }

    setPasswordWarning('');
    criarUsuario.mutate({
      nomeCompleto: fullName,
      email,
      login,
      senhaPlain: password,
      perfilId: roles.indexOf(selectedRole) + 1
    }, {
      onSuccess() {
        navigate('/users');
        toast({
          title: "Sucesso!",
          description: "O usuário foi criado com sucesso.",
          variant: "default"
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* <Header /> */}
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-poppins">Cadastro de Usuários</h1>
          <p className="text-gray-600 font-montserrat mt-1">Adicione um novo usuário ao sistema</p>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-2xl mx-auto border-0">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-purple-700 mb-2 font-poppins">
                  Nome completo
                </label>
                <input
                  id="fullName"
                  type="text"
                  className="form-input border border-purple-200 rounded-xl w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="login" className="block text-sm font-medium text-purple-700 mb-2 font-poppins">
                  Usuário de Login
                </label>
                <input
                  id="login"
                  type="text"
                  className="form-input border border-purple-200 rounded-xl w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-purple-700 mb-2 font-poppins">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  className={`form-input border rounded-xl w-full px-4 py-2 focus:outline-none focus:ring-2 ${
                    passwordWarning ? 'border-red-500 focus:ring-red-500' : 'border-purple-200 focus:ring-purple-500'
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {passwordWarning && (
                  <p className="text-red-600 text-sm mt-1">{passwordWarning}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-purple-700 mb-2 font-poppins">
                  E-mail para notificações
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-input border border-purple-200 rounded-xl w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-purple-700 mb-2 font-poppins margin-top-4">
                  Função
                </label>
                <select
                  id="role"
                  className="form-input border border-purple-200 rounded-xl w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  required
                >
                  <option value="" disabled>Selecione uma função</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end pt-6">
                <Button
                    type="button"
                    onClick={() => navigate('/users')}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 px-8 py-3 rounded-xl font-montserrat shadow-lg hover:shadow-xl transition-all duration-300 mr-75 hover:cursor-pointer"
                    >
                    Voltar
                </Button>
                <Button
                  type="submit"
                  disabled={!fullName || !email || !password || !selectedRole}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 px-8 py-3 rounded-xl font-montserrat shadow-lg hover:shadow-xl transition-all duration-300 hover:cursor-pointer"
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

export default UserRegistration;