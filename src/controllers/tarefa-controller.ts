import { FiltroCriterios, RepeticaoConfig, Tarefa } from "../models";
import { TarefaRepository } from "../repositories";
import { NotificacaoService } from "../services";
import { RepeticaoService } from "../services";

export class TarefaController {
  constructor(
    private tarefaRepository: TarefaRepository,
    private notificacaoService: NotificacaoService,
    private repeticaoService: RepeticaoService
  ) {}

  criarTarefa(
    titulo: string,
    descricao: string | null,
    dataVencimento: string | null,
    status: string,
    categoria: number | null,
    notificacao: boolean = true
  ): { resultado: string; titulo: string; mensagem?: string } {
    try {
      if (!titulo) {
        throw new Error("Título da tarefa não informado!");
      }

      const idTarefa = this.obterProximoId();
      const novaTarefa = new Tarefa(
        idTarefa,
        titulo,
        descricao,
        dataVencimento,
        status,
        categoria,
        [],
        [],
        notificacao
      );

      this.tarefaRepository.salvarTarefa(novaTarefa);
      this.gerenciarNotificacao(novaTarefa);

      return {
        resultado: "sucesso",
        titulo: "Tarefa criada com sucesso!",
      };
    } catch (error) {
      return {
        resultado: "erro",
        titulo: "Não foi possível criar a tarefa!",
        mensagem: (error as Error).message,
      };
    }
  }

  editarTarefa(
    id: number,
    titulo: string,
    descricao: string,
    categoria: number | null,
    dataVencimento: string
  ): { resultado: string; titulo: string; mensagem?: string } {
    try {
      const tarefa = this.tarefaRepository.carregarTarefaPorId(id);
      if (!tarefa) {
        throw new Error(`Tarefa ${id} não encontrada.`);
      }

      tarefa.titulo = titulo;
      tarefa.descricao = descricao;
      tarefa.categoria = categoria;
      tarefa.dataVencimento = dataVencimento;

      this.tarefaRepository.atualizarTarefa(tarefa);
      this.gerenciarNotificacao(tarefa);

      return {
        resultado: "sucesso",
        titulo: "Tarefa editada com sucesso!",
      };
    } catch (error) {
      return {
        resultado: "erro",
        titulo: "Não foi possível editar a tarefa!",
        mensagem: (error as Error).message,
      };
    }
  }

  excluirTarefa(id: number): {
    resultado: string;
    titulo: string;
    mensagem?: string;
  } {
    try {
      const tarefa = this.tarefaRepository.carregarTarefaPorId(id);
      if (!tarefa) {
        throw new Error(`Tarefa ${id} não encontrada!`);
      }

      this.tarefaRepository.removerTarefa(id);
      this.notificacaoService.cancelarNotificacao(tarefa);

      return {
        resultado: "sucesso",
        titulo: "Tarefa excluída com sucesso!",
      };
    } catch (error) {
      return {
        resultado: "erro",
        titulo: "Não foi possível excluir a tarefa!",
        mensagem: (error as Error).message,
      };
    }
  }

  marcarTarefaConcluida(id: number, comentario: string): void {
    const tarefa = this.tarefaRepository.carregarTarefaPorId(id);

    if (tarefa) {
      tarefa.status = "Concluída";
      tarefa.comentarios.push(comentario);
      this.tarefaRepository.atualizarTarefa(tarefa);
      this.notificacaoService.cancelarNotificacao(tarefa);
    }
  }

  configurarRepeticao(id: number, configuracao: RepeticaoConfig): void {
    const tarefa = this.tarefaRepository.carregarTarefaPorId(id);

    if (tarefa) {
      this.repeticaoService.configurarRepeticao(tarefa, configuracao);
      this.tarefaRepository.atualizarTarefa(tarefa);
    }
  }

  filtrarTarefas(criterios: FiltroCriterios): Tarefa[] {
    const todasTarefas = this.tarefaRepository.carregarTarefas();
    // Implementar lógica de filtragem usando FiltroOrdenacaoService
    return todasTarefas;
  }

  atualizarStatusTarefa(
    tarefa: Tarefa,
    novoStatus: string,
    idTarefaAnterior: number
  ): void {
    const tarefaAnterior =
      this.tarefaRepository.carregarTarefaPorId(idTarefaAnterior);
    if (tarefaAnterior) {
      // Reordenar as tarefas se necessário
    }

    tarefa.status = novoStatus;
    this.tarefaRepository.atualizarTarefa(tarefa);
  }

  public trocarStatusTarefa(idTarefa: number): void {
    const tarefa = this.tarefaRepository.carregarTarefaPorId(idTarefa);

    if (tarefa) {
      if (tarefa.status === "A fazer" || tarefa.status === "Em andamento") {
        tarefa.status = "Concluída";
      } else {
        tarefa.status = "A fazer";
      }

      this.tarefaRepository.atualizarTarefa(tarefa);
    }
  }

  obterTarefaPorId(id: number): Tarefa | undefined {
    return this.tarefaRepository.carregarTarefaPorId(id);
  }

  obterTarefas(): Tarefa[] | [] {
    return this.tarefaRepository.carregarTarefas();
  }

  private obterProximoId(): number {
    const todasTarefas = this.tarefaRepository.carregarTarefas();
    const ultimoId =
      todasTarefas.length > 0 ? todasTarefas[todasTarefas.length - 1].id : 0;
    return ultimoId + 1;
  }

  private gerenciarNotificacao(tarefa: Tarefa): void {
    if (!tarefa.notificacao) {
      this.notificacaoService.cancelarNotificacao(tarefa);
    }

    if (tarefa.notificacao) {
      this.notificacaoService.agendarNotificacao(tarefa);
    }
  }
}
