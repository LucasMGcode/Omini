package com.omini.mapper;

import com.omini.dto.MovimentacaoDTO;
import com.omini.dto.MovimentacaoForm;
import com.omini.model.entity.MovimentacaoEstoque;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface MovimentacaoMapper {

    /* Entidade → DTO */
    
    @Mapping(target = "produtoId", expression = "java( entity.getProduto() == null ? null : entity.getProduto().getId() )")
    @Mapping(target = "produtoNome", expression = "java( entity.getProduto() == null ? null : entity.getProduto().getNome() )")
    @Mapping(target = "usuarioId", expression = "java( entity.getUsuario() == null ? null : entity.getUsuario().getId() )")
    @Mapping(target = "usuarioLogin", expression = "java( entity.getUsuario() == null ? null : entity.getUsuario().getLogin() )")
    
    MovimentacaoDTO toDto(MovimentacaoEstoque entity);

    /* Form → Entidade (o Service injeta produto/usuario) */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "produto", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    @Mapping(target = "dataMovimentacao", ignore = true)
    @Mapping(target = "observacoes", source = "observacoes")
    MovimentacaoEstoque toEntity(MovimentacaoForm form);
}
