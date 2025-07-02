package com.omini.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.omini.dto.FornecedorDTO;
import com.omini.dto.FornecedorForm;
import com.omini.service.FornecedorService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/fornecedores")
@RequiredArgsConstructor
public class FornecedorController {
    private final FornecedorService service;

    @GetMapping public List<FornecedorDTO> todos() { return service.todos(); }
    @GetMapping("/{id}") public FornecedorDTO porId(@PathVariable Long id) { return service.buscar(id); }

    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public FornecedorDTO criar(@Valid @RequestBody FornecedorForm f) { return service.criar(f); }

    @PutMapping("/{id}") public FornecedorDTO atualizar(@PathVariable Long id,@Valid @RequestBody FornecedorForm f){
        return service.atualizar(id,f);
    }

    @PatchMapping("/{id}/ativo")
    public void ativarOuDesativar(@PathVariable Long id,@RequestParam boolean ativo){
        service.definirAtivo(id,ativo);
    }
}

