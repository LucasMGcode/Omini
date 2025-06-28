package com.omini.model.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Produto")
@Data
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String descricao;
    private String codigoInterno;
    private String numeroLote;
    private String marca;
    private String fabricante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fornecedor_id")
    private Fornecedor fornecedor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_produto_id")
    private TipoProduto tipoProduto;

    private String unidadeMedida;
    private Integer quantidadeEstoque = 0;
    private Integer estoqueMinimo = 0;
    private LocalDate dataValidade;
    private LocalDateTime dataEntrada;
    private String localizacao;
    private String observacoes;
    private Boolean ativo = true;

    @Column(name = "controlado_pela_PF", nullable = false)
    private Boolean controladoPelaPF = false;
}
