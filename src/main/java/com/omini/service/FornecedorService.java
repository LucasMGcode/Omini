package com.omini.service;

import com.omini.dto.FornecedorDTO;
import com.omini.dto.FornecedorForm;
import com.omini.mapper.FornecedorMapper;
import com.omini.model.entity.Fornecedor;
import com.omini.repository.FornecedorRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FornecedorService {

    private final FornecedorRepository repo;
    private final FornecedorMapper mapper;

    @Transactional(readOnly = true)
    public List<FornecedorDTO> todos() {
        return repo.findAll().stream().map(mapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public FornecedorDTO buscar(Long id) {
        return mapper.toDto(repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Fornecedor id=" + id + " não encontrado")));
    }

    @Transactional
    public FornecedorDTO criar(FornecedorForm form) {
        if (form.cnpj() != null && repo.existsByCnpj(form.cnpj()))
            throw new IllegalArgumentException("CNPJ já cadastrado");
        return mapper.toDto(repo.save(mapper.toEntity(form)));
    }

    @Transactional
    public FornecedorDTO atualizar(Long id, FornecedorForm form) {
        Fornecedor entity = repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Fornecedor id=" + id + " não encontrado"));
        mapper.updateEntity(entity, form);
        return mapper.toDto(repo.save(entity));
    }

    @Transactional
    public void definirAtivo(Long id, boolean ativo) {
        Fornecedor f = repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Fornecedor id=" + id + " não encontrado"));
        f.setAtivo(ativo);
    }
}
