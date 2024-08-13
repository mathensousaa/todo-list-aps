import { Tarefa } from "../models";
import { NotificacaoService } from "./notificacao-service";

export class AgendamentoAdapter implements NotificacaoService {
  agendarNotificacao(tarefa: Tarefa): void {};
  cancelarNotificacao(tarefa: Tarefa): void {};
}
