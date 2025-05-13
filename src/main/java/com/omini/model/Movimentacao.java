package com.omini.model;

import javax.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;

@Entity
@Data
@Table(name = "movimentacoes")
public class Movimentacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Produto produto;

    @Enumerated(EnumType.STRING)
    @Column(length = 8, nullable = false)
    private TipoMovimento tipo;

    private Integer quantidade;

    private LocalDateTime dataHora = LocalDateTime.now();

    private String observacao;

    public enum TipoMovimento { ENTRADA, SAIDA }
}
