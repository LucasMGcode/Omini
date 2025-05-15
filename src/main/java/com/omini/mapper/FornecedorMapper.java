package com.omini.mapper;

import com.omini.dto.FornecedorDTO;
import com.omini.dto.FornecedorForm;
import com.omini.model.entity.Fornecedor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface FornecedorMapper {

    FornecedorDTO toDto(Fornecedor entity);

    @Mapping(target = "id", ignore = true)
    Fornecedor toEntity(FornecedorForm form);

    @Mapping(target = "id", ignore = true)
    void updateEntity(@MappingTarget Fornecedor entity, FornecedorForm form);
}
