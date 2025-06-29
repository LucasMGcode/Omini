import React, { useState } from 'react';
import { FileText, FileBarChart, Download } from 'lucide-react';
// import Header from '../components/Header';
// FIX: Update the import path below if Header exists elsewhere, or create the Header component if missing.
import Header from '@/components/Header';
import { 
  Card, 
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  
  // Sample consumption data for demonstration
  const consumptionData = [
    { name: 'Jan', Álcool: 42, Acetona: 24, Amoníaco: 18 },
    { name: 'Fev', Álcool: 30, Acetona: 38, Amoníaco: 20 },
    { name: 'Mar', Álcool: 45, Acetona: 35, Amoníaco: 28 },
    { name: 'Abr', Álcool: 50, Acetona: 42, Amoníaco: 15 },
    { name: 'Mai', Álcool: 38, Acetona: 30, Amoníaco: 23 },
    { name: 'Jun', Álcool: 65, Acetona: 45, Amoníaco: 30 },
  ];
  
  // Sample inventory movement data
  const inventoryMovements = [
    { id: 1, product: 'Álcool Etílico 70%', date: '15/05/2025', type: 'Retirada', quantity: 10, user: 'Carlos Silva' },
    { id: 2, product: 'Acetona P.A', date: '14/05/2025', type: 'Reposição', quantity: 25, user: 'Ana Ferreira' },
    { id: 3, product: 'Pipetas de Vidro', date: '13/05/2025', type: 'Retirada', quantity: 8, user: 'Mariana Costa' },
    { id: 4, product: 'Luvas de Nitrilo', date: '12/05/2025', type: 'Retirada', quantity: 50, user: 'Pedro Almeida' },
    { id: 5, product: 'Amoníaco', date: '11/05/2025', type: 'Reposição', quantity: 15, user: 'João Santos' },
  ];
  
  const chartConfig = {
    Álcool: { 
      label: "Álcool",
      color: "#9b59b6" 
    },
    Acetona: { 
      label: "Acetona",
      color: "#aa6cb8" 
    },
    Amoníaco: { 
      label: "Amoníaco",
      color: "#e91e63" 
    },
  };

  const handleGenerateReport = (reportType: string) => {
    setSelectedReport(reportType);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-6 font-poppins">Relatórios</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-poppins text-purple-700">
                <FileText className="h-5 w-5 text-purple-600" />
                Movimentação de Produtos
              </CardTitle>
              <CardDescription className="font-montserrat text-gray-600">
                Relatório detalhado de entrada e saída de produtos do estoque
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                onClick={() => handleGenerateReport('movimentacao')} 
                className="w-full hover:cursor-pointer bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-montserrat"
              >
                Gerar Relatório
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-poppins text-purple-700">
                <FileBarChart className="h-5 w-5 text-purple-600" />
                Consumo de Produtos
              </CardTitle>
              <CardDescription className="font-montserrat text-gray-600">
                Análise de consumo mensal dos principais reagentes
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                onClick={() => handleGenerateReport('consumo')} 
                className="w-full hover:cursor-pointer bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-montserrat"
              >
                Gerar Relatório
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-poppins text-purple-700">
                <FileBarChart className="h-5 w-5 text-purple-600" />
                Estoque Crítico
              </CardTitle>
              <CardDescription className="font-montserrat text-gray-600">
                Lista de produtos com estoque abaixo do nível mínimo
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                onClick={() => handleGenerateReport('critico')} 
                className="w-full hover:cursor-pointer bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-montserrat"
              >
                Gerar Relatório
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {selectedReport === 'movimentacao' && (
          <Card className="animate-fade-in border-0 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-poppins text-purple-700">Relatório de Movimentação</CardTitle>
                <CardDescription className="font-montserrat text-gray-600">
                  Últimas movimentações de produtos no estoque
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-purple-200 text-purple-600 hover:bg-purple-50 rounded-lg">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-poppins text-purple-700">ID</TableHead>
                    <TableHead className="font-poppins text-purple-700">Produto</TableHead>
                    <TableHead className="font-poppins text-purple-700">Data</TableHead>
                    <TableHead className="font-poppins text-purple-700">Tipo</TableHead>
                    <TableHead className="font-poppins text-purple-700">Quantidade</TableHead>
                    <TableHead className="font-poppins text-purple-700">Usuário</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell className="font-montserrat">{movement.id}</TableCell>
                      <TableCell className="font-montserrat">{movement.product}</TableCell>
                      <TableCell className="font-montserrat">{movement.date}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          movement.type === 'Retirada' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {movement.type}
                        </span>
                      </TableCell>
                      <TableCell className="font-montserrat">{movement.quantity}</TableCell>
                      <TableCell className="font-montserrat">{movement.user}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
        
        {selectedReport === 'consumo' && (
          <Card className="animate-fade-in border-0 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-poppins text-purple-700">Relatório de Consumo</CardTitle>
                <CardDescription className="font-montserrat text-gray-600">
                  Consumo mensal dos principais reagentes
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-purple-200 text-purple-600 hover:bg-purple-50 rounded-lg">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ChartContainer config={chartConfig}>
                  <BarChart data={consumptionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="Álcool" fill="#9b59b6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Acetona" fill="#aa6cb8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Amoníaco" fill="#e91e63" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        )}
        
        {selectedReport === 'critico' && (
          <Card className="animate-fade-in border-0 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-poppins text-purple-700">Relatório de Estoque Crítico</CardTitle>
                <CardDescription className="font-montserrat text-gray-600">
                  Produtos com estoque abaixo do nível mínimo recomendado
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-purple-200 text-purple-600 hover:bg-purple-50 rounded-lg">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-poppins text-purple-700">Produto</TableHead>
                    <TableHead className="font-poppins text-purple-700">Estoque Atual</TableHead>
                    <TableHead className="font-poppins text-purple-700">Estoque Mínimo</TableHead>
                    <TableHead className="font-poppins text-purple-700">Status</TableHead>
                    <TableHead className="font-poppins text-purple-700">Validade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-montserrat">Álcool Etílico 70%</TableCell>
                    <TableCell className="text-red-600 font-medium font-montserrat">5</TableCell>
                    <TableCell className="font-montserrat">20</TableCell>
                    <TableCell>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        Crítico
                      </span>
                    </TableCell>
                    <TableCell className="font-montserrat">10/12/2025</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-montserrat">Luvas de Látex M</TableCell>
                    <TableCell className="text-yellow-600 font-medium font-montserrat">12</TableCell>
                    <TableCell className="font-montserrat">15</TableCell>
                    <TableCell>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        Baixo
                      </span>
                    </TableCell>
                    <TableCell className="font-montserrat">N/A</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-montserrat">Fenolftaleína</TableCell>
                    <TableCell className="text-red-600 font-medium font-montserrat">3</TableCell>
                    <TableCell className="font-montserrat">10</TableCell>
                    <TableCell>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        Crítico
                      </span>
                    </TableCell>
                    <TableCell className="font-montserrat">22/03/2026</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Reports;