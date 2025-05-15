package com.omini.mapper;

import com.omini.dto.TipoProdutoDTO;
import com.omini.dto.TipoProdutoForm;
import com.omini.model.entity.TipoProduto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TipoProdutoMapper {

    /* Entidade → DTO */
    TipoProdutoDTO toDto(TipoProduto entity);

    /* Form → Entidade (create) */
    @Mapping(target = "id", ignore = true)
    TipoProduto toEntity(TipoProdutoForm form);

    /* Atualização in-place */
    @Mapping(target = "id", ignore = true)
    void updateEntity(@MappingTarget TipoProduto entity, TipoProdutoForm form);
}
