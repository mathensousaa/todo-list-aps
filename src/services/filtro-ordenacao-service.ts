import { FiltroCriterios, Tarefa } from "../models";

export class FiltroOrdenacaoService {
  filtrarTarefas(tarefas: Tarefa[], criterios: FiltroCriterios): Tarefa[];
  ordenarTarefas(tarefas: Tarefa[], parametro: string): Tarefa[];
}
