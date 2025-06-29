package com.omini.repository;

import com.omini.model.entity.Produto;

import org.springframework.data.domain.Page;
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

    @Query("""
                SELECT p FROM Produto p
                WHERE LOWER(p.nome) LIKE LOWER(CONCAT('%', :termo, '%'))
                   OR LOWER(p.codigoInterno) LIKE LOWER(CONCAT('%', :termo, '%'))
                   OR LOWER(p.localizacao) LIKE LOWER(CONCAT('%', :termo, '%'))
            """)
    Page<Produto> buscarPorNomeCodigoLocalizacao(String termo, org.springframework.data.domain.Pageable pageable);
}
