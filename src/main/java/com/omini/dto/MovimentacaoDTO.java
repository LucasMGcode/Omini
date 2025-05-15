package com.omini.dto;

import com.omini.model.enums.TipoMovimentacao;

import java.time.LocalDateTime;

public record MovimentacaoDTO(
        Long id,
        Long produtoId,
        String produtoNome,
        Long usuarioId,
        String usuarioLogin,
        TipoMovimentacao tipoMovimentacao,
        Integer quantidade,
        LocalDateTime dataMovimentacao,
        String justificativa,
        String projetoAssociado
) {}
