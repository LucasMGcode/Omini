package com.omini.security;

import com.omini.model.entity.Usuario;
import lombok.Getter;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.Collections;

@Getter
public class UsuarioLogado implements UserDetails {

    private final Usuario usuario;

    public UsuarioLogado(Usuario usuario) {
        this.usuario = usuario;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String role = "ROLE_" + usuario.getPerfil().getNome().toUpperCase().replace("Ç", "C");
        return Collections.singleton(new SimpleGrantedAuthority(role));
    }

    @Override public String getPassword() { return usuario.getSenha(); }
    @Override public String getUsername() { return usuario.getLogin(); }
    @Override public boolean isAccountNonExpired()     { return true; }
    @Override public boolean isAccountNonLocked()      { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled()               { return usuario.getAtivo(); }

    public Long getId() {
        return usuario.getId();
    }
}
