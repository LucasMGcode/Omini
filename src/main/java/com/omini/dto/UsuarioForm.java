package com.omini.dto;

import jakarta.validation.constraints.*;

public record UsuarioForm(

        @NotBlank
        String nomeCompleto,

        @NotBlank
        String login,

        @Email
        String email,

        @Size(min = 8, message = "Senha deve ter ao menos 8 caracteres")
        String senhaPlain,            // senha em texto-claro que será convertida em hash

        @NotNull
        Long perfilId,                // ID do perfil (Administrador, Supervisor…)

        Boolean ativo                 // opcional; default = true se null
) {}

