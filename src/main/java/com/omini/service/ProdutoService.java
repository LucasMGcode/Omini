package com.omini.service;

import com.omini.dto.MovimentacaoForm;
import com.omini.dto.ProdutoDTO;
import com.omini.dto.ProdutoForm;
import com.omini.mapper.ProdutoMapper;
import com.omini.model.entity.Fornecedor;
import com.omini.model.entity.Produto;
import com.omini.model.entity.TipoProduto;
import com.omini.model.enums.TipoAlerta;
import com.omini.model.enums.TipoMovimentacao;
import com.omini.repository.FornecedorRepository;
import com.omini.repository.ProdutoRepository;
import com.omini.repository.TipoProdutoRepository;
import com.omini.security.UsuarioAutenticadoService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepo;
    private final TipoProdutoRepository tipoRepo;
    private final FornecedorRepository fornecedorRepo;
    private final ProdutoMapper mapper;

    @Autowired
    private AlertaService alertaService;

    @Autowired
    private MovimentacaoService movimentacaoService;

    @Autowired
    private UsuarioAutenticadoService usuarioAutenticado;

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'SUPERVISOR', 'FUNCIONARIO')")
    @Transactional(readOnly = true)
    public Page<ProdutoDTO> listar(Pageable pageable) {
        return produtoRepo.findAll(pageable)
                .map(mapper::toDto);
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'SUPERVISOR', 'FUNCIONARIO')")
    @Transactional(readOnly = true)
    public Page<ProdutoDTO> buscarComFiltro(String search, Pageable pageable) {
        if (search == null || search.isBlank()) {
            return listar(pageable);
        }
        return produtoRepo.buscarPorNomeCodigoLocalizacao(search.toLowerCase(), pageable)
                .map(mapper::toDto);
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'SUPERVISOR', 'FUNCIONARIO')")
    @Transactional(readOnly = true)
    public ProdutoDTO buscar(Long id) {
        return mapper.toDto(produtoRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto id=" + id + " não encontrado")));
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'SUPERVISOR')")
    @Transactional
    public ProdutoDTO criar(ProdutoForm form) {
        Produto entity = toEntity(form);
        Produto salvo = produtoRepo.save(entity);

        if (salvo.getQuantidadeEstoque() > 0) {
            MovimentacaoForm mov = new MovimentacaoForm(
                TipoMovimentacao.ENTRADA,
                salvo.getQuantidadeEstoque(),
                "Cadastro inicial",
                null,
                "Movimentação gerada automaticamente ao criar produto"
            );

            Long usuarioId = usuarioAutenticado.getUsuarioId();
            movimentacaoService.registrar(salvo.getId(), usuarioId, mov);
        }

        // Lógica de alerta após criação
        verificarEstoqueMinimo(salvo);

        return mapper.toDto(salvo);
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'SUPERVISOR')")
    @Transactional
    public ProdutoDTO atualizar(Long id, ProdutoForm form) {
        Produto entity = produtoRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto id=" + id + " não encontrado"));

        int quantidadeAnterior = entity.getQuantidadeEstoque();

        mapper.updateEntity(
                entity,
                form,
                buscarTipoProduto(form.tipoProdutoId()),
                buscarFornecedorOpcional(form.fornecedorId()));

        Produto salvo = produtoRepo.save(entity);

        if (form.quantidadeEstoque() != null && form.quantidadeEstoque() != quantidadeAnterior) {
            int diferenca = form.quantidadeEstoque() - quantidadeAnterior;

            TipoMovimentacao tipoMov = diferenca > 0
                    ? TipoMovimentacao.AJUSTE_POSITIVO
                    : TipoMovimentacao.AJUSTE_NEGATIVO;

            MovimentacaoForm mov = new MovimentacaoForm(
                tipoMov,
                Math.abs(diferenca),
                "Ajuste automático por edição",
                null,
                "Alteração direta da quantidade em edição de produto"
            );

            Long usuarioId = usuarioAutenticado.getUsuarioId();
            movimentacaoService.registrar(salvo.getId(), usuarioId, mov);
        }

        // Lógica de alerta após atualização
        verificarEstoqueMinimo(salvo);

        return mapper.toDto(salvo); 
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @Transactional
    public void remover(Long id) {
        Produto produto = produtoRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Produto id=" + id + " não encontrado"));

        int quantidadeAtual = produto.getQuantidadeEstoque();
        if (quantidadeAtual > 0) {
            MovimentacaoForm mov = new MovimentacaoForm(
                TipoMovimentacao.SAIDA_DESCARTE,
                quantidadeAtual,
                "Saída automática antes de exclusão",
                null,
                "O produto foi removido e seu estoque descartado"
            );

            Long usuarioId = usuarioAutenticado.getUsuarioId();
            movimentacaoService.registrar(produto.getId(), usuarioId, mov);
        }

        produtoRepo.deleteById(id);
    }

    private Produto toEntity(ProdutoForm f) {
        TipoProduto tipo = buscarTipoProduto(f.tipoProdutoId());
        Fornecedor fornecedor = buscarFornecedorOpcional(f.fornecedorId());
        return mapper.toEntity(f, tipo, fornecedor);
    }

    private TipoProduto buscarTipoProduto(Long id) {
        return tipoRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("TipoProduto id=" + id + " não encontrado"));
    }

    private Fornecedor buscarFornecedorOpcional(Long id) {
        if (id == null)
            return null;
        return fornecedorRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Fornecedor id=" + id + " não encontrado"));
    }

    private void verificarEstoqueMinimo(Produto produto) {
        if (produto.getQuantidadeEstoque() <= produto.getEstoqueMinimo()) {
            alertaService.criarSeNaoExistir(
                produto,
                TipoAlerta.ESTOQUE_MINIMO,
                "Estoque abaixo do mínimo (" + produto.getQuantidadeEstoque() + ")"
            );
        }
    }
}
