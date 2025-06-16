package com.omini.dto;

import java.time.LocalDate;

public record ProdutoDTO(
        Long id,
        String nome,
        String marca,
        Integer quantidadeEstoque,
        Integer estoqueMinimo,
        LocalDate dataValidade,
        TipoProdutoDTO tipoProduto,
        FornecedorDTO fornecedor,
        String localizacao
) {}
// Somente campos de leitura enviados ao front-end.
