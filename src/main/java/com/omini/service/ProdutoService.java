package com.omini.service;

import com.omini.dto.ProdutoDTO;
import com.omini.dto.ProdutoForm;
import com.omini.mapper.ProdutoMapper;
import com.omini.model.entity.Fornecedor;
import com.omini.model.entity.Produto;
import com.omini.model.entity.TipoProduto;
import com.omini.model.enums.TipoAlerta;
import com.omini.repository.FornecedorRepository;
import com.omini.repository.ProdutoRepository;
import com.omini.repository.TipoProdutoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Transactional(readOnly = true)
    public Page<ProdutoDTO> listar(Pageable pageable) {
        return produtoRepo.findAll(pageable)
                .map(mapper::toDto);
    }

    @Transactional(readOnly = true)
    public ProdutoDTO buscar(Long id) {
        return mapper.toDto(produtoRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto id=" + id + " não encontrado")));
    }

    @Transactional
    public ProdutoDTO criar(ProdutoForm form) {
        Produto entity = toEntity(form);
        Produto salvo = produtoRepo.save(entity);

        // Lógica de alerta após criação
        if (salvo.getQuantidadeEstoque() <= salvo.getEstoqueMinimo()) {
            alertaService.criarSeNaoExistir(
                salvo,
                TipoAlerta.ESTOQUE_MINIMO,
                "Estoque abaixo do mínimo (" + salvo.getQuantidadeEstoque() + ")"
            );
        }

        return mapper.toDto(salvo);
    }

    @Transactional
    public ProdutoDTO atualizar(Long id, ProdutoForm form) {
        Produto entity = produtoRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto id=" + id + " não encontrado"));

        mapper.updateEntity(
                entity,
                form,
                buscarTipoProduto(form.tipoProdutoId()),
                buscarFornecedorOpcional(form.fornecedorId()));

        Produto salvo = produtoRepo.save(entity);

        // Lógica de alerta após atualização
        if (salvo.getQuantidadeEstoque() <= salvo.getEstoqueMinimo()) {
            alertaService.criarSeNaoExistir(
                salvo,
                TipoAlerta.ESTOQUE_MINIMO,
                "Estoque abaixo do mínimo (" + salvo.getQuantidadeEstoque() + ")"
            );
        }

        return mapper.toDto(salvo); 
    }

    @Transactional
    public void remover(Long id) {
        if (!produtoRepo.existsById(id)) {
            throw new EntityNotFoundException("Produto id=" + id + " não encontrado");
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
}
