import { CorCategoriaRepository } from "../repositories/cor-categoria-repository";

export interface Cor {
  cor: string;
  utilizada: boolean;
}

export class CorCategoriaService {
  private cores: Cor[];

  constructor(private corCategoriaRepository: CorCategoriaRepository) {
    const coresSalvas = this.corCategoriaRepository.carregarCores();
    this.cores =
      coresSalvas.length > 0 ? coresSalvas : this.getCoresPredefinidas();
  }

  private getCoresPredefinidas(): Cor[] {
    return [
      { cor: "red", utilizada: false },
      { cor: "orange", utilizada: false },
      { cor: "amber", utilizada: false },
      { cor: "yellow", utilizada: false },
      { cor: "lime", utilizada: false },
      { cor: "green", utilizada: false },
      { cor: "emerald", utilizada: false },
      { cor: "teal", utilizada: false },
      { cor: "cyan", utilizada: false },
      { cor: "sky", utilizada: false },
      { cor: "blue", utilizada: false },
      { cor: "indigo", utilizada: false },
      { cor: "violet", utilizada: false },
      { cor: "purple", utilizada: false },
      { cor: "fuchsia", utilizada: false },
      { cor: "pink", utilizada: false },
      { cor: "rose", utilizada: false },
    ];
  }

  obterCorDisponivel(): string | null {
    const coresDisponiveis = this.cores.filter(
      (cor) => cor.utilizada === false
    );

    if (coresDisponiveis.length === 0) {
      return null;
    }

    const indiceCor = Math.floor(Math.random() * coresDisponiveis.length);
    const corDisponivel = coresDisponiveis[indiceCor];

    return corDisponivel.cor;
  }

  atualizarStatusCor(cor: string, utilizada: boolean): void {
    const corItem = this.cores.find(
      (corPredefinida) => corPredefinida.cor === cor
    );
    if (corItem) {
      corItem.utilizada = utilizada;
      this.salvarCores();
    } else {
      console.error(`Cor ${cor} não encontrada!`);
    }
  }

  private salvarCores(): void {
    this.corCategoriaRepository.salvarCores(this.cores);
  }
}
