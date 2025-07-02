// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import axios from '@/services/axios';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';

const Login: React.FC = () => {
  const [login,    setLogin]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const navigate = useNavigate();

  // 1 ▸ gera token Basic e faz requisição-ping protegida
  const doLogin = async (user: string, pass: string) => {
    const basic = btoa(`${user}:${pass}`);
    await axios.get('/api/produtos?page=0&size=1', {
      headers: { Authorization: `Basic ${basic}` }
    });
    localStorage.setItem('auth', basic);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await doLogin(login, password);
      toast({ title: 'Bem-vindo!', description: 'Login realizado com sucesso.' });
      navigate('/dashboard');
    } catch (err: any) {
      const status = err.response?.status;
      const msg = status === 401
        ? 'Credenciais inválidas.'
        : 'Erro ao conectar no servidor.';
      toast({ title: 'Falha na autenticação', description: msg, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="w-full max-w-md">
          <Header />
          <div className="mb-10 text-center">
            <img src="/logo_omini.png" alt="Omini" className="h-32 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2 font-poppins">Seja Bem-Vindo</h1>
            <p className="text-gray-600 font-montserrat">Faça login para acessar o sistema.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="login" className="block text-gray-700 font-medium mb-2 font-poppins">
                Usuário
              </label>
              <input
                id="login"
                type="text"
                className="form-input border border-purple-200 rounded-xl w-full px-4 py-2 focus:ring-2 focus:ring-purple-500"
                placeholder="seu.login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2 font-poppins">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  className="form-input border border-purple-200 rounded-xl w-full px-4 py-2 pr-12 focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 hover:text-purple-700"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all"
            >
              Entrar
            </Button>
          </form>
        </div>
      </div>

      {/* Imagem lateral */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img src="/mascotes.png" alt="Mascotes" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent" />
        <div className="absolute bottom-8 left-8 lg:left-16 text-white max-w-md z-10">
          <h2 className="text-2xl font-bold mb-2 font-poppins">Sistema de Gestão</h2>
          <p className="font-montserrat opacity-90">
            Controle completo do seu estoque laboratorial com um sistema moderno, eficiente e amigável.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
