package com.omini.model.entity;


import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Usuario")
@Data
public class Usuario {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nomeCompleto;

    @Column(nullable = false, unique = true, length = 50)
    private String login;

    @Column(nullable = false, length = 255)
    private String senha;          // hash

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @ManyToOne(optional = false)
    @JoinColumn(name = "perfil_id")
    private PerfilUsuario perfil;

    private Boolean ativo = true;

    private LocalDateTime dataCadastro = LocalDateTime.now();
}
