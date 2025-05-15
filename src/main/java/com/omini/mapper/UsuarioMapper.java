package com.omini.mapper;

import com.omini.dto.UsuarioDTO;
import com.omini.dto.UsuarioForm;
import com.omini.model.entity.PerfilUsuario;
import com.omini.model.entity.Usuario;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring",
    uses = {PerfilUsuarioMapper.class})
public interface UsuarioMapper {

    UsuarioDTO toDto(Usuario entity);

    @Mapping(target = "id",           ignore = true)
    @Mapping(target = "senha",        ignore = true)
    @Mapping(target = "dataCadastro", ignore = true)
    @Mapping(target = "perfil",       expression = "java(perfil)")
    Usuario toEntity(UsuarioForm form,
             @Context PerfilUsuario perfil);

    @Mapping(target = "id",           ignore = true)
    @Mapping(target = "senha",        ignore = true)
    @Mapping(target = "perfil",       ignore = true)
    @Mapping(target = "dataCadastro", ignore = true)
    void updateEntity(@MappingTarget Usuario entity, UsuarioForm form);
}
