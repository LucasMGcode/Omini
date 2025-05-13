package com.omini.controller;

import com.omini.model.Movimentacao;
import com.omini.service.MovimentacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/produtos/{idProduto}/movimentacoes")
@RequiredArgsConstructor
@CrossOrigin
public class MovimentacaoController {

    private final MovimentacaoService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Movimentacao registrar(
        @PathVariable Long idProduto,
        @RequestBody Movimentacao mov
    ) {
        return service.registrar(idProduto, mov);
    }
}
