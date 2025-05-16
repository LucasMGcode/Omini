package com.omini.repository;

import com.omini.model.entity.MovimentacaoEstoque;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovimentacaoEstoqueRepository
        extends JpaRepository<MovimentacaoEstoque, Long> {

    // todas as movimentações de um produto, mais recentes primeiro
    List<MovimentacaoEstoque> findByProdutoIdOrderByDataMovimentacaoDesc(Long produtoId);

    // paginação por usuário
    Page<MovimentacaoEstoque> findByUsuarioId(Long usuarioId, Pageable pageable);
}
