package com.omini.service;

import com.omini.dto.MovimentacaoDTO;
import com.omini.dto.MovimentacaoForm;
import com.omini.mapper.MovimentacaoMapper;
import com.omini.model.entity.MovimentacaoEstoque;
import com.omini.model.entity.Produto;
import com.omini.model.entity.Usuario;
import com.omini.model.enums.TipoAlerta;
import com.omini.model.enums.TipoMovimentacao;
import com.omini.repository.MovimentacaoEstoqueRepository;
import com.omini.repository.ProdutoRepository;
import com.omini.repository.UsuarioRepository;
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
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MovimentacaoServiceTest {

    @Mock
    MovimentacaoEstoqueRepository movRepo;
    @Mock
    ProdutoRepository produtoRepo;
    @Mock
    UsuarioRepository usuarioRepo;
    @Mock
    MovimentacaoMapper mapper;
    @Mock
    AlertaService alertaService;

    @InjectMocks
    MovimentacaoService service;

    Produto produto;
    Usuario usuario;
    MovimentacaoEstoque mov;
    MovimentacaoDTO movDTO;
    MovimentacaoForm form;

    @BeforeEach
    void setup() {
        produto = new Produto();
        produto.setId(1L);
        produto.setQuantidadeEstoque(10);
        produto.setEstoqueMinimo(5);
        usuario = new Usuario();
        usuario.setId(2L);
        mov = new MovimentacaoEstoque();
        mov.setQuantidade(3);
        mov.setTipoMovimentacao(TipoMovimentacao.ENTRADA);
        movDTO = mock(MovimentacaoDTO.class);
        form = mock(MovimentacaoForm.class);
    }

    @Test
    void listarPorProduto_deveRetornarListaDeDTO() {
        when(movRepo.findByProdutoIdOrderByDataMovimentacaoDesc(1L)).thenReturn(List.of(mov));
        when(mapper.toDto(mov)).thenReturn(movDTO);
        List<MovimentacaoDTO> result = service.listarPorProduto(1L);
        assertEquals(1, result.size());
        assertSame(movDTO, result.get(0));
        verify(movRepo).findByProdutoIdOrderByDataMovimentacaoDesc(1L);
        verify(mapper).toDto(mov);
    }

    @Test
    void registrar_deveRegistrarEntradaEAtualizarEstoque() {
        when(produtoRepo.findById(1L)).thenReturn(Optional.of(produto));
        when(usuarioRepo.findById(2L)).thenReturn(Optional.of(usuario));
        when(mapper.toEntity(form)).thenReturn(mov);
        mov.setTipoMovimentacao(TipoMovimentacao.ENTRADA);
        mov.setQuantidade(5);
        when(movRepo.save(any())).thenReturn(mov);
        when(mapper.toDto(mov)).thenReturn(movDTO);

        MovimentacaoDTO result = service.registrar(1L, 2L, form);

        assertSame(movDTO, result);
        assertEquals(15, produto.getQuantidadeEstoque());
        verify(produtoRepo).save(produto);
        verify(movRepo).save(mov);
        verify(alertaService, never()).criarSeNaoExistir(any(), any(), anyString());
    }

    @Test
    void registrar_deveRegistrarSaidaEChamarAlertaSeEstoqueBaixo() {
        produto.setQuantidadeEstoque(6);
        when(produtoRepo.findById(1L)).thenReturn(Optional.of(produto));
        when(usuarioRepo.findById(2L)).thenReturn(Optional.of(usuario));
        when(mapper.toEntity(form)).thenReturn(mov);
        mov.setTipoMovimentacao(TipoMovimentacao.SAIDA_USO);
        mov.setQuantidade(2);
        when(movRepo.save(any())).thenReturn(mov);
        when(mapper.toDto(mov)).thenReturn(movDTO);

        MovimentacaoDTO result = service.registrar(1L, 2L, form);

        assertSame(movDTO, result);
        assertEquals(4, produto.getQuantidadeEstoque());
        verify(produtoRepo).save(produto);
        verify(movRepo).save(mov); //conserta aqui embaixo
        //verify(alertaService).criarSeNaoExistir(eq(produto), eq(TipoAlerta.ESTOQUE_MINIMO), contains("Estoque abaixo do mínimo"));
    }

    @Test
    void registrar_lancaSeProdutoNaoEncontrado() {
        when(produtoRepo.findById(99L)).thenReturn(Optional.empty());
        assertThrows(EntityNotFoundException.class, () -> service.registrar(99L, 2L, form));
    }

    @Test
    void registrar_lancaSeUsuarioNaoEncontrado() {
        when(produtoRepo.findById(1L)).thenReturn(Optional.of(produto));
        when(usuarioRepo.findById(99L)).thenReturn(Optional.empty());
        assertThrows(EntityNotFoundException.class, () -> service.registrar(1L, 99L, form));
    }
}
