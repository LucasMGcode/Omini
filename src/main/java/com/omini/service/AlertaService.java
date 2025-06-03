package com.omini.service;

import com.omini.dto.AlertaDTO;
import com.omini.mapper.AlertaMapper;
import com.omini.model.entity.Alerta;
import com.omini.model.entity.Produto;
import com.omini.model.enums.StatusAlerta;
import com.omini.model.enums.TipoAlerta;
import com.omini.repository.AlertaRepository;
import com.omini.repository.ProdutoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertaService {

    private final ProdutoRepository produtoRepo;
    private final AlertaRepository alertaRepo;
    private final AlertaMapper mapper;

    // Geração automática de alertas (diariamente às 3h)
    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void gerarAlertas() {
        LocalDate hoje = LocalDate.now();
        LocalDate limite = hoje.plusDays(30);

        produtoRepo.findVencendoAte(hoje, limite).forEach(p ->
                criarSeNaoExistir(p, TipoAlerta.VALIDADE_PROXIMA,
                        "Produto vence em " + p.getDataValidade()));

        produtoRepo.findCriticos().forEach(p ->
                criarSeNaoExistir(p, TipoAlerta.ESTOQUE_MINIMO,
                        "Estoque abaixo do mínimo (" + p.getQuantidadeEstoque() + ")"));
    }

    @Transactional(readOnly = true)
    public List<AlertaDTO> buscarPendentes() {
        return alertaRepo.findByStatus(StatusAlerta.PENDENTE)
                         .stream().map(mapper::toDto).toList();
    }

    @Transactional
    public void alterarStatus(Long alertaId, StatusAlerta novo) {
        Alerta a = alertaRepo.findById(alertaId)
                .orElseThrow(() -> new EntityNotFoundException("Alerta id=" + alertaId + " não encontrado"));

        a.setStatus(novo);
        if (novo == StatusAlerta.VISUALIZADO) a.setDataVisualizacao(LocalDateTime.now());
        if (novo == StatusAlerta.RESOLVIDO)   a.setDataResolucao(LocalDateTime.now());
    }

    public void criarSeNaoExistir(Produto p, TipoAlerta tipo, String msg) {
        boolean existe = alertaRepo.existsByProdutoIdAndTipoAlertaAndStatusIn(
                p.getId(), tipo, List.of(StatusAlerta.PENDENTE, StatusAlerta.VISUALIZADO));

        if (!existe) {
            Alerta a = new Alerta();
            a.setProduto(p);
            a.setTipoAlerta(tipo);
            a.setMensagem(msg);
            alertaRepo.save(a);
        }
    }
}
