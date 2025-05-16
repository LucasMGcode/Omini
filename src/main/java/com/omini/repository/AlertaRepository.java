package com.omini.repository;

import com.omini.model.entity.Alerta;
import com.omini.model.enums.StatusAlerta;
import com.omini.model.enums.TipoAlerta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertaRepository extends JpaRepository<Alerta, Long> {

    List<Alerta> findByStatus(StatusAlerta status);

    List<Alerta> findByTipoAlertaAndStatus(TipoAlerta tipo, StatusAlerta status);

    boolean existsByProdutoIdAndTipoAlertaAndStatusIn(
            Long produtoId, TipoAlerta tipo, List<StatusAlerta> statusList);
}
