package com.omini.mapper;

import com.omini.dto.AlertaDTO;
import com.omini.model.entity.Alerta;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface AlertaMapper {

    @Mappings({
        @Mapping(target = "produtoId",   source = "produto.id"),
        @Mapping(target = "produtoNome", source = "produto.nome")
    })
    AlertaDTO toDto(Alerta entity);
}
