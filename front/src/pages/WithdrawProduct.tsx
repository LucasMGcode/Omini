import { useState } from 'react';
import Header1 from '../components/Header';
import { Package, User, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useProdutos, type ProdutoDTO } from '@/hooks/useProdutos';
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
import { toDate, isValid } from 'date-fns';

const WithdrawProduct = () => {
  const navigate = useNavigate();
  const { data: products } = useProdutos();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProdutoDTO | null>(null);
  const [withdrawQuantity, setWithdrawQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>('');
  const ajustarEstoque = useAjustarEstoque();

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
      controladoPelaPF: selectedProduct.controladoPelaPF || false
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-purple-50 to-white">
      <Header1 />
      <div className="container mx-auto px-4 py-10 space-y-8">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-poppins">
          Retirada de Produtos
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-md border border-purple-100 rounded-2xl">
              <CardHeader className="space-y-4">
                <CardTitle className="text-purple-700 font-semibold text-lg font-poppins">Produtos em Estoque</CardTitle>
                <CardDescription className="text-gray-500">Selecione um produto para retirada</CardDescription>
                <div className="flex items-center bg-white border border-purple-300 rounded-xl px-4 py-2 shadow-sm">
                  <Search className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Buscar por nome, código ou localização..."
                    className="w-full bg-transparent outline-none text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>

              <CardContent className="max-h-[420px] overflow-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-transparent">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Qtd</TableHead>
                      <TableHead>Validade</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProdutos.map((product) => (
                      <TableRow key={product.id} className={selectedProduct?.id === product.id ? "bg-purple-50" : ""}>
                        <TableCell>{product.nome}</TableCell>
                        <TableCell>{product.id}</TableCell>
                        <TableCell>{product.localizacao}</TableCell>
                        <TableCell>
                          <span className={product.quantidadeEstoque <= 1 ? "text-red-600 font-bold" : "text-green-600 font-semibold"}>
                            {product.quantidadeEstoque}
                          </span>
                        </TableCell>
                        <TableCell>
                          {isValid(toDate(product.dataValidade))
                            ? toDate(product.dataValidade).toLocaleDateString('pt-BR')
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={product.quantidadeEstoque <= 0}
                            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 px-6 py-2 rounded-xl font-medium transition-all duration-300"
                            onClick={() => {
                              setSelectedProduct(product);
                              setWithdrawQuantity(1);
                              setReason('');
                            }}>
                            Selecionar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="shadow-md border border-purple-100 rounded-2xl">
              <CardHeader className="space-y-4">
                <CardTitle className="text-purple-700 font-semibold text-lg font-poppins">Retirar Produto</CardTitle>
                <CardDescription className="text-gray-500">Preencha os dados para retirada</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {selectedProduct ? (
                  <div className="space-y-4">
                    <div className="bg-purple-50 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Produto:</span>
                        <span className="font-medium">{selectedProduct.nome}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Código:</span>
                        <span>{selectedProduct.id}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Disponível:</span>
                        <span className="font-semibold">{selectedProduct.quantidadeEstoque} unidades</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-700 block mb-1">Quantidade a retirar</label>
                      <input
                        type="number"
                        min="1"
                        max={selectedProduct.quantidadeEstoque}
                        value={withdrawQuantity}
                        onChange={(e) => setWithdrawQuantity(parseInt(e.target.value) || 0)}
                        className={`w-full px-4 py-2 rounded-xl border ${withdrawQuantity > selectedProduct.quantidadeEstoque ? 'border-red-500' : 'border-purple-300'
                          } shadow-sm focus:outline-none focus:ring-2 ${withdrawQuantity > selectedProduct.quantidadeEstoque ? 'focus:ring-red-500' : 'focus:ring-purple-500'
                          }`}
                      />
                      {withdrawQuantity > selectedProduct.quantidadeEstoque && (
                        <p className="text-sm text-red-500 mt-1">Quantidade superior ao estoque disponível</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm text-gray-700 block mb-1">Motivo da retirada</label>
                      <textarea
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-purple-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        placeholder="Informe o motivo da retirada..."
                      />
                    </div>

                    <div className="flex items-center text-sm text-gray-600 pt-2">
                      <User className="h-4 w-4 mr-2" />
                      Operador: Carlos Silva
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 px-8 py-3 rounded-xl font-medium shadow-lg transition-all duration-300"
                      onClick={handleWithdraw}
                      disabled={
                        withdrawQuantity <= 0 ||
                        withdrawQuantity > selectedProduct.quantidadeEstoque ||
                        !reason
                      }
                    >
                      Confirmar Retirada
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
                    <Package className="h-12 w-12 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-700">Nenhum produto selecionado</h3>
                    <p className="text-sm text-gray-500">Selecione um produto da lista ao lado para continuar.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="pt-6">
          <Button
            onClick={() => navigate('/Dashboard')}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 px-8 py-3 rounded-xl font-medium shadow-md transition-all duration-300"
          >
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawProduct;