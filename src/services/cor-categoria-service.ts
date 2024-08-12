import { EstrategiaPersistencia } from "../persistence";

interface Cor {
    cor: string;
    utilizada: boolean;
}

export class CorService {
    private coresPredefinidas: Cor[];

    constructor(private persistenciaService: EstrategiaPersistencia) { // Dependência do serviço de persistência
        const coresSalvas = this.persistenciaService.carregar('cores');
        this.coresPredefinidas = coresSalvas ? coresSalvas : this.getCoresPredefinidas();
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
            { cor: "rose", utilizada: false }
        ];
    }

    obterCorDisponivel(): string | null {
        const corDisponivel = this.coresPredefinidas.find(cor => !cor.utilizada);
        return corDisponivel ? corDisponivel.cor : null;
    }

    atualizarStatusCor(cor: string, utilizada: boolean): void {
        const corItem = this.coresPredefinidas.find(corPredefinida => corPredefinida.cor === cor);
        if (corItem) {
            corItem.utilizada = utilizada;
            this.atualizarCores();
        } else {
            console.error(`Cor ${cor} não encontrada!`);
        }
    }

    private atualizarCores(): void {
        this.persistenciaService.salvar('cores', this.coresPredefinidas);
    }
}
