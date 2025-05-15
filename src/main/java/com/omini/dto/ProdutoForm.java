package com.omini.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record ProdutoForm(

        @NotBlank(message = "Nome é obrigatório")
        String nome,

        String descricao,

        String codigoInterno,

        String numeroLote,

        String marca,

        String fabricante,

        @NotNull(message = "Tipo de produto é obrigatório")
        Long tipoProdutoId,

        Long fornecedorId,

        String unidadeMedida,

        @PositiveOrZero(message = "Quantidade deve ser zero ou positiva")
        Integer quantidadeEstoque,

        @PositiveOrZero(message = "Estoque mínimo deve ser zero ou positivo")
        Integer estoqueMinimo,

        @Future(message = "Data de validade deve ser futura")
        LocalDate dataValidade,

        LocalDate dataEntrada,

        String observacoes

) {}
/*
 * Importante: o ProdutoForm contém IDs para entidades relacionadas;
 * o ProdutoService resolve esses IDs para objetos (TipoProduto, Fornecedor).
 */