package com.omini.dto;

import com.omini.model.enums.StatusAlerta;
import com.omini.model.enums.TipoAlerta;

import java.time.LocalDateTime;

public record AlertaDTO(
        Long id,
        Long produtoId,
        String produtoNome,
        TipoAlerta tipoAlerta,
        String mensagem,
        StatusAlerta status,
        LocalDateTime dataGeracao,
        LocalDateTime dataVisualizacao,
        LocalDateTime dataResolucao
) {}
