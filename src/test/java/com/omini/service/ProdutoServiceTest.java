package com.omini.service;

import com.omini.dto.ProdutoDTO;
import com.omini.dto.ProdutoForm;
import com.omini.mapper.ProdutoMapper;
import com.omini.model.entity.Fornecedor;
import com.omini.model.entity.Produto;
import com.omini.model.entity.TipoProduto;
import com.omini.model.enums.TipoAlerta;
import com.omini.repository.FornecedorRepository;
import com.omini.repository.ProdutoRepository;
import com.omini.repository.TipoProdutoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProdutoServiceTest {

    @Mock
    ProdutoRepository produtoRepo;
    @Mock
    TipoProdutoRepository tipoRepo;
    @Mock
    FornecedorRepository fornecedorRepo;
    @Mock
    ProdutoMapper mapper;
    @Mock
    AlertaService alertaService;

    @InjectMocks
    ProdutoService service;

    Produto produto;
    ProdutoDTO produtoDTO;
    ProdutoForm form;
    TipoProduto tipoProduto;
    Fornecedor fornecedor;

    @BeforeEach
    void setup() {
        // Inicializa objetos comuns para os testes.
        tipoProduto = new TipoProduto();
        tipoProduto.setId(1L);

        fornecedor = new Fornecedor();
        fornecedor.setId(2L);

        produto = new Produto();
        produto.setId(10L);
        produto.setTipoProduto(tipoProduto);
        produto.setFornecedor(fornecedor);
        produto.setQuantidadeEstoque(5);
        produto.setEstoqueMinimo(10);

        produtoDTO = mock(ProdutoDTO.class);

        form = mock(ProdutoForm.class);
    }

    @Test // Testa se listar retorna corretamente uma página de DTOs.
    void listar_deveRetornarPageDeDTO() {
        Page<Produto> page = new PageImpl<>(List.of(produto));
        when(produtoRepo.findAll(any(Pageable.class))).thenReturn(page);
        when(mapper.toDto(produto)).thenReturn(produtoDTO);
        Page<ProdutoDTO> result = service.listar(Pageable.unpaged());

        assertEquals(1, result.getTotalElements());
        assertSame(produtoDTO, result.getContent().get(0));
        verify(produtoRepo).findAll(any(Pageable.class));
        verify(mapper).toDto(produto);
    }

    @Test // Testa busca de produto e conversão para DTO.
    void buscar_deveRetornarDTO() {
        when(produtoRepo.findById(10L)).thenReturn(Optional.of(produto));
        when(mapper.toDto(produto)).thenReturn(produtoDTO);

        ProdutoDTO result = service.buscar(10L);

        assertSame(produtoDTO, result);
        verify(produtoRepo).findById(10L);
        verify(mapper).toDto(produto);
    }

    @Test // Testa exceção se produto não encontrado na busca.
    void buscar_lancaSeNaoEncontrado() {
        when(produtoRepo.findById(99L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> service.buscar(99L));
    }

    @Test // Testa criação de produto e geração de alerta se estoque baixo.
    void criar_deveSalvarEChamarAlertaSeEstoqueBaixo() {
        when(form.tipoProdutoId()).thenReturn(1L);
        when(form.fornecedorId()).thenReturn(2L);
        when(tipoRepo.findById(1L)).thenReturn(Optional.of(tipoProduto));
        when(fornecedorRepo.findById(2L)).thenReturn(Optional.of(fornecedor));
        when(mapper.toEntity(form, tipoProduto, fornecedor)).thenReturn(produto);
        when(produtoRepo.save(produto)).thenReturn(produto);
        when(mapper.toDto(produto)).thenReturn(produtoDTO);

        ProdutoDTO result = service.criar(form);

        assertSame(produtoDTO, result);
        verify(alertaService).criarSeNaoExistir(
                eq(produto),
                eq(TipoAlerta.ESTOQUE_MINIMO),
                contains("Estoque abaixo do mínimo")
        ); // Alerta gerado corretamente.
        verify(produtoRepo).save(produto);
    }

    @Test // Testa exceção se tipo de produto não encontrado ao criar.
    void criar_lancaSeTipoProdutoNaoEncontrado() {
        when(form.tipoProdutoId()).thenReturn(1L);
        when(tipoRepo.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> service.criar(form));
    }

    @Test // Testa exceção se fornecedor não encontrado ao criar.
    void criar_lancaSeFornecedorNaoEncontrado() {
        when(form.tipoProdutoId()).thenReturn(1L);
        when(form.fornecedorId()).thenReturn(2L);
        when(tipoRepo.findById(1L)).thenReturn(Optional.of(tipoProduto));
        when(fornecedorRepo.findById(2L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> service.criar(form));
    }

    @Test // Testa atualização de produto e geração de alerta se estoque baixo.
    void atualizar_deveAtualizarEChamarAlertaSeEstoqueBaixo() {
        when(produtoRepo.findById(10L)).thenReturn(Optional.of(produto));
        when(form.tipoProdutoId()).thenReturn(1L);
        when(form.fornecedorId()).thenReturn(2L);
        when(tipoRepo.findById(1L)).thenReturn(Optional.of(tipoProduto));
        when(fornecedorRepo.findById(2L)).thenReturn(Optional.of(fornecedor));
        doNothing().when(mapper).updateEntity(eq(produto), eq(form), eq(tipoProduto), eq(fornecedor));
        when(produtoRepo.save(produto)).thenReturn(produto);
        when(mapper.toDto(produto)).thenReturn(produtoDTO);

        ProdutoDTO result = service.atualizar(10L, form);

        assertSame(produtoDTO, result);
        verify(alertaService).criarSeNaoExistir(
                eq(produto),
                eq(TipoAlerta.ESTOQUE_MINIMO),
                contains("Estoque abaixo do mínimo")
        ); // Alerta gerado corretamente.
        verify(produtoRepo).save(produto);
    }

    @Test // Testa exceção se produto não encontrado ao atualizar.
    void atualizar_lancaSeProdutoNaoEncontrado() {
        when(produtoRepo.findById(99L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> service.atualizar(99L, form));
    }

    @Test // Testa remoção de produto.
    void remover_sucesso() {
        when(produtoRepo.existsById(10L)).thenReturn(true);

        service.remover(10L);

        verify(produtoRepo).deleteById(10L);
    }

    @Test // Testa exceção se produto não encontrado ao remover.
    void remover_lancaSeNaoEncontrado() {
        when(produtoRepo.existsById(99L)).thenReturn(false);

        assertThrows(EntityNotFoundException.class, () -> service.remover(99L));
    }
}
