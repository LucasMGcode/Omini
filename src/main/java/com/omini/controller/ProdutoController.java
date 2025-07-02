package com.omini.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.omini.dto.ProdutoDTO;
import com.omini.dto.ProdutoForm;
import com.omini.service.ProdutoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/produtos")
@RequiredArgsConstructor
public class ProdutoController {
    private final ProdutoService service; // camada de regra

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'SUPERVISOR', 'FUNCIONARIO')")
    @GetMapping
    public Page<ProdutoDTO> listar(
            @RequestParam(defaultValue = "") String search,
            Pageable pageable
    ) {
        return service.buscarComFiltro(search, pageable);
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'SUPERVISOR', 'FUNCIONARIO')")
    @GetMapping("/{id}")
    public ProdutoDTO porId(@PathVariable Long id) {
        return service.buscar(id);
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'SUPERVISOR')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProdutoDTO criar(@Valid @RequestBody ProdutoForm form) {
        return service.criar(form);
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'SUPERVISOR')")
    @PutMapping("/{id}")
    public ProdutoDTO atualizar(@PathVariable Long id,
            @Valid @RequestBody ProdutoForm form) {
        return service.atualizar(id, form);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Long id) {
        service.remover(id);
    }
}
