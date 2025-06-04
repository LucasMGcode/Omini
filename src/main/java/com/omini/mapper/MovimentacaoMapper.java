package com.omini.mapper;

import com.omini.dto.MovimentacaoDTO;
import com.omini.dto.MovimentacaoForm;
import com.omini.model.entity.MovimentacaoEstoque;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface MovimentacaoMapper {

    /* Entidade → DTO */
    @Mappings({
        @Mapping(target = "produtoId",   source = "produto.id"),
        @Mapping(target = "produtoNome", source = "produto.nome"),
        @Mapping(target = "usuarioId",   source = "usuario.id"),
        @Mapping(target = "usuarioLogin",source = "usuario.login")
    })
    MovimentacaoDTO toDto(MovimentacaoEstoque entity);

    /* Form → Entidade (o Service injeta produto/usuario) */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "produto", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    @Mapping(target = "dataMovimentacao", ignore = true)
    @Mapping(target = "observacoes", source = "observacoes")
    MovimentacaoEstoque toEntity(MovimentacaoForm form);
}
