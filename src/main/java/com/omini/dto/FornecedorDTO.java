package com.omini.dto;

public record FornecedorDTO(
        Long id,
        String razaoSocial,
        String nomeFantasia,
        String cnpj,
        String contatoPrincipalNome,
        String contatoPrincipalTelefone,
        String contatoPrincipalEmail,
        String ativo
) {}
