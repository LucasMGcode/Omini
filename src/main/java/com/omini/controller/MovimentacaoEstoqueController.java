package com.omini.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.omini.dto.MovimentacaoDTO;
import com.omini.dto.MovimentacaoForm;
import com.omini.service.MovimentacaoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/produtos/{produtoId}/movimentacoes")
@RequiredArgsConstructor
public class MovimentacaoEstoqueController {
    private final MovimentacaoService service;

    @GetMapping
    public List<MovimentacaoDTO> listar(@PathVariable Long produtoId) {
        return service.listarPorProduto(produtoId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MovimentacaoDTO registrar(@PathVariable Long produtoId,
                                     @RequestParam Long usuarioId,
                                     @Valid @RequestBody MovimentacaoForm form) {
        return service.registrar(produtoId, usuarioId, form);
    }
}
