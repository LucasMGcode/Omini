package com.omini.repository;

import com.omini.model.Movimentacao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MovimentacaoRepository extends JpaRepository<Movimentacao, Long> {
    List<Movimentacao> findByProdutoIdOrderByDataHoraDesc(Long produtoId);
}
