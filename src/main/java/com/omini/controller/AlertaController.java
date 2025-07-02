package com.omini.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.omini.dto.AlertaDTO;
import com.omini.model.enums.StatusAlerta;
import com.omini.service.AlertaService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/alertas")
@RequiredArgsConstructor
public class AlertaController {

    private final AlertaService service;

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'SUPERVISOR', 'FUNCIONARIO')")
    @GetMapping
    public List<AlertaDTO> pendentes() {
        return service.buscarPendentes();
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'SUPERVISOR')")
    @PatchMapping("/{id}/status")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void alterarStatus(@PathVariable Long id,
                              @RequestParam StatusAlerta status) {
        service.alterarStatus(id, status);
    }
}
