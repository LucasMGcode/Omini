import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Index = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left section - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <img 
                src="/logo_omini.png" 
                alt="Omini Solutions" 
                className="h-32 w-auto"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 font-poppins">Seja Bem Vindo</h1>
            <p className="text-gray-600 font-montserrat">Faça login para acessar o sistema de controle de estoque do laboratório.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2 font-poppins">Email</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2 font-poppins">Senha</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="form-input pr-12"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 hover:text-purple-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl font-medium transition-all duration-300 hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-poppins"
            >
              Entrar
            </button>
          </form>
          
          <div className="text-center mt-6">
            <p className="text-gray-600 font-montserrat">
              Ainda não possui uma conta? {" "}
              <a href="#" className="text-purple-600 hover:text-purple-700 hover:underline font-medium transition-colors">
                Cadastrar-se
              </a>
            </p>
          </div>
        </div>
      </div>
      
      {/* Right section - Mascots Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img 
          src="/mascotes.png" 
          alt="Mascotes Omini" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent"></div>
        <div className="absolute bottom-8 left-8 lg:left-16 text-white max-w-md z-10">
          <div className="flex items-center space-x-3 mb-4">
          </div>
          <h2 className="text-2xl font-bold mb-2 font-poppins">Sistema de Gestão</h2>
          <p className="font-montserrat opacity-90">Mantenha o controle completo do seu estoque laboratorial com um sistema moderno, eficiente e amigável.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;