import { Tarefa } from "../models";

export class NotificacaoService {
  agendarNotificacao(tarefa: Tarefa): void {
    console.log("Notificação agendada para a tarefa: ", tarefa);
  }
  cancelarNotificacao(tarefa: Tarefa): void {
    console.log("Notificação cancelada para a tarefa: ", tarefa);
  }
}
