package com.omini.model.entity;

import java.time.LocalDateTime;

import com.omini.model.enums.StatusAlerta;
import com.omini.model.enums.TipoAlerta;

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
@Table(name = "Alerta", schema = "dbo")
@Data
public class Alerta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "produto_id")
    private Produto produto;

    @Enumerated(EnumType.STRING)
    private TipoAlerta tipoAlerta;

    private LocalDateTime dataGeracao = LocalDateTime.now();
    private String mensagem;

    @Enumerated(EnumType.STRING)
    private StatusAlerta status = StatusAlerta.PENDENTE;

    private LocalDateTime dataVisualizacao;
    private LocalDateTime dataResolucao;
}
