import { TarefaController } from "../controllers";
import { ViewStrategy } from "./view-strategy";

export class QuadroTarefasView implements ViewStrategy {
  public colunaTarefasAFazer!: HTMLDivElement;
  public colunaTarefasEmAndamento!: HTMLDivElement;
  public colunaTarefasConcluidas!: HTMLDivElement;

  private colunas: NodeListOf<HTMLDivElement> | null = null;

  constructor(private tarefaController: TarefaController) {
    this.inicializarElementos();
    this.colunas = document.querySelectorAll(".coluna");
    this.adicionarEventos();
  }

  public inicializarElementos() {
    this.colunaTarefasAFazer = document.getElementById(
      "tarefas-a-fazer"
    ) as HTMLDivElement;
    this.colunaTarefasEmAndamento = document.getElementById(
      "tarefas-em-andamento"
    ) as HTMLDivElement;
    this.colunaTarefasConcluidas = document.getElementById(
      "tarefas-concluidas"
    ) as HTMLDivElement;
  }

  public adicionarEventos() {
    document.addEventListener("dragstart", (evento: DragEvent) => {
      if (evento.target instanceof HTMLElement) {
        evento.target.classList.add("arrastando");
      }
    });

    document.addEventListener("dragend", (evento: DragEvent) => {
      if (evento.target instanceof HTMLElement) {
        this.moverTarefa(evento.target);
      }
    });

    this.colunas?.forEach((item) => {
      item.addEventListener("dragover", (evento: DragEvent) => {
        evento.preventDefault();
        const arrastando = document.querySelector(".arrastando") as HTMLElement;
        const aplicarDepois = this.pegarNovaPosicao(item, evento.clientY);

        if (aplicarDepois) {
          aplicarDepois.insertAdjacentElement("afterend", arrastando);
        } else {
          item.prepend(arrastando);
        }
      });
    });
  }

  private pegarNovaPosicao(
    coluna: HTMLDivElement,
    posicaoY: number
  ): HTMLElement | null {
    const tarefas = coluna.querySelectorAll(".card-tarefa:not(.arrastando)");
    let resultado: HTMLElement | null = null;

    tarefas.forEach((tarefa) => {
      const caixa = tarefa.getBoundingClientRect();
      const centroCaixaY = caixa.y + caixa.height / 2;

      if (posicaoY >= centroCaixaY) {
        resultado = tarefa as HTMLElement;
      }
    });

    return resultado;
  }

  private moverTarefa(tarefaElement: HTMLElement): void {
    tarefaElement.classList.remove("arrastando");

    const novoStatus =
      tarefaElement.parentElement?.id === "tarefas-a-fazer"
        ? "A Fazer"
        : tarefaElement.parentElement?.id === "tarefas-em-andamento"
        ? "Em Andamento"
        : tarefaElement.parentElement?.id === "tarefas-concluidas"
        ? "Concluída"
        : "Desconhecido";

    const idTarefa = Number(tarefaElement.id.split("-")[1]);
    const idTarefaAnterior = Number(
      tarefaElement.previousElementSibling?.id.split("-")[1]
    );

    const tarefa = this.tarefaController.obterTarefaPorId(idTarefa);
    if (tarefa) {
      this.tarefaController.atualizarStatusTarefa(
        tarefa,
        novoStatus,
        idTarefaAnterior
      );
    }
  }
}
