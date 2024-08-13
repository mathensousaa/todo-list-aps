import { CategoriaController } from "../controllers";
import { Categoria } from "../models/categoria";
import { GlobalView } from "./global-view";
import { ViewStrategy } from "./view-strategy";

export class CategoriaView implements ViewStrategy {
  campoSelecionarCategoriaTarefa!: HTMLSelectElement;

  // Popover Categoria
  popoverCategoria!: HTMLDivElement;
  private botaoPopoverCategoria!: HTMLButtonElement;
  private botaoFecharPopoverCategoria!: HTMLButtonElement;

  // Categoria
  private botaoAdicionarCategoria!: HTMLButtonElement;
  private botaoEditarCategoria!: HTMLButtonElement;
  private botaoExcluirCategoria!: HTMLButtonElement;

  // Modal Categoria
  private dialogAdicionarCategoria!: HTMLDivElement;
  private formularioAdicionarCategoria!: HTMLFormElement;
  private campoAdicionarNomeCategoria!: HTMLInputElement;
  private botaoAcaoAdicionarCategoria!: HTMLButtonElement;
  private botaoCancelarAdicionarCategoria!: HTMLButtonElement;

  private dialogEditarCategoria!: HTMLDivElement;
  private campoSelecionarEditarCategoria!: HTMLSelectElement;
  private formularioEditarCategoria!: HTMLFormElement;
  private campoEditarNomeCategoria!: HTMLInputElement;
  private botaoAcaoEditarCategoria!: HTMLButtonElement;
  private botaoCancelarEditarCategoria!: HTMLButtonElement;

  private dialogExcluirCategoria!: HTMLDivElement;
  private campoSelecionarExcluirCategoria!: HTMLSelectElement;
  private formularioExcluirCategoria!: HTMLFormElement;
  private botaoAcaoExcluirCategoria!: HTMLButtonElement;
  private botaoCancelarExcluirCategoria!: HTMLButtonElement;

  constructor(
    private categoriaController: CategoriaController,
    private globalView: GlobalView
  ) {
    this.inicializarElementos();
    this.adicionarEventos();
  }

  inicializarElementos(): void {
    this.campoSelecionarCategoriaTarefa = document.getElementById(
      "campo-selecionar-categoria-tarefa"
    ) as HTMLSelectElement;

    this.popoverCategoria = document.getElementById(
      "popover-categoria"
    ) as HTMLDivElement;
    this.botaoPopoverCategoria = document.getElementById(
      "botao-popover-categoria"
    ) as HTMLButtonElement;
    this.botaoFecharPopoverCategoria = document.getElementById(
      "botao-fechar-popover-categoria"
    ) as HTMLButtonElement;

    this.botaoAdicionarCategoria = document.getElementById(
      "botao-adicionar-categoria"
    ) as HTMLButtonElement;
    this.botaoEditarCategoria = document.getElementById(
      "botao-editar-categoria"
    ) as HTMLButtonElement;
    this.botaoExcluirCategoria = document.getElementById(
      "botao-excluir-categoria"
    ) as HTMLButtonElement;

    this.formularioAdicionarCategoria = document.getElementById(
      "formulario-adicionar-categoria"
    ) as HTMLFormElement;
    this.campoAdicionarNomeCategoria = document.getElementById(
      "campo-adicionar-nome-categoria"
    ) as HTMLInputElement;
    this.dialogAdicionarCategoria = document.getElementById(
      "dialog-adicionar-categoria"
    ) as HTMLDivElement;
    this.botaoCancelarAdicionarCategoria = document.getElementById(
      "botao-cancelar-adicionar-categoria"
    ) as HTMLButtonElement;
    this.botaoAcaoAdicionarCategoria = document.getElementById(
      "botao-acao-adicionar-categoria"
    ) as HTMLButtonElement;

    this.formularioEditarCategoria = document.getElementById(
      "formulario-editar-categoria"
    ) as HTMLFormElement;
    this.campoSelecionarEditarCategoria = document.getElementById(
      "campo-selecionar-editar-categoria-tarefa"
    ) as HTMLSelectElement;
    this.dialogEditarCategoria = document.getElementById(
      "dialog-editar-categoria"
    ) as HTMLDivElement;
    this.campoEditarNomeCategoria = document.getElementById(
      "campo-editar-nome-categoria"
    ) as HTMLInputElement;
    this.botaoCancelarEditarCategoria = document.getElementById(
      "botao-cancelar-editar-categoria"
    ) as HTMLButtonElement;
    this.botaoAcaoEditarCategoria = document.getElementById(
      "botao-acao-editar-categoria"
    ) as HTMLButtonElement;

    this.formularioExcluirCategoria = document.getElementById(
      "formulario-excluir-categoria"
    ) as HTMLFormElement;
    this.campoSelecionarExcluirCategoria = document.getElementById(
      "campo-selecionar-excluir-categoria-tarefa"
    ) as HTMLSelectElement;
    this.dialogExcluirCategoria = document.getElementById(
      "dialog-excluir-categoria"
    ) as HTMLDivElement;
    this.botaoAcaoExcluirCategoria = document.getElementById(
      "botao-acao-excluir-categoria"
    ) as HTMLButtonElement;
    this.botaoCancelarExcluirCategoria = document.getElementById(
      "botao-cancelar-excluir-categoria"
    ) as HTMLButtonElement;
  }

  adicionarEventos(): void {
    this.formularioAdicionarCategoria?.addEventListener("submit", (evento) => {
      evento.preventDefault();
      const nome = this.campoAdicionarNomeCategoria.value;
      const resposta = this.categoriaController.criarCategoria(nome);
      this.campoAdicionarNomeCategoria.value = "";
      this.globalView.exibirToast(
        resposta.resultado,
        resposta.titulo,
        resposta.mensagem
      );
      this.fecharDialogAdicionarCategoria();

      if (resposta.resultado === "sucesso") {
        this.atualizarOpcoesCategoria(this.campoSelecionarCategoriaTarefa);
      }

      this.popoverCategoria.classList.add("hidden");
    });

    this.formularioEditarCategoria?.addEventListener("submit", (evento) => {
      evento.preventDefault();

      const idCategoria = Number(this.campoSelecionarEditarCategoria.value);
      const nome = this.campoEditarNomeCategoria.value;

      const resposta = this.categoriaController.editarCategoria(
        idCategoria,
        nome
      );
      this.fecharDialogEditarCategoria();
      this.globalView.exibirToast(
        resposta.resultado,
        resposta.titulo,
        resposta.mensagem
      );

      if (resposta.resultado === "sucesso") {
        this.atualizarOpcoesCategoria(this.campoSelecionarCategoriaTarefa);
        // this.exibirTarefas();
      }

      this.popoverCategoria.classList.add("hidden");
    });

    this.formularioExcluirCategoria?.addEventListener("submit", (evento) => {
      evento.preventDefault();

      const idCategoria = Number(this.campoSelecionarExcluirCategoria.value);

      const resposta = this.categoriaController.excluirCategoria(idCategoria);
      this.fecharDialogExcluirCategoria();
      this.globalView.exibirToast(
        resposta.resultado,
        resposta.titulo,
        resposta.mensagem
      );

      if (resposta.resultado === "sucesso") {
        this.atualizarOpcoesCategoria(this.campoSelecionarCategoriaTarefa);
        // this.exibirTarefas();
      }

      this.popoverCategoria.classList.add("hidden");
    });

    this.adicionarEventosPopover();
    this.AdicionarEventosBotoesOpcoesCategoria();
    this.AdicionarEventosBotoesAcaoDialog();
  }

  // Popover Categoria
  private ExibirPopoverCategoria() {
    this.popoverCategoria.classList.remove("hidden");
  }

  private fecharPopoverCategoria() {
    this.popoverCategoria.classList.add("hidden");
  }

  private adicionarEventosPopover(): void {
    if (this.popoverCategoria) {
      this.botaoPopoverCategoria?.addEventListener("click", () => {
        this.ExibirPopoverCategoria();
      });

      this.botaoFecharPopoverCategoria?.addEventListener("click", () => {
        this.fecharPopoverCategoria();
      });

      document.addEventListener("click", (evento: MouseEvent) => {
        this.globalView.fecharPopoverAoClicarFora(
          evento,
          this.botaoPopoverCategoria,
          this.popoverCategoria
        );
      });
    }
  }

  private AdicionarEventosBotoesAcaoDialog(): void {
    if (this.botaoCancelarAdicionarCategoria) {
      this.botaoCancelarAdicionarCategoria?.removeEventListener(
        "click",
        this.onBotaoCancelarAdicionarCategoriaClick
      );
      this.botaoCancelarAdicionarCategoria?.addEventListener(
        "click",
        this.onBotaoCancelarAdicionarCategoriaClick
      );
    }

    if (this.botaoCancelarEditarCategoria) {
      this.botaoCancelarEditarCategoria?.removeEventListener(
        "click",
        this.onBotaoCancelarEditarCategoriaClick
      );
      this.botaoCancelarEditarCategoria?.addEventListener(
        "click",
        this.onBotaoCancelarEditarCategoriaClick
      );
    }

    if (this.botaoCancelarExcluirCategoria) {
      this.botaoCancelarExcluirCategoria?.removeEventListener(
        "click",
        this.onBotaoCancelarExcluirCategoriaClick
      );
      this.botaoCancelarExcluirCategoria?.addEventListener(
        "click",
        this.onBotaoCancelarExcluirCategoriaClick
      );
    }
  }

  // Gerenciar Categoria
  AdicionarEventosBotoesOpcoesCategoria(): void {
    if (this.botaoAdicionarCategoria) {
      this.botaoAdicionarCategoria?.addEventListener(
        "click",
        (evento: MouseEvent) => {
          this.exibirDialogAdicionarCategoria();
        }
      );
    }

    if (this.botaoEditarCategoria) {
      this.botaoEditarCategoria?.addEventListener("click", () => {
        this.exibirDialogEditarCategoria();
      });
    }

    if (this.botaoExcluirCategoria) {
      this.botaoExcluirCategoria?.addEventListener("click", () => {
        this.exibirDialogExcluirCategoria();
      });
    }
  }

  atualizarOpcoesCategoria(campoSelecaoCategoria: HTMLSelectElement): void {
    campoSelecaoCategoria.innerHTML = "";

    const opcaoCategoria = document.createElement("option");
    opcaoCategoria.value = "";
    opcaoCategoria.innerText = "Nenhuma";
    campoSelecaoCategoria.appendChild(opcaoCategoria);

    this.categoriaController.obterCategorias().forEach((categoria) => {
      const opcaoCategoria = document.createElement("option");
      opcaoCategoria.value = categoria.id.toString();
      opcaoCategoria.innerText = categoria.nome;
      opcaoCategoria.classList.add(
        `font-medium`,
        `bg-${categoria.cor}-50`,
        "py-4"
      );
      campoSelecaoCategoria.appendChild(opcaoCategoria);
    });
  }

  private onBotaoCancelarAdicionarCategoriaClick = (
    evento: MouseEvent
  ): void => {
    this.fecharDialogAdicionarCategoria();
  };

  private exibirDialogAdicionarCategoria(): void {
    this.dialogAdicionarCategoria?.classList.remove("hidden");
  }

  private fecharDialogAdicionarCategoria(): void {
    this.dialogAdicionarCategoria?.classList.add("hidden");
  }

  // Dialog Editar Categoria
  private onBotaoCancelarEditarCategoriaClick = (evento: MouseEvent): void => {
    this.fecharDialogEditarCategoria();
  };

  private exibirDialogEditarCategoria(): void {
    this.dialogEditarCategoria?.classList.remove("hidden");
    this.atualizarOpcoesCategoria(this.campoSelecionarEditarCategoria);
  }

  private fecharDialogEditarCategoria(): void {
    this.dialogEditarCategoria?.classList.add("hidden");
  }

  // Dialog Excluir Categoria
  private onBotaoCancelarExcluirCategoriaClick = (evento: MouseEvent): void => {
    this.fecharDialogExcluirCategoria();
  };

  private exibirDialogExcluirCategoria(): void {
    this.dialogExcluirCategoria?.classList.remove("hidden");
    this.atualizarOpcoesCategoria(this.campoSelecionarExcluirCategoria);
  }

  private fecharDialogExcluirCategoria(): void {
    this.dialogExcluirCategoria?.classList.add("hidden");
  }
}
