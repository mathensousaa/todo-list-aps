import { Tarefa } from "../models";

export class DependenciaService {
    verificarDependencias(idTarefa: number): Tarefa[];
    notificarAlteracoes(idTarefa: number): void;
}
