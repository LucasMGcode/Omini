package com.omini.dto;

import jakarta.validation.constraints.*;

public record FornecedorForm(
        @NotBlank String razaoSocial,
        String nomeFantasia,
        @Pattern(regexp = "\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}",
                 message = "CNPJ inválido")
        String cnpj,
        String contatoPrincipalNome,
        String contatoPrincipalTelefone,
        @Email String contatoPrincipalEmail,
        String endereco,
        String observacoes,
        Boolean ativo
) {}
