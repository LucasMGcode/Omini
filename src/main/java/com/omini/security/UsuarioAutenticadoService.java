package com.omini.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class UsuarioAutenticadoService {
    public Long getUsuarioId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UsuarioLogado usuarioLogado)) {
            throw new IllegalStateException("Usuário não autenticado");
        }
        return usuarioLogado.getId();
    }
}