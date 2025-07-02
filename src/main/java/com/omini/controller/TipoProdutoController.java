package com.omini.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.omini.dto.TipoProdutoDTO;
import com.omini.dto.TipoProdutoForm;
import com.omini.service.TipoProdutoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tipos-produto")
@RequiredArgsConstructor
@Validated
public class TipoProdutoController {

    private final TipoProdutoService service;

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'SUPERVISOR', 'FUNCIONARIO')")
    @GetMapping
    public List<TipoProdutoDTO> listar() {
        return service.listar();
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'SUPERVISOR')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TipoProdutoDTO criar(@Valid @RequestBody TipoProdutoForm form) {
        return service.criar(form);
    }
}
