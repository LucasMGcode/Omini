package com.omini.dto;

import jakarta.validation.constraints.NotBlank;

public record TipoProdutoForm(
        @NotBlank String nome,
        String descricao
) {}
