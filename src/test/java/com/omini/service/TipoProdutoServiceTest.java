package com.omini.service;

import com.omini.dto.TipoProdutoDTO;
import com.omini.dto.TipoProdutoForm;
import com.omini.mapper.TipoProdutoMapper;
import com.omini.model.entity.TipoProduto;
import com.omini.repository.TipoProdutoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TipoProdutoServiceTest {

    @Mock // Mock do repositório de tipos de produto.
    TipoProdutoRepository repo;
    @Mock // Mock do mapper de tipo de produto.
    TipoProdutoMapper mapper;

    @InjectMocks
    TipoProdutoService service;

    TipoProduto tipoProduto;
    TipoProdutoDTO tipoProdutoDTO;
    TipoProdutoForm form;

    @BeforeEach
    void setup() {
        // Inicializa objetos comuns para os testes.
        tipoProduto = new TipoProduto();
        tipoProduto.setId(1L);
        tipoProduto.setNome("Reagente");
        tipoProdutoDTO = mock(TipoProdutoDTO.class);
        form = mock(TipoProdutoForm.class);
    }

    @Test // Testa se listar retorna corretamente a lista de DTOs.
    void listar_deveRetornarListaDeDTO() {
        when(repo.findAll()).thenReturn(List.of(tipoProduto));
        when(mapper.toDto(tipoProduto)).thenReturn(tipoProdutoDTO);
        List<TipoProdutoDTO> result = service.listar();
        assertEquals(1, result.size());
        assertSame(tipoProdutoDTO, result.get(0));
        verify(repo).findAll();
        verify(mapper).toDto(tipoProduto);
    }

    @Test // Testa criação de tipo de produto e conversão para DTO.
    void criar_deveSalvarEConverterParaDTO() {
        when(form.nome()).thenReturn("Reagente");
        when(repo.existsByNome("Reagente")).thenReturn(false);
        when(mapper.toEntity(form)).thenReturn(tipoProduto);
        when(repo.save(tipoProduto)).thenReturn(tipoProduto);
        when(mapper.toDto(tipoProduto)).thenReturn(tipoProdutoDTO);
        TipoProdutoDTO result = service.criar(form);
        assertSame(tipoProdutoDTO, result);
        verify(repo).save(tipoProduto);
        verify(mapper).toDto(tipoProduto);
    }

    @Test // Testa exceção se nome já existe.
    void criar_lancaSeNomeJaExiste() {
        when(form.nome()).thenReturn("Reagente");
        when(repo.existsByNome("Reagente")).thenReturn(true);
        assertThrows(IllegalArgumentException.class, () -> service.criar(form));
    }
}
