import React, { use , useState } from 'react';
import Header1 from '../components/Header';
import { Package, PackageOpen, ArrowDown, User, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { useProdutos, type ProdutoDTO } from '@/hooks/useProdutos';
import { useProduto } from '@/hooks/useProdutos';
import { useAjustarEstoque } from '@/hooks/useMutacoesProduto';
import type { ProdutoForm } from '@/hooks/useMutacoesProduto'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Header } from '@radix-ui/react-accordion';
import { se } from 'date-fns/locale';
import { toDate } from 'date-fns';

// Product type definition
interface Product {
  id: number;
  name: string;
  code: string;
  category: string;
  currentQuantity: number;
  totalQuantity: number;
  expiryDate: string;
}
const WithdrawProduct = () => {
  const navigate = useNavigate();
  // Sample product data
  const {data: products} = useProdutos();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProdutoDTO | null>(null);
  const [withdrawQuantity, setWithdrawQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>('');
  const ajustarEstoque = useAjustarEstoque();

  // Filter products based on search term
  const searchTermLower = searchTerm.toLowerCase();
  const filteredProdutos = products?.filter((produto) =>
  produto?.nome?.toLowerCase().includes(searchTermLower) ||
  produto?.id.toString().includes(searchTerm) ||
  produto?.localizacao?.toLowerCase().includes(searchTermLower) 
) || [];


  const handleWithdraw = async () => {
    if (!selectedProduct) return;
  
    if (withdrawQuantity <= 0) {
      toast({
        title: "Quantidade inválida",
        description: "A quantidade de retirada deve ser maior que zero.",
        variant: "destructive"
      });
      return;
    }
  
    if (withdrawQuantity > selectedProduct.quantidadeEstoque) {
      toast({
        title: "Quantidade indisponível",
        description: "A quantidade solicitada excede o estoque disponível.",
        variant: "destructive"
      });
      return;
    }
  
    if (!reason) {
      toast({
        title: "Motivo necessário",
        description: "Por favor, informe o motivo da retirada.",
        variant: "destructive"
      });
      return;
    }
  
    const produtoForm: ProdutoForm = {
      nome: selectedProduct.nome,
      descricao: selectedProduct.descricao || "",
      codigoInterno: selectedProduct.codigoInterno || "",
      numeroLote: selectedProduct.numeroLote || "",
      marca: selectedProduct.marca || "",
      fabricante: selectedProduct.fabricante || "",
      tipoProdutoId: selectedProduct.tipoProduto.id,
      fornecedorId: selectedProduct.fornecedor?.id ?? undefined,
      unidadeMedida: selectedProduct.unidadeMedida || "",
      quantidadeEstoque: selectedProduct.quantidadeEstoque - withdrawQuantity,
      estoqueMinimo: selectedProduct.estoqueMinimo,
      dataValidade: selectedProduct.dataValidade ? new Date(selectedProduct.dataValidade).toISOString().split('T')[0] : '',
      dataEntrada: selectedProduct.dataEntrada ? new Date(selectedProduct.dataEntrada).toISOString().split('T')[0] : '',
      localizacao: selectedProduct.localizacao || "",
      observacoes: selectedProduct.observacoes || "",
      ativo: selectedProduct.ativo || false,
      controladoPelaPF:  selectedProduct.controladoPelaPF || false
    };
  
    try {
      await ajustarEstoque.mutateAsync({ id: selectedProduct.id, produtoForm, motivo: reason });
      toast({
        title: "Produto retirado com sucesso",
        description: `${withdrawQuantity} unidades de ${selectedProduct.nome} foram retiradas do estoque.`,
      });
      setSelectedProduct(null);
      setWithdrawQuantity(1);
      setReason('');
    } catch (error) {
      toast({
        title: "Erro na retirada",
        description: "Não foi possível atualizar o estoque. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    console.log(products),
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* <Header /> */}
      <Header1 />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-poppins">Retirada de Produtos</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side - Product list */}
          <div className="lg:col-span-2 ">
            <Card>
              <CardHeader >
                <CardTitle className='"block text-sm font-medium text-purple-700 mb-2 font-poppins text-lg'>Produtos em Estoque</CardTitle>
                <CardDescription>Selecione um produto para retirada</CardDescription>
                
                <div className="flex items-center bg-gray-100 rounded-md mt-4 px-3 py-2">
                  <Search className="h-4 w-4 text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou código ou localização..."
                    className="bg-transparent border-none outline-none text-sm w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto max-h-96">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Localizacao</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Validade</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProdutos.map((product) => (
                        <TableRow 
                          key={product.id} 
                          className={selectedProduct?.id === product.id ? "bg-muted" : ""}
                        >
                          <TableCell>{product.nome}</TableCell>
                          <TableCell>{product.id}</TableCell>
                          <TableCell>{product.localizacao}</TableCell>
                          <TableCell>
                            <span className={
                              product.quantidadeEstoque <= 1
                                ? "text-red-600 font-medium"
                                : "text-green-600 font-medium"
                            }>
                              {product.quantidadeEstoque}
                            </span>
                          </TableCell>
                          <TableCell>{toDate(product.dataValidade).toLocaleDateString('pt-BR') === 'Invalid Date' ? 'N/A' : toDate(product.dataValidade).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 px-8 py-3 rounded-xl font-montserrat shadow-lg hover:shadow-xl transition-all duration-300 hover:cursor-pointer"
                              onClick={() => setSelectedProduct(product)}
                            >
                              Selecionar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right side - Withdraw form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="block text-sm font-medium text-purple-700 mb-2 font-poppins text-lg">
                  Retirar Produto
                </CardTitle>
                <CardDescription>Preencha os dados para fazer a retirada</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedProduct ? (
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Produto:</span>
                        <span className="font-medium">{selectedProduct.nome}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Código:</span>
                        <span>{selectedProduct.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Disponível:</span>
                        <span className="font-medium">{selectedProduct.quantidadeEstoque} unidades</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Quantidade a retirar</label>
                      <input
                        type="number"
                        min="1"
                        max={selectedProduct.quantidadeEstoque}
                        value={withdrawQuantity}
                        onChange={(e) => setWithdrawQuantity(parseInt(e.target.value) || 0)}
                        className="form-input border border-purple-200 rounded-xl w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Informe a quantidade..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Motivo da retirada</label>
                      <textarea
                        rows={3}
                        placeholder="Informe o motivo da retirada..."
                        className="form-input resize-none border border-purple-200 rounded-xl w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center pt-4">
                      <User className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">Operador: Carlos Silva</span>
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 px-8 py-3 rounded-xl font-montserrat shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={handleWithdraw}
                        disabled={withdrawQuantity <= 0 || withdrawQuantity > selectedProduct.quantidadeEstoque || !reason}
                      >
                        Confirmar Retirada
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg mb-2">Nenhum produto selecionado</h3>
                    <p className="text-muted-foreground text-sm">
                      Selecione um produto da lista para realizar uma retirada.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex justify-start pt-6">
          <Button
            type="button"
            onClick={() => navigate('/Dashboard')}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 px-8 py-3 rounded-xl font-montserrat shadow-lg hover:shadow-xl transition-all duration-300 mr-75 "
          >
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawProduct;