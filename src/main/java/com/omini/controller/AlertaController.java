package com.omini.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.omini.dto.AlertaDTO;
import com.omini.model.enums.StatusAlerta;
import com.omini.service.AlertaService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/alertas")
@RequiredArgsConstructor
public class AlertaController {
    private final AlertaService service;

    @GetMapping
    public List<AlertaDTO> pendentes() {
        return service.buscarPendentes();
    }

    @PatchMapping("/{id}/status")
    public void alterarStatus(@PathVariable Long id,
                              @RequestParam StatusAlerta status) {
        service.alterarStatus(id, status);
    }
}

