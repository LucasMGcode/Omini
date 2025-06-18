package com.omini.service;

import com.omini.dto.PerfilUsuarioDTO;
import com.omini.dto.UsuarioDTO;
import com.omini.dto.UsuarioForm;
import com.omini.mapper.UsuarioMapper;
import com.omini.model.entity.PerfilUsuario;
import com.omini.model.entity.Usuario;
import com.omini.repository.PerfilUsuarioRepository;
import com.omini.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    UsuarioRepository repo;

    @Mock
    PerfilUsuarioRepository perfilRepo;

    @Mock
    UsuarioMapper mapper;

    @Mock
    PasswordEncoder encoder;

    @InjectMocks
    UsuarioService service;

    UsuarioForm form;
    Usuario usuario;
    PerfilUsuario perfil;
    UsuarioDTO dto;

    @BeforeEach
    void setup() {
        // Inicializa objetos comuns para os testes.
        perfil = new PerfilUsuario();
        perfil.setId(1L);

        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setPerfil(perfil);

        form = mock(UsuarioForm.class);

        PerfilUsuarioDTO perfilDTO = new PerfilUsuarioDTO(
            1L,          // id do perfil
            "ADMIN",      // nome
            "Administrador do sistema" // descrição
        );

        dto = new UsuarioDTO(
            1L,                          // id usuário
            "Nome Teste",                // nome
            "loginTeste",                // login
            "email@teste.com",           // email
            perfilDTO,                   // perfil DTO
            true,                       // ativo
            LocalDateTime.now()          // criadoEm
        );
    }

    @Test // Testa se listar retorna corretamente a lista de DTOs.
    void listar_retornaListaDto() {
        when(repo.findAll()).thenReturn(List.of(usuario));
        when(mapper.toDto(usuario)).thenReturn(dto);

        List<UsuarioDTO> result = service.listar();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertSame(dto, result.get(0));

        verify(repo).findAll();
        verify(mapper).toDto(usuario);
    }

    @Test // Testa exceção se login já existir.
    void registrar_lancaSeLoginExistente() {
        when(form.login()).thenReturn("login");
        when(repo.existsByLogin("login")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            service.registrar(form);
        });
        assertEquals("Login já em uso", ex.getMessage());

        verify(repo, never()).save(any());
    }

    @Test // Testa exceção se email já existir.
    void registrar_lancaSeEmailExistente() {
        when(form.login()).thenReturn("login");
        when(form.email()).thenReturn("email@exemplo.com");
        when(repo.existsByLogin("login")).thenReturn(false);
        when(repo.existsByEmail("email@exemplo.com")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            service.registrar(form);
        });
        assertEquals("Email já em uso", ex.getMessage());

        verify(repo, never()).save(any());
    }

    @Test // Testa exceção se perfil não encontrado.
    void registrar_lancaSePerfilNaoEncontrado() {
        when(form.login()).thenReturn("login");
        when(form.email()).thenReturn("email@exemplo.com");
        when(form.perfilId()).thenReturn(1L);
        when(repo.existsByLogin("login")).thenReturn(false);
        when(repo.existsByEmail("email@exemplo.com")).thenReturn(false);
        when(perfilRepo.findById(1L)).thenReturn(Optional.empty());

        EntityNotFoundException ex = assertThrows(EntityNotFoundException.class, () -> {
            service.registrar(form);
        });
        assertTrue(ex.getMessage().contains("Perfil id=1 não encontrado"));

        verify(repo, never()).save(any());
    }

    @Test // Testa registro de usuário, incluindo criptografia de senha.
    void registrar_sucesso() {
        when(form.login()).thenReturn("login");
        when(form.email()).thenReturn("email@exemplo.com");
        when(form.perfilId()).thenReturn(1L);
        when(form.senhaPlain()).thenReturn("senha123");
        when(form.ativo()).thenReturn(null);
        when(repo.existsByLogin("login")).thenReturn(false);
        when(repo.existsByEmail("email@exemplo.com")).thenReturn(false);
        when(perfilRepo.findById(1L)).thenReturn(Optional.of(perfil));

        Usuario usuarioParaSalvar = new Usuario();
        when(mapper.toEntity(form, perfil)).thenReturn(usuarioParaSalvar);

        when(encoder.encode("senha123")).thenReturn("senhaCriptografada");

        Usuario usuarioSalvo = new Usuario();
        when(repo.save(usuarioParaSalvar)).thenReturn(usuarioSalvo);
        when(mapper.toDto(usuarioSalvo)).thenReturn(dto);

        UsuarioDTO result = service.registrar(form);

        assertSame(dto, result);
        assertTrue(usuarioParaSalvar.getAtivo());
        assertEquals("senhaCriptografada", usuarioParaSalvar.getSenha());

        verify(repo).existsByLogin("login");
        verify(repo).existsByEmail("email@exemplo.com");
        verify(perfilRepo).findById(1L);
        verify(mapper).toEntity(form, perfil);
        verify(encoder).encode("senha123");
        verify(repo).save(usuarioParaSalvar);
        verify(mapper).toDto(usuarioSalvo);
    }

    @Test // Testa exceção se usuário não encontrado ao trocar perfil.
    void trocarPerfil_lancaSeUsuarioNaoEncontrado() {
        when(repo.findById(1L)).thenReturn(Optional.empty());

        EntityNotFoundException ex = assertThrows(EntityNotFoundException.class, () -> {
            service.trocarPerfil(1L, 1L);
        });
        assertTrue(ex.getMessage().contains("Usuário id=1 não encontrado"));

        verify(repo, never()).save(any());
    }

    @Test // Testa exceção se perfil não encontrado ao trocar perfil.
    void trocarPerfil_lancaSePerfilNaoEncontrado() {
        when(repo.findById(1L)).thenReturn(Optional.of(usuario));
        when(perfilRepo.findById(2L)).thenReturn(Optional.empty());

        EntityNotFoundException ex = assertThrows(EntityNotFoundException.class, () -> {
            service.trocarPerfil(1L, 2L);
        });
        assertTrue(ex.getMessage().contains("Perfil id=2 não encontrado"));

        verify(repo, never()).save(any());
    }

    @Test // Testa remoção de usuário.
    void remover_sucesso() {
        when(repo.existsById(1L)).thenReturn(true);

        service.remover(1L);

        verify(repo).deleteById(1L);
    }
}
