package com.omini.service;

import com.omini.model.Movimentacao;
import com.omini.model.Produto;
import com.omini.repository.MovimentacaoRepository;
import com.omini.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MovimentacaoService {

    private final MovimentacaoRepository movimentacaoRepo;
    private final ProdutoRepository produtoRepo;

    @Transactional
    public Movimentacao registrar(Long produtoId, Movimentacao mov) {
        Produto produto = produtoRepo.findById(produtoId)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado"));

        int totalDisponivel = produto.getQtdAberta() + produto.getQtdFechada();
        int qtd = mov.getQuantidade();

        if (mov.getTipo() == Movimentacao.TipoMovimento.SAIDA) {
            if (qtd > totalDisponivel) {
                throw new IllegalArgumentException("Estoque insuficiente para retirada.");
            }
            if (produto.getQtdAberta() >= qtd) {
                produto.setQtdAberta(produto.getQtdAberta() - qtd);
            } else {
                int restante = qtd - produto.getQtdAberta();
                produto.setQtdAberta(0);
                produto.setQtdFechada(produto.getQtdFechada() - restante);
            }
        } else if (mov.getTipo() == Movimentacao.TipoMovimento.ENTRADA) {
            produto.setQtdFechada(produto.getQtdFechada() + qtd);
        }

        mov.setProduto(produto);
        produtoRepo.save(produto);
        return movimentacaoRepo.save(mov);
    }

    public List<Movimentacao> listarPorProduto(Long produtoId) {
        return movimentacaoRepo.findByProdutoIdOrderByDataHoraDesc(produtoId);
    }

}
