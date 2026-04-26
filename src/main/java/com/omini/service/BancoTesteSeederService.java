package com.omini.service;

import com.omini.model.entity.Alerta;
import com.omini.model.entity.Fornecedor;
import com.omini.model.entity.MovimentacaoEstoque;
import com.omini.model.entity.PerfilUsuario;
import com.omini.model.entity.Produto;
import com.omini.model.entity.TipoProduto;
import com.omini.model.entity.Usuario;
import com.omini.model.enums.StatusAlerta;
import com.omini.model.enums.TipoAlerta;
import com.omini.model.enums.TipoMovimentacao;
import com.omini.repository.AlertaRepository;
import com.omini.repository.FornecedorRepository;
import com.omini.repository.MovimentacaoEstoqueRepository;
import com.omini.repository.PerfilUsuarioRepository;
import com.omini.repository.ProdutoRepository;
import com.omini.repository.TipoProdutoRepository;
import com.omini.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BancoTesteSeederService {

    private static final String LOGIN_TESTE = "admin.teste";
    private static final String CNPJ_FORNECEDOR_TESTE = "00.000.000/0000-00";
    private static final String TIPO_PRODUTO_TESTE = "REAG. TESTE";

    private final PerfilUsuarioRepository perfilRepo;
    private final UsuarioRepository usuarioRepo;
    private final TipoProdutoRepository tipoRepo;
    private final FornecedorRepository fornecedorRepo;
    private final ProdutoRepository produtoRepo;
    private final MovimentacaoEstoqueRepository movimentacaoRepo;
    private final AlertaRepository alertaRepo;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void popularBancoSeNecessario() {
        PerfilUsuario perfil = obterOuCriarPerfilAdministrador();
        Usuario usuario = obterOuCriarUsuarioTeste(perfil);
        TipoProduto tipoProduto = obterOuCriarTipoProdutoTeste();
        Fornecedor fornecedor = obterOuCriarFornecedorTeste();

        criarProdutoSeNecessario(
                "TESTE-001",
                "Álcool 70% - Teste",
                "Produto de teste com estoque confortável",
                20,
                5,
                LocalDate.now().plusMonths(8),
                false,
                tipoProduto,
                fornecedor
        ).ifPresent(produto -> registrarEntradaTeste(produto, usuario, produto.getQuantidadeEstoque()));

        criarProdutoSeNecessario(
                "TESTE-002",
                "Acetona PA - Teste",
                "Produto de teste com estoque crítico",
                1,
                5,
                LocalDate.now().plusMonths(2),
                true,
                tipoProduto,
                fornecedor
        ).ifPresent(produto -> {
            registrarEntradaTeste(produto, usuario, produto.getQuantidadeEstoque());
            criarAlertaEstoqueMinimoSeNecessario(produto);
        });

        criarProdutoSeNecessario(
                "TESTE-003",
                "Luvas nitrílicas - Teste",
                "Produto de teste sem estoque",
                0,
                10,
                LocalDate.now().plusYears(1),
                false,
                tipoProduto,
                fornecedor
        ).ifPresent(this::criarAlertaEstoqueMinimoSeNecessario);
    }

    private PerfilUsuario obterOuCriarPerfilAdministrador() {
        return perfilRepo.findByNome("Administrador")
                .orElseGet(() -> {
                    PerfilUsuario perfil = new PerfilUsuario();
                    perfil.setNome("Administrador");
                    perfil.setDescricao("Acesso total ao sistema");
                    return perfilRepo.save(perfil);
                });
    }

    private Usuario obterOuCriarUsuarioTeste(PerfilUsuario perfil) {
        return usuarioRepo.findByLogin(LOGIN_TESTE)
                .orElseGet(() -> {
                    Usuario usuario = new Usuario();
                    usuario.setNomeCompleto("Administrador de Teste");
                    usuario.setLogin(LOGIN_TESTE);
                    usuario.setEmail("admin.teste@omini.local");
                    usuario.setSenha(passwordEncoder.encode("teste123"));
                    usuario.setPerfil(perfil);
                    usuario.setAtivo(true);
                    usuario.setDataCadastro(LocalDateTime.now());
                    return usuarioRepo.save(usuario);
                });
    }

    private TipoProduto obterOuCriarTipoProdutoTeste() {
        return tipoRepo.findByNome(TIPO_PRODUTO_TESTE)
                .orElseGet(() -> {
                    TipoProduto tipoProduto = new TipoProduto();
                    tipoProduto.setNome(TIPO_PRODUTO_TESTE);
                    tipoProduto.setDescricao("Tipo usado para popular bases locais de teste");
                    return tipoRepo.save(tipoProduto);
                });
    }

    private Fornecedor obterOuCriarFornecedorTeste() {
        return fornecedorRepo.findByCnpj(CNPJ_FORNECEDOR_TESTE)
                .orElseGet(() -> {
                    Fornecedor fornecedor = new Fornecedor();
                    fornecedor.setRazaoSocial("Fornecedor de Teste LTDA");
                    fornecedor.setNomeFantasia("Fornecedor Teste");
                    fornecedor.setCnpj(CNPJ_FORNECEDOR_TESTE);
                    fornecedor.setContatoPrincipalNome("Equipe Omini");
                    fornecedor.setContatoPrincipalTelefone("(00) 90000-0000");
                    fornecedor.setContatoPrincipalEmail("fornecedor.teste@omini.local");
                    fornecedor.setEndereco("Ambiente local de desenvolvimento");
                    fornecedor.setObservacoes("Registro criado automaticamente para testes locais.");
                    fornecedor.setAtivo(true);
                    return fornecedorRepo.save(fornecedor);
                });
    }

    private Optional<Produto> criarProdutoSeNecessario(
            String codigoInterno,
            String nome,
            String descricao,
            Integer quantidadeEstoque,
            Integer estoqueMinimo,
            LocalDate dataValidade,
            Boolean controladoPelaPF,
            TipoProduto tipoProduto,
            Fornecedor fornecedor
    ) {
        if (produtoRepo.existsByCodigoInterno(codigoInterno)) {
            return Optional.empty();
        }

        Produto produto = new Produto();
        produto.setCodigoInterno(codigoInterno);
        produto.setNome(nome);
        produto.setDescricao(descricao);
        produto.setMarca("Omini Testes");
        produto.setFabricante("Laboratório de Teste");
        produto.setFornecedor(fornecedor);
        produto.setTipoProduto(tipoProduto);
        produto.setUnidadeMedida("un");
        produto.setQuantidadeEstoque(quantidadeEstoque);
        produto.setEstoqueMinimo(estoqueMinimo);
        produto.setDataValidade(dataValidade);
        produto.setDataEntrada(LocalDateTime.now());
        produto.setLocalizacao("Bancada de Testes");
        produto.setObservacoes("Produto criado automaticamente para testes locais.");
        produto.setAtivo(true);
        produto.setControladoPelaPF(controladoPelaPF);

        return Optional.of(produtoRepo.save(produto));
    }

    private void registrarEntradaTeste(Produto produto, Usuario usuario, Integer quantidade) {
        if (quantidade == null || quantidade <= 0) {
            return;
        }

        MovimentacaoEstoque movimentacao = new MovimentacaoEstoque();
        movimentacao.setProduto(produto);
        movimentacao.setUsuario(usuario);
        movimentacao.setTipoMovimentacao(TipoMovimentacao.ENTRADA);
        movimentacao.setQuantidade(quantidade);
        movimentacao.setJustificativa("Carga inicial de teste");
        movimentacao.setProjetoAssociado("Omini local");
        movimentacao.setObservacoes("Movimentação criada automaticamente para testes locais.");
        movimentacaoRepo.save(movimentacao);
    }

    private void criarAlertaEstoqueMinimoSeNecessario(Produto produto) {
        boolean alertaExiste = alertaRepo.existsByProdutoIdAndTipoAlertaAndStatusIn(
                produto.getId(),
                TipoAlerta.ESTOQUE_MINIMO,
                List.of(StatusAlerta.PENDENTE, StatusAlerta.VISUALIZADO)
        );

        if (alertaExiste) {
            return;
        }

        Alerta alerta = new Alerta();
        alerta.setProduto(produto);
        alerta.setTipoAlerta(TipoAlerta.ESTOQUE_MINIMO);
        alerta.setMensagem("Produto de teste com estoque abaixo do mínimo.");
        alerta.setStatus(StatusAlerta.PENDENTE);
        alertaRepo.save(alerta);
    }
}
