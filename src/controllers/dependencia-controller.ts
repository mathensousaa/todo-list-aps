import { TarefaController } from "./tarefa-controller";

export class DependenciaController {
    constructor(
        private dependenciaService: DependenciaService,
        private tarefaController: TarefaController
    ) {}

    excluirTarefaComDependencias(id: number): void;
}
