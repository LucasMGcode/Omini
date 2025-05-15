package com.omini.dto;

import java.time.LocalDateTime;

public record UsuarioDTO(
        Long id,
        String nomeCompleto,
        String login,
        String email,
        PerfilUsuarioDTO perfil,
        Boolean ativo,
        LocalDateTime dataCadastro
) {}
