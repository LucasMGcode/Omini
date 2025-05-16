package com.omini.repository;

import com.omini.model.entity.PerfilUsuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PerfilUsuarioRepository extends JpaRepository<PerfilUsuario, Long> {
    Optional<PerfilUsuario> findByNome(String nome);
    boolean existsByNome(String nome);
}
