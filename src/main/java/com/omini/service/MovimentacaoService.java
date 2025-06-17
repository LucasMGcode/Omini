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
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MovimentacaoService {

    private final MovimentacaoEstoqueRepository movRepo;
    private final ProdutoRepository produtoRepo;
    private final UsuarioRepository usuarioRepo;
    private final MovimentacaoMapper mapper;

    private final AlertaService alertaService;

    @Transactional(readOnly = true)
    public List<MovimentacaoDTO> listarPorProduto(Long produtoId) {
        return movRepo.findByProdutoIdOrderByDataMovimentacaoDesc(produtoId)
                      .stream().map(mapper::toDto).toList();
    }

    @Transactional
    public MovimentacaoDTO registrar(Long produtoId, Long usuarioId, MovimentacaoForm form) {

        Produto produto = produtoRepo.findById(produtoId)
                   .orElseThrow(() -> new EntityNotFoundException("Produto id=" + produtoId + " não encontrado"));

        Usuario usuario = usuarioRepo.findById(usuarioId)
                   .orElseThrow(() -> new EntityNotFoundException("Usuário id=" + usuarioId + " não encontrado"));

        MovimentacaoEstoque mov = mapper.toEntity(form);
        mov.setProduto(produto);
        mov.setUsuario(usuario);

        /* Atualiza saldo */
        int q = mov.getQuantidade();
        TipoMovimentacao t = mov.getTipoMovimentacao();

        switch (t) {
            case ENTRADA, AJUSTE_POSITIVO -> produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() + q);
            case SAIDA_USO, SAIDA_DESCARTE, AJUSTE_NEGATIVO ->
                    produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - q);
        }

        produtoRepo.save(produto);
        MovimentacaoEstoque savedMov = movRepo.save(mov);

        if (produto.getQuantidadeEstoque() <= produto.getEstoqueMinimo()) {
            alertaService.criarSeNaoExistir(
                produto,
                TipoAlerta.ESTOQUE_MINIMO,
                "Estoque abaixo do mínimo (" + produto.getQuantidadeEstoque() + ")"
            );
        }

        return mapper.toDto(savedMov);
    }
}
