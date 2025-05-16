package com.omini.repository;

import com.omini.model.entity.TipoProduto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TipoProdutoRepository extends JpaRepository<TipoProduto, Long> {
    Optional<TipoProduto> findByNome(String nome);
    boolean existsByNome(String nome);
}
