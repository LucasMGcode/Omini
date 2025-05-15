package com.omini.dto;

import com.omini.model.enums.TipoMovimentacao;

import jakarta.validation.constraints.*;

public record MovimentacaoForm(
        @NotNull TipoMovimentacao tipoMovimentacao,
        @Positive Integer quantidade,
        String justificativa,
        String projetoAssociado,
        String observacoes
) {}
