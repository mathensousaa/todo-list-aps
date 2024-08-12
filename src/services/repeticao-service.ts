import { RepeticaoConfig, Tarefa } from "../models";

export class RepeticaoService {
  configurarRepeticao(tarefa: Tarefa, configuracao: RepeticaoConfig): void;
  gerarNovasInstancias(tarefa: Tarefa): void;
}
