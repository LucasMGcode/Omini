package com.omini.service;

import com.omini.model.entity.Alerta;
import com.omini.model.entity.Fornecedor;
import com.omini.model.entity.MovimentacaoEstoque;
import com.omini.model.entity.PerfilUsuario;
import com.omini.model.entity.Produto;
import com.omini.model.entity.TipoProduto;
import com.omini.model.entity.Usuario;
import com.omini.repository.AlertaRepository;
import com.omini.repository.FornecedorRepository;
import com.omini.repository.MovimentacaoEstoqueRepository;
import com.omini.repository.PerfilUsuarioRepository;
import com.omini.repository.ProdutoRepository;
import com.omini.repository.TipoProdutoRepository;
import com.omini.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BancoTesteSeederServiceTest {

    @Mock
    PerfilUsuarioRepository perfilRepo;

    @Mock
    UsuarioRepository usuarioRepo;

    @Mock
    TipoProdutoRepository tipoRepo;

    @Mock
    FornecedorRepository fornecedorRepo;

    @Mock
    ProdutoRepository produtoRepo;

    @Mock
    MovimentacaoEstoqueRepository movimentacaoRepo;

    @Mock
    AlertaRepository alertaRepo;

    @Mock
    PasswordEncoder passwordEncoder;

    @InjectMocks
    BancoTesteSeederService service;

    @Test
    void popularBancoSeNecessario_criaCargaMinimaQuandoDadosNaoExistem() {
        AtomicLong produtoId = new AtomicLong(1L);

        when(perfilRepo.findByNome("Administrador")).thenReturn(Optional.empty());
        when(perfilRepo.save(any(PerfilUsuario.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(usuarioRepo.findByLogin("admin.teste")).thenReturn(Optional.empty());
        when(usuarioRepo.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(passwordEncoder.encode("teste123")).thenReturn("senha-criptografada");
        when(tipoRepo.findByNome("REAG. TESTE")).thenReturn(Optional.empty());
        when(tipoRepo.save(any(TipoProduto.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(fornecedorRepo.findByCnpj("00.000.000/0000-00")).thenReturn(Optional.empty());
        when(fornecedorRepo.save(any(Fornecedor.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(produtoRepo.existsByCodigoInterno(anyString())).thenReturn(false);
        when(produtoRepo.save(any(Produto.class))).thenAnswer(invocation -> {
            Produto produto = invocation.getArgument(0);
            produto.setId(produtoId.getAndIncrement());
            return produto;
        });
        when(movimentacaoRepo.save(any(MovimentacaoEstoque.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(alertaRepo.existsByProdutoIdAndTipoAlertaAndStatusIn(any(), any(), any())).thenReturn(false);
        when(alertaRepo.save(any(Alerta.class))).thenAnswer(invocation -> invocation.getArgument(0));

        service.popularBancoSeNecessario();

        verify(perfilRepo).save(any(PerfilUsuario.class));
        verify(usuarioRepo).save(any(Usuario.class));
        verify(tipoRepo).save(any(TipoProduto.class));
        verify(fornecedorRepo).save(any(Fornecedor.class));
        verify(produtoRepo, times(3)).save(any(Produto.class));
        verify(movimentacaoRepo, times(2)).save(any(MovimentacaoEstoque.class));
        verify(alertaRepo, times(2)).save(any(Alerta.class));
    }

    @Test
    void popularBancoSeNecessario_naoDuplicaProdutosQuandoCodigosJaExistem() {
        when(perfilRepo.findByNome("Administrador")).thenReturn(Optional.of(new PerfilUsuario()));
        when(usuarioRepo.findByLogin("admin.teste")).thenReturn(Optional.of(new Usuario()));
        when(tipoRepo.findByNome("REAG. TESTE")).thenReturn(Optional.of(new TipoProduto()));
        when(fornecedorRepo.findByCnpj("00.000.000/0000-00")).thenReturn(Optional.of(new Fornecedor()));
        when(produtoRepo.existsByCodigoInterno(anyString())).thenReturn(true);

        service.popularBancoSeNecessario();

        verify(produtoRepo, never()).save(any(Produto.class));
        verify(movimentacaoRepo, never()).save(any(MovimentacaoEstoque.class));
        verify(alertaRepo, never()).save(any(Alerta.class));
    }
}
