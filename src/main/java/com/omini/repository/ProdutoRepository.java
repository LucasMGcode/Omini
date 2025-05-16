package com.omini.repository;

import com.omini.model.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    // VALIDADE
    @Query("""
        SELECT p FROM Produto p
        WHERE p.dataValidade IS NOT NULL
          AND p.dataValidade < :hoje
    """)
    List<Produto> findVencidos(LocalDate hoje);

    @Query("""
        SELECT p FROM Produto p
        WHERE p.dataValidade IS NOT NULL
          AND p.dataValidade BETWEEN :hoje AND :limite
    """)
    List<Produto> findVencendoAte(LocalDate hoje, LocalDate limite);

    // ESTOQUE
    @Query("""
        SELECT p FROM Produto p
        WHERE p.quantidadeEstoque <= p.estoqueMinimo
    """)
    List<Produto> findCriticos();
}
