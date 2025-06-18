package com.omini.service;

import com.omini.dto.FornecedorDTO;
import com.omini.dto.FornecedorForm;
import com.omini.mapper.FornecedorMapper;
import com.omini.model.entity.Fornecedor;
import com.omini.repository.FornecedorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FornecedorServiceTest {

    @Mock
    FornecedorRepository repo;

    @Mock
    FornecedorMapper mapper;

    @InjectMocks
    FornecedorService service;

    FornecedorForm form;
    Fornecedor fornecedor;
    FornecedorDTO dto;

    @BeforeEach
    void setup() {
        // Inicializa objetos comuns para os testes.
        fornecedor = new Fornecedor();
        fornecedor.setId(1L);
        fornecedor.setRazaoSocial("Empresa Teste LTDA");
        fornecedor.setNomeFantasia("Empresa Teste");
        fornecedor.setCnpj("12345678901234");
        fornecedor.setContatoPrincipalNome("João Silva");
        fornecedor.setContatoPrincipalTelefone("11999999999");
        fornecedor.setContatoPrincipalEmail("joao@empresateste.com");
        fornecedor.setEndereco("Rua Teste, 123");
        fornecedor.setAtivo(true);

        form = mock(FornecedorForm.class);

        dto = new FornecedorDTO(
            1L,                        // id
            "Empresa Teste LTDA",      // razaoSocial
            "Empresa Teste",           // nomeFantasia
            "12345678901234",         // cnpj
            "João Silva",              // contatoPrincipalNome
            "11999999999",            // contatoPrincipalTelefone
            "joao@empresateste.com",  // contatoPrincipalEmail
            "true"                     // ativo
        );
    }

    @Test // Testa se todos retorna corretamente a lista de DTOs.
    void todos_retornaListaDto() {
        when(repo.findAll()).thenReturn(List.of(fornecedor));
        when(mapper.toDto(fornecedor)).thenReturn(dto);

        List<FornecedorDTO> result = service.todos();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertSame(dto, result.get(0));

        verify(repo).findAll();
        verify(mapper).toDto(fornecedor);
    }

    @Test // Testa exceção se fornecedor não encontrado na busca.
    void buscar_lancaSeNaoEncontrado() {
        when(repo.findById(1L)).thenReturn(Optional.empty());

        EntityNotFoundException ex = assertThrows(EntityNotFoundException.class, () -> {
            service.buscar(1L);
        });
        assertTrue(ex.getMessage().contains("Fornecedor id=1 não encontrado"));
    }

    @Test // Testa busca de fornecedor e conversão para DTO.
    void buscar_retornaDto() {
        when(repo.findById(1L)).thenReturn(Optional.of(fornecedor));
        when(mapper.toDto(fornecedor)).thenReturn(dto);

        FornecedorDTO result = service.buscar(1L);

        assertNotNull(result);
        assertSame(dto, result);

        verify(repo).findById(1L);
        verify(mapper).toDto(fornecedor);
    }

    @Test // Testa exceção se CNPJ já cadastrado ao criar fornecedor.
    void criar_lancaSeCnpjExistente() {
        when(form.cnpj()).thenReturn("12345678901234");
        when(repo.existsByCnpj("12345678901234")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            service.criar(form);
        });
        assertEquals("CNPJ já cadastrado", ex.getMessage());

        verify(repo, never()).save(any());
    }

    @Test // Testa criação de fornecedor.
    void criar_sucesso() {
        when(form.cnpj()).thenReturn("12345678901234");
        when(repo.existsByCnpj("12345678901234")).thenReturn(false);
        
        Fornecedor fornecedorParaSalvar = new Fornecedor();
        when(mapper.toEntity(form)).thenReturn(fornecedorParaSalvar);
        when(repo.save(fornecedorParaSalvar)).thenReturn(fornecedor);
        when(mapper.toDto(fornecedor)).thenReturn(dto);

        FornecedorDTO result = service.criar(form);

        assertNotNull(result);
        assertSame(dto, result);

        verify(repo).existsByCnpj("12345678901234");
        verify(mapper).toEntity(form);
        verify(repo).save(fornecedorParaSalvar);
        verify(mapper).toDto(fornecedor);
    }

    @Test // Testa exceção se fornecedor não encontrado ao atualizar.
    void atualizar_lancaSeNaoEncontrado() {
        when(repo.findById(1L)).thenReturn(Optional.empty());

        EntityNotFoundException ex = assertThrows(EntityNotFoundException.class, () -> {
            service.atualizar(1L, form);
        });
        assertTrue(ex.getMessage().contains("Fornecedor id=1 não encontrado"));

        verify(repo, never()).save(any());
    }

    @Test // Testa atualização de fornecedor.
    void atualizar_sucesso() {
        when(repo.findById(1L)).thenReturn(Optional.of(fornecedor));
        when(repo.save(fornecedor)).thenReturn(fornecedor);
        when(mapper.toDto(fornecedor)).thenReturn(dto);

        FornecedorDTO result = service.atualizar(1L, form);

        assertNotNull(result);
        assertSame(dto, result);

        verify(repo).findById(1L);
        verify(mapper).updateEntity(fornecedor, form);
        verify(repo).save(fornecedor);
        verify(mapper).toDto(fornecedor);
    }

    @Test // Testa exceção se fornecedor não encontrado ao definir ativo.
    void definirAtivo_lancaSeNaoEncontrado() {
        when(repo.findById(1L)).thenReturn(Optional.empty());

        EntityNotFoundException ex = assertThrows(EntityNotFoundException.class, () -> {
            service.definirAtivo(1L, true);
        });
        assertTrue(ex.getMessage().contains("Fornecedor id=1 não encontrado"));
    }

    @Test // Testa alteração do status ativo do fornecedor.
    void definirAtivo_alteraStatus() {
        when(repo.findById(1L)).thenReturn(Optional.of(fornecedor));

        service.definirAtivo(1L, false);

        assertFalse(fornecedor.getAtivo());
        verify(repo).findById(1L);
    }
}
