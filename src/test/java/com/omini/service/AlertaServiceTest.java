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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // Ativa o mockito na classe.
public class AlertaServiceTest {

    @Mock
    private ProdutoRepository produtoRepo;

    @Mock
    private AlertaRepository alertaRepo;

    @Mock
    private AlertaMapper mapper;

    @InjectMocks
    private AlertaService service;

    private Produto produto;

    @BeforeEach   // Método que roda antes de cada teste.
    void setUp() {
        produto = new Produto();
        produto.setId(1L);   //id = 1 (long int)
        produto.setDataValidade(LocalDate.now().plusDays(7));  // Data de validade 7 dias à frente da atual.
        produto.setQuantidadeEstoque(4);
    }

    @Test   //Verifica se o serviço de alerta gera corretamente para produtos vencidos e com estoque crítico.
    void testGerarAlertas_criarAlertasCorretamente() {

        //Quando produtoRepo chamar o método findVencendoAte, independente do parâmetro, 
        //retorna uma lista que terá o objeto produto criado antes.
        when(produtoRepo.findVencendoAte(any(), any())).thenReturn(List.of(produto));
        when(produtoRepo.findCriticos()).thenReturn(List.of(produto));

        //Retorna false, simulando que não tem alertas.
        when(alertaRepo.existsByProdutoIdAndTipoAlertaAndStatusIn(anyLong(), any(), any())).thenReturn(false); //Retorna false 
        
        service.gerarAlertas();  

        verify(alertaRepo, times(2)).save(any(Alerta.class));
        //Verifica se o alerta foi chamado 2 x.
    }

    @Test
    void testBuscarAlertasPendentes() {
       
        Alerta alerta1 = new Alerta();
        alerta1.setId(1L);

        Alerta alerta2 = new Alerta();
        alerta2.setId(2L);

        //Dto: Representação externa que a API retorne para o cliente.
        AlertaDTO dto1 = new AlertaDTO(
            1L, 2L, "Produto A", TipoAlerta.ESTOQUE_MINIMO, "Validade próxima",
            StatusAlerta.PENDENTE, LocalDateTime.now(), null, null
        );

        AlertaDTO dto2 = new AlertaDTO(
            2L, 3L, "Produto B", TipoAlerta.VALIDADE_PROXIMA, "Estoque baixo",
            StatusAlerta.PENDENTE, LocalDateTime.now(), null, null
        );

        when(alertaRepo.findByStatus(StatusAlerta.PENDENTE)).thenReturn(List.of(alerta1, alerta2));

        //Mapper que converte alerta para alertadto. Retorne esse dto criado quando o alerta for chamado.
        when(mapper.toDto(alerta1)).thenReturn(dto1);  
        when(mapper.toDto(alerta2)).thenReturn(dto2);

        List<AlertaDTO> result = service.buscarPendentes();

        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).id());
        assertEquals(2L, result.get(1).id());  //Garante que foi criado 2 e os seus id's corretamente.
    }

    @Test
    void testAlterarStatus_paraVisualizado() {
        Alerta alerta = new Alerta();
        alerta.setId(1L);

        when(alertaRepo.findById(1L)).thenReturn(Optional.of(alerta));

        service.alterarStatus(1L, StatusAlerta.VISUALIZADO);

        assertEquals(StatusAlerta.VISUALIZADO, alerta.getStatus());
        assertNotNull(alerta.getDataVisualizacao());
    }

    @Test
    void testAlterarStatus_paraResolvido() {
        Alerta alerta = new Alerta();
        alerta.setId(2L);

        when(alertaRepo.findById(2L)).thenReturn(Optional.of(alerta)); //Retorna alerta. Optional para evitar null.

        service.alterarStatus(2L, StatusAlerta.RESOLVIDO);

        assertEquals(StatusAlerta.RESOLVIDO, alerta.getStatus());
        assertNotNull(alerta.getDataResolucao()); // Garante que o campo dataResolucao foi preenchido.
    }

    @Test
    void testAlterarStatus_alertaNaoEncontrado() {
        when(alertaRepo.findById(98L)).thenReturn(Optional.empty());  //Simula que id 98 não existe.

        assertThrows(EntityNotFoundException.class,
                () -> service.alterarStatus(98L, StatusAlerta.PENDENTE));
        //Lança uma exceção desse tipo ao tentar alterar um status de id não encontrado.
    }

    @Test
    void testCriarSeNaoExistir_criaNovo() {

        //Não existe o alerta.
        when(alertaRepo.existsByProdutoIdAndTipoAlertaAndStatusIn(anyLong(), any(), any())).thenReturn(false);

        service.criarSeNaoExistir(produto, TipoAlerta.VALIDADE_PROXIMA, "Msg");

        verify(alertaRepo).save(any(Alerta.class)); //Teste que verifica se foi salvo o alerta.
    }

    @Test
    void testCriarSeNaoExistir_jaExiste() {

        //Já existe o alerta.
        when(alertaRepo.existsByProdutoIdAndTipoAlertaAndStatusIn(anyLong(), any(), any())).thenReturn(true);

        service.criarSeNaoExistir(produto, TipoAlerta.ESTOQUE_MINIMO, "Msg"); //Cria novo.

        verify(alertaRepo, never()).save(any()); //Espera que não chame save para não duplicar alerta.
    }
}

