import "tailwindcss/tailwind.css";

class Tarefa {
  public id: number;
  public descricao: string;
  public status: string;
  public data: string | null;
  public categoria: number | null;

  constructor(id: number, descricao: string, status: string) {
    this.id = id;
    this.descricao = descricao;
    this.status = status;
    this.data = null;
    this.categoria = 0;
  }
}

class GerenciadorTarefa {
  private tarefas: Tarefa[];

  constructor() {
    const tarefasSalvas = localStorage.getItem("tarefas");
    this.tarefas = tarefasSalvas ? JSON.parse(tarefasSalvas) : [];
  }

  public criarTarefa(descricao: string): {
    resultado: string;
    titulo: string;
    mensagem?: string;
  } {
    try {
      if (!descricao) {
        throw new Error("Descrição da tarefa não informada!");
      }

      const idTarefa = this.obterProximoId();
      const novaTarefa = new Tarefa(
        idTarefa,
        descricao,
        this.obterStatusDaTarefa()
      );

      this.tarefas.push(novaTarefa);
      this.atualizarTarefasNoLocalStorage();

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

  private obterProximoId(): number {
    const ultimoId =
      this.tarefas.length > 0 ? this.tarefas[this.tarefas.length - 1].id : 0;
    const proximoId = ultimoId + 1;
    return proximoId;
  }

  public editarTarefa(
    idTarefa: number,
    novaDescricao: string,
    novaCategoria: number,
    novaData: string
  ): { resultado: string; titulo: string; mensagem?: string } {
    try {
      const tarefa = this.encontrarTarefaPeloId(idTarefa);
      if (!tarefa) {
        throw new Error(`Tarefa ${idTarefa} não encontrada.`);
      }

      if (!novaDescricao) {
        throw new Error("Descrição da tarefa não informada.");
      }

      tarefa.descricao = novaDescricao;
      tarefa.categoria = novaCategoria;
      tarefa.data = novaData;

      const indiceParaAtualizar = this.tarefas.findIndex(
        (tarefa) => tarefa.id === idTarefa
      );
      this.tarefas[indiceParaAtualizar] = tarefa;
      this.atualizarTarefasNoLocalStorage();

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

  public excluirTarefa(idTarefa: number): {
    resultado: string;
    titulo: string;
    mensagem?: string;
  } {
    try {
      const indiceParaRemover = this.tarefas.findIndex(
        (tarefa) => tarefa.id === idTarefa
      );

      if (indiceParaRemover === -1) {
        throw new Error(`Tarefa ${idTarefa} não encontrada!`);
      }

      this.tarefas.splice(indiceParaRemover, 1);
      this.atualizarTarefasNoLocalStorage();

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

  public trocarStatusTarefa(idTarefa: number): void {
    const tarefa = this.encontrarTarefaPeloId(idTarefa);

    if (tarefa) {
      if (tarefa.status === "A fazer" || tarefa.status === "Em andamento") {
        tarefa.status = "Concluída";
      } else {
        tarefa.status = "A fazer";
      }

      this.atualizarTarefasNoLocalStorage();
    }
  }

  public obterTarefas(): Tarefa[] {
    return this.tarefas;
  }

  private encontrarTarefaPeloId(idTarefa: number): Tarefa | undefined {
    return this.tarefas.find((tarefa) => tarefa.id === idTarefa);
  }

  private atualizarTarefasNoLocalStorage(): void {
    localStorage.setItem("tarefas", JSON.stringify(this.tarefas));
  }

  private obterStatusDaTarefa(): string {
    const queryString = window.location.search;
    const parametrosURL = new URLSearchParams(queryString);

    const statusTarefa = parametrosURL.get("status");

    switch (statusTarefa) {
      case "1":
        return "Em andamento";
      case "2":
        return "Concluída";
      default:
        return "A fazer";
    }
  }

  public atualizarTarefaAoArrastar(
    idTarefa: number,
    idTarefaAnterior: number,
    novoStatus: string
  ): void {
    const indiceTarefa = this.tarefas.findIndex(
      (tarefa) => tarefa.id === idTarefa
    );
    const indiceTarefaAnterior = this.tarefas.findIndex(
      (tarefa) => tarefa.id === idTarefaAnterior
    );
    const tarefa = this.tarefas[indiceTarefa];

    if (indiceTarefa !== -1 && indiceTarefaAnterior !== -1) {
      const tarefaMovida = this.tarefas.splice(indiceTarefa, 1)[0];
      this.tarefas.splice(indiceTarefaAnterior, 0, tarefaMovida);
      tarefa.status = novoStatus;
    }

    this.atualizarTarefasNoLocalStorage();
  }
}

class QuadroTarefa {
  private gerenciadorTarefa: GerenciadorTarefa;
  private colunas: NodeListOf<HTMLDivElement> | null = null;

  constructor() {
    this.gerenciadorTarefa = new GerenciadorTarefa();
    this.colunas = document.querySelectorAll(".coluna");

    this.moverTarefa();
  }

  private pegarNovaPosicao(coluna: HTMLDivElement, posicaoY: number) {
    const tarefas = coluna.querySelectorAll(".card-tarefa:not(.arrastando)");
    let resultado;

    for (let tarefa of tarefas) {
      const caixa = tarefa.getBoundingClientRect();
      const centroCaixaY = caixa.y + caixa.height / 2;

      if (posicaoY >= centroCaixaY) {
        resultado = tarefa;
      }
    }

    return resultado;
  }

  public moverTarefa(): void {
    document.addEventListener("dragstart", (evento: DragEvent) => {
      if (evento.target instanceof HTMLElement) {
        evento.target.classList.add("arrastando");
      }
    });

    document.addEventListener("dragend", (evento: DragEvent) => {
      if (evento.target instanceof HTMLElement) {
        const tarefa = evento.target;
        evento.target.classList.remove("arrastando");

        const novoStatus =
          tarefa.parentElement?.id === "tarefas-a-fazer"
            ? "A Fazer"
            : tarefa.parentElement?.id === "tarefas-em-andamento"
            ? "Em Andamento"
            : tarefa.parentElement?.id === "tarefas-concluidas"
            ? "Concluída"
            : "Desconhecido";

        const idTarefa = Number(tarefa.id.split("-")[1]);
        const idTarefaAnterior = Number(
          tarefa.previousElementSibling?.id.split("-")[1]
        );

        this.gerenciadorTarefa.atualizarTarefaAoArrastar(
          idTarefa,
          idTarefaAnterior,
          novoStatus
        );
      }
    });

    this.colunas?.forEach((item) => {
      item.addEventListener("dragover", (evento: DragEvent) => {
        const arrastando = document.querySelector(".arrastando");
        const aplicarDepois = this.pegarNovaPosicao(item, evento.clientY);

        if (aplicarDepois) {
          aplicarDepois.insertAdjacentElement("afterend", arrastando!);
        } else {
          item.prepend(arrastando!);
        }
      });
    });
  }
}

class CategoriaTarefa {
  public id: number;
  public nome: string;
  public cor: string;

  constructor(id: number, nome: string, cor: string) {
    this.id = id;
    this.nome = nome;
    this.cor = cor;
  }
}

class GerenciadorCategoria {
  private categorias: CategoriaTarefa[];
  private coresPredefinidas: { cor: string; utilizada: boolean }[];

  constructor() {
    const categoriasSalvas = localStorage.getItem("categorias");
    const coresSalvas = localStorage.getItem("cores");

    this.categorias = categoriasSalvas ? JSON.parse(categoriasSalvas) : [];

    if (coresSalvas) {
      this.coresPredefinidas = JSON.parse(coresSalvas);
    } else {
      this.coresPredefinidas = [
        {
          cor: "red",
          utilizada: false,
        },
        {
          cor: "orange",
          utilizada: false,
        },
        {
          cor: "amber",
          utilizada: false,
        },
        {
          cor: "yellow",
          utilizada: false,
        },
        {
          cor: "lime",
          utilizada: false,
        },
        {
          cor: "green",
          utilizada: false,
        },
        {
          cor: "emerald",
          utilizada: false,
        },
        {
          cor: "teal",
          utilizada: false,
        },
        {
          cor: "cyan",
          utilizada: false,
        },
        {
          cor: "sky",
          utilizada: false,
        },
        {
          cor: "blue",
          utilizada: false,
        },
        {
          cor: "indigo",
          utilizada: false,
        },
        {
          cor: "violet",
          utilizada: false,
        },
        {
          cor: "purple",
          utilizada: false,
        },
        {
          cor: "fuchsia",
          utilizada: false,
        },
        {
          cor: "pink",
          utilizada: false,
        },
        {
          cor: "rose",
          utilizada: false,
        },
      ];
      this.atualizarCoresNoLocalStorage();
    }
  }

  public criarCategoria(nome: string): {
    resultado: string;
    titulo: string;
    mensagem?: string;
  } {
    try {
      if (!nome) {
        throw new Error("Nome da categoria não informado!");
      }

      const idCategoria = this.obterProximoId();
      const corDisponivel = this.obterCorDisponivel();

      if (!corDisponivel) {
        throw new Error("Você atingiu o limite de categorias.");
      }

      const novaCategoria = new CategoriaTarefa(
        idCategoria,
        nome,
        corDisponivel
      );

      this.categorias.push(novaCategoria);
      this.atualizarCategoriasNoLocalStorage();
      this.atualizarStatusCor(corDisponivel);

      return {
        resultado: "sucesso",
        titulo: "Categoria criada com sucesso!",
      };
    } catch (error) {
      return {
        resultado: "erro",
        titulo: "Não foi possível criar a categoria!",
        mensagem: (error as Error).message,
      };
    }
  }

  public obterCategorias(): CategoriaTarefa[] {
    return this.categorias;
  }

  public editarCategoria(
    idCategoria: number,
    novoNome: string
  ): { resultado: string; titulo: string; mensagem?: string } {
    try {
      const categoria = this.encontrarCategoriaPeloId(idCategoria);
      if (!categoria) {
        throw new Error(`Categoria ${idCategoria} não encontrada.`);
      }

      if (!novoNome) {
        throw new Error("Nome da categoria não informado.");
      }

      categoria.nome = novoNome;

      const indiceParaAtualizar = this.categorias.findIndex(
        (categoria) => categoria.id === idCategoria
      );
      this.categorias[indiceParaAtualizar] = categoria;
      this.atualizarCategoriasNoLocalStorage();

      return {
        resultado: "sucesso",
        titulo: "Categoria editada com sucesso!",
      };
    } catch (error) {
      return {
        resultado: "erro",
        titulo: "Não foi possível editar a categoria!",
        mensagem: (error as Error).message,
      };
    }
  }

  public excluirCategoria(idCategoria: number): {
    resultado: string;
    titulo: string;
    mensagem?: string;
  } {
    try {
      const indiceParaRemover = this.categorias.findIndex(
        (categoria) => categoria.id === idCategoria
      );
      const cor = this.categorias[indiceParaRemover].cor;

      if (indiceParaRemover === -1) {
        throw new Error(`Categoria ${idCategoria} não encontrada!`);
      }

      this.categorias.splice(indiceParaRemover, 1);
      this.atualizarCategoriasNoLocalStorage();

      this.atualizarStatusCor(cor);

      // remover categoria de tarefas com a categoria
      const tarefas = new GerenciadorTarefa().obterTarefas();
      const tarefasComCategoria = tarefas.filter(
        (tarefa) => tarefa.categoria === idCategoria
      );

      tarefasComCategoria.forEach((tarefa) => {
        tarefa.categoria = null;
      });

      localStorage.setItem("tarefas", JSON.stringify(tarefas));

      return {
        resultado: "sucesso",
        titulo: "Categoria excluída com sucesso!",
      };
    } catch (error) {
      return {
        resultado: "erro",
        titulo: "Não foi possível excluir a categoria!",
        mensagem: (error as Error).message,
      };
    }
  }

  private obterProximoId(): number {
    const ultimoId =
      this.categorias.length > 0
        ? this.categorias[this.categorias.length - 1].id
        : 0;
    const proximoId = ultimoId + 1;
    return proximoId;
  }

  private encontrarCategoriaPeloId(
    idCategoria: number
  ): CategoriaTarefa | undefined {
    return this.categorias.find((categoria) => categoria.id === idCategoria);
  }

  private atualizarCategoriasNoLocalStorage(): void {
    localStorage.setItem("categorias", JSON.stringify(this.categorias));
  }

  private atualizarCoresNoLocalStorage(): void {
    localStorage.setItem("cores", JSON.stringify(this.coresPredefinidas));
  }

  private obterCorDisponivel(): string | null {
    const coresDisponiveis = this.coresPredefinidas.filter(
      (cor) => cor.utilizada === false
    );

    if (coresDisponiveis.length === 0) {
      return null;
    }

    const indiceCor = Math.floor(Math.random() * coresDisponiveis.length);
    const corDisponivel = coresDisponiveis[indiceCor];

    return corDisponivel.cor;
  }

  private atualizarStatusCor(cor: string): void {
    const indiceCor = this.coresPredefinidas.findIndex(
      (corPredefinida) => corPredefinida.cor === cor
    );

    this.coresPredefinidas[indiceCor].utilizada = true;
    this.atualizarCoresNoLocalStorage();
  }
}

class InterfaceGrafica {
  // Toast
  private toastSucesso: HTMLDivElement;
  private toastErro: HTMLDivElement;

  constructor() {
    this.toastErro = document.getElementById("toast-erro") as HTMLDivElement;
    this.toastSucesso = document.getElementById(
      "toast-sucesso"
    ) as HTMLDivElement;
  }

  // Toast
  exibirToast(tipo: string, titulo: string, mensagem: string = "") {
    const toastElement =
      tipo === "sucesso" ? this.toastSucesso : this.toastErro;
    const tituloToast = document.getElementById(`titulo-toast-${tipo}`);
    const mensagemToast = document.getElementById(`mensagem-toast-${tipo}`);

    if (toastElement && tituloToast && mensagemToast) {
      tituloToast.innerText = titulo;
      mensagemToast.innerText = mensagem;

      toastElement.classList.remove("hidden");

      setTimeout(() => {
        toastElement.classList.add("hidden");
      }, 3000);
    }
  }

  // Popover
  trocarExibicaoPopover(popover: HTMLDivElement): void {
    if (popover?.classList.contains("hidden")) {
      popover?.classList.remove("hidden");
    } else {
      popover?.classList.add("hidden");
    }
  }

  fecharPopoverAoClicarFora(
    event: MouseEvent,
    botaoPopover: HTMLButtonElement,
    popover: HTMLDivElement
  ) {
    const targetNode = event.target as Node;

    if (
      targetNode &&
      !botaoPopover?.contains(targetNode) &&
      !popover?.contains(targetNode)
    ) {
      popover?.classList.add("hidden");
    }
  }
}
