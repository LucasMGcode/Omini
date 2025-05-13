package com.omini.repository;

import com.omini.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    Optional<Produto> findByCodigo(String codigo);

    @Query("SELECT p FROM Produto p WHERE p.qtdAberta + p.qtdFechada <= p.qtdMinima")
    List<Produto> findEmEstoqueCritico();
}
