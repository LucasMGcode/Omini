package com.omini.model.entity;

import java.time.LocalDateTime;

import com.omini.model.enums.TipoMovimentacao;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "MovimentacaoEstoque")
@Data
public class MovimentacaoEstoque {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "produto_id")
    private Produto produto;

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    private TipoMovimentacao tipoMovimentacao;

    private Integer quantidade;
    private LocalDateTime dataMovimentacao = LocalDateTime.now();
    private String justificativa;
    private String projetoAssociado;
    private String observacoes;
}

