package com.omini.mapper;

import com.omini.dto.ProdutoDTO;
import com.omini.dto.ProdutoForm;
import com.omini.model.entity.Fornecedor;
import com.omini.model.entity.Produto;
import com.omini.model.entity.TipoProduto;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring",
    uses = {TipoProdutoMapper.class, FornecedorMapper.class})
public interface ProdutoMapper {

    ProdutoDTO toDto(Produto entity);

    @Mapping(target = "id",          ignore = true)
    @Mapping(target = "ativo",       ignore = true)
    @Mapping(target = "tipoProduto", expression = "java(tipo)")
    @Mapping(target = "fornecedor",  expression = "java(fornecedor)")
    Produto toEntity(ProdutoForm form,
             @Context TipoProduto tipo,
             @Context Fornecedor fornecedor);

    @Mapping(target = "id",          ignore = true)
    @Mapping(target = "dataEntrada", source = "form.dataEntrada")
    @Mapping(target = "ativo",       ignore = true)
    @Mapping(target = "tipoProduto", expression = "java(tipo)")
    @Mapping(target = "fornecedor",  expression = "java(fornecedor)")
    void updateEntity(@MappingTarget Produto entity,
              ProdutoForm form,
              @Context TipoProduto tipo,
              @Context Fornecedor fornecedor);
}
