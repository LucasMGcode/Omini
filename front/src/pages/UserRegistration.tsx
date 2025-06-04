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

const roles = [
  "Ajudante",
  "Técnico",
  "Pesquisador",
  "Supervisor",
  "Administrador"
];

const UserRegistration = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedRole, setSelectedRole] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/users');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* <Header /> */}
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
                  className="form-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2 font-poppins">
                  Data de nascimento
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal border-purple-200 hover:bg-purple-50 rounded-xl",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "dd/MM/yyyy") : <span>Selecione uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="p-3"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-purple-700 mb-2 font-poppins">
                  Função
                </label>
                <select
                  id="role"
                  className="form-input"
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
                  type="submit"
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

export default UserRegistration;