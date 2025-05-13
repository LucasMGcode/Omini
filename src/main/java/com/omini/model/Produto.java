package com.omini.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "produtos")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 40)
    private String codigo;

    @Column(nullable = false, length = 120)
    private String nome;

    private String empresa;
    private String peso;            // Ex.: “500 g”
    private Integer qtdFechada;     // Embalagens fechadas
    private Integer qtdAberta;      // Conteúdo aberto para uso
    private Integer qtdMinima;      // Alerta de reposição
    private String local;           // Geladeira, Freezer, etc.
    private String condicaoEstoque; // MODERADO, CRÍTICO …

    private Boolean verificado;     // Check de qualidade/validade
    private LocalDate dataVerificacao;

    private String observacao;
}
