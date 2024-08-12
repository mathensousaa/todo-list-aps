import { Tarefa } from "../models";

export class NotificacaoService {
  agendarNotificacao(tarefa: Tarefa): void;
  cancelarNotificacao(tarefa: Tarefa): void;
}
