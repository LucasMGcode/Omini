package com.omini.mapper;

import com.omini.dto.PerfilUsuarioDTO;
import com.omini.model.entity.PerfilUsuario;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PerfilUsuarioMapper {

    PerfilUsuarioDTO toDto(PerfilUsuario entity);
}
