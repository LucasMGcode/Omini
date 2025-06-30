package com.omini.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.omini.dto.MovimentacaoDTO;
import com.omini.service.MovimentacaoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/movimentacoes")
@RequiredArgsConstructor
public class MovimentacaoController {

    private final MovimentacaoService service;

    @GetMapping
    public Page<MovimentacaoDTO> listarTodos(Pageable pageable) {
        return service.listarTodos(pageable);
    }
}
