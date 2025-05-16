package com.omini.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping public List<TipoProdutoDTO> listar() { return service.listar(); }

    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public TipoProdutoDTO criar(@Valid @RequestBody TipoProdutoForm form) {
        return service.criar(form);
    }
}
