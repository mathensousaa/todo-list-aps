import { EstrategiaPersistencia } from "../persistence";
import { Cor } from "../services/cor-categoria-service";

export class CorCategoriaRepository {
  private readonly storageKey = "cores";

  constructor(private persistencia: EstrategiaPersistencia) {}

  carregarCores(): Cor[] {
    const coresSalvas = this.persistencia.carregar(this.storageKey);
    return coresSalvas ? JSON.parse(coresSalvas) : [];
  }

  salvarCores(cores: Cor[]): void {
    this.persistencia.salvar(this.storageKey, JSON.stringify(cores));
  }
}
