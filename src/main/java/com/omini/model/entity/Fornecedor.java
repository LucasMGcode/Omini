package com.omini.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Fornecedor")
@Data
public class Fornecedor {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String razaoSocial;
    private String nomeFantasia;
    private String cnpj;
    private String contatoPrincipalNome;
    private String contatoPrincipalTelefone;
    private String contatoPrincipalEmail;
    private String endereco;
    private String observacoes;
    private Boolean ativo = true;
}
