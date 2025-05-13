package com.omini.service;

import com.omini.model.Produto;
import com.omini.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository repo;

    public List<Produto> listarTodos() {
        return repo.findAll();
    }

    public Produto buscarPorId(Long id) {
        return repo.findById(id)
                   .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado"));
    }

    @Transactional
    public Produto salvar(Produto p) {
        return repo.save(p);
    }

    @Transactional
    public void excluir(Long id) {
        repo.deleteById(id);
    }

    /* TODO: regras de negócio (alertas, verificação de estoque etc.) */
}
