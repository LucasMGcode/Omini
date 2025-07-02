package com.omini.service;

import com.omini.dto.TipoProdutoDTO;
import com.omini.dto.TipoProdutoForm;
import com.omini.mapper.TipoProdutoMapper;
import com.omini.repository.TipoProdutoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TipoProdutoService {

    private final TipoProdutoRepository repo;
    private final TipoProdutoMapper mapper;

    @Transactional(Transactional.TxType.SUPPORTS)
    public List<TipoProdutoDTO> listar() {
        return repo.findAll().stream().map(mapper::toDto).toList();
    }

    @PreAuthorize("hasAnyRole('SUPERVISOR', 'ADMINISTRADOR')")
    @Transactional
    public TipoProdutoDTO criar(TipoProdutoForm form) {
        if (repo.existsByNome(form.nome()))
            throw new IllegalArgumentException("Tipo já existe");
        return mapper.toDto(repo.save(mapper.toEntity(form)));
    }
}
