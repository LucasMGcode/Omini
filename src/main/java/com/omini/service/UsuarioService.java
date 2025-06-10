package com.omini.service;

import com.omini.dto.UsuarioDTO;
import com.omini.dto.UsuarioForm;
import com.omini.mapper.UsuarioMapper;
import com.omini.model.entity.PerfilUsuario;
import com.omini.model.entity.Usuario;
import com.omini.repository.PerfilUsuarioRepository;
import com.omini.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repo;
    private final PerfilUsuarioRepository perfilRepo;
    private final UsuarioMapper mapper;
    private final PasswordEncoder encoder;

    @Transactional(readOnly = true)
    public List<UsuarioDTO> listar() {
        return repo.findAll().stream().map(mapper::toDto).toList();
    }

    @Transactional
    public UsuarioDTO registrar(UsuarioForm f) {
        if (repo.existsByLogin(f.login())) throw new IllegalArgumentException("Login já em uso");
        if (repo.existsByEmail(f.email())) throw new IllegalArgumentException("Email já em uso");

        PerfilUsuario perfil = perfilRepo.findById(f.perfilId())
             .orElseThrow(() -> new EntityNotFoundException("Perfil id=" + f.perfilId() + " não encontrado"));

        Usuario u = mapper.toEntity(f, perfil);
        u.setSenha(encoder.encode(f.senhaPlain()));
        u.setAtivo(f.ativo() != null ? f.ativo() : true);

        return mapper.toDto(repo.save(u));
    }

    @Transactional
    public UsuarioDTO trocarPerfil(Long usuarioId, Long novoPerfilId) {
        Usuario u = repo.findById(usuarioId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário id=" + usuarioId + " não encontrado"));
        PerfilUsuario perfil = perfilRepo.findById(novoPerfilId)
                .orElseThrow(() -> new EntityNotFoundException("Perfil id=" + novoPerfilId + " não encontrado"));

        u.setPerfil(perfil);
        return mapper.toDto(u);
    }

    @Transactional
    public void remover(Long id) {
        if (!repo.existsById(id)) {
            throw new EntityNotFoundException("Usuário id=" + id + " não encontrado");
        }
        repo.deleteById(id);
    }
}
