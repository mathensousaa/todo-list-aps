import { Tarefa } from "../models";
import { EstrategiaPersistencia } from "../persistence";

export class TarefaRepository {
  constructor(private persistencia: EstrategiaPersistencia) {}

  salvarTarefa(tarefa: Tarefa): void {
    const tarefas = this.carregarTarefas();
    tarefas.push(tarefa);
    this.persistencia.salvar('tarefas', tarefas);
  }

  carregarTarefas(): Tarefa[] {
    const tarefas = this.persistencia.carregar('tarefas');
    return tarefas ? tarefas : [];
  }

  carregarTarefaPorId(id: number): Tarefa | undefined {
    const tarefas = this.carregarTarefas();
    return tarefas.find(tarefa => tarefa.id === id);
  }

  removerTarefa(id: number): void {
    let tarefas = this.carregarTarefas();
    tarefas = tarefas.filter(tarefa => tarefa.id !== id);
    this.persistencia.salvar('tarefas', tarefas);
  }

  atualizarTarefa(tarefa: Tarefa): void {
    const tarefas = this.carregarTarefas();
    const indice = tarefas.findIndex(t => t.id === tarefa.id);
    if (indice !== -1) {
      tarefas[indice] = tarefa;
      this.persistencia.salvar('tarefas', tarefas);
    }
  }
}

