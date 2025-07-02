package com.omini.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.omini.dto.MovimentacaoDTO;
import com.omini.dto.MovimentacaoForm;
import com.omini.security.UsuarioAutenticadoService;
import com.omini.service.MovimentacaoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/produtos/{produtoId}/movimentacoes")
@RequiredArgsConstructor
public class MovimentacaoEstoqueController {
    
    private final MovimentacaoService service;
    private final UsuarioAutenticadoService usuarioAutenticado;

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'SUPERVISOR', 'FUNCIONARIO')")
    @GetMapping
    public List<MovimentacaoDTO> listar(@PathVariable Long produtoId) {
        return service.listarPorProduto(produtoId);
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'SUPERVISOR')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MovimentacaoDTO registrar(@PathVariable Long produtoId,
                                     @Valid @RequestBody MovimentacaoForm form) {
        Long usuarioId = usuarioAutenticado.getUsuarioId();
        return service.registrar(produtoId, usuarioId, form);
    }
}
