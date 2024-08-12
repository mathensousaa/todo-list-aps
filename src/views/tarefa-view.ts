import { CategoriaController, TarefaController } from "../controllers";
import { Tarefa } from "../models";
import { ViewStrategy } from "./strategies/view-strategy";
import { CategoriaView } from "./categoria-view";
import { TarefaRepository } from "../repositories/tarefa-repository";
import { QuadroTarefasView } from "./quadro-tarefas-view";
import { CategoriaRepository } from "../repositories";
import { CategoriaRepository } from '../repositories/categoria-repository';

export class TarefaView implements ViewStrategy {
  //Criação de Tarefa
  private formularioAdicionarTarefa: HTMLFormElement;
  private campoDescricaoTarefa: HTMLInputElement;
  private botoesAdicionarTarefaAFazer: NodeListOf<HTMLButtonElement> | null;
  private botoesAdicionarTarefaEmAndamento: NodeListOf<HTMLButtonElement> | null;
  private botoesAdicionarTarefaConcluida: NodeListOf<HTMLButtonElement> | null;

  // Popover Tarefa
  private popoversTarefa: NodeListOf<HTMLElement> | null = null;
  private botoesPopoverTarefa: NodeListOf<HTMLElement> | null = null;
  private botoesFecharPopoverTarefa: NodeListOf<HTMLElement> | null = null;

  private botoesDefinirStatusConcluida: NodeListOf<HTMLButtonElement> | null =
    null;
  private botoesEditarTarefa: NodeListOf<HTMLButtonElement> | null = null;
  private botoesExcluirTarefa: NodeListOf<HTMLButtonElement> | null = null;

  // Modal Editar Tarefa
  private dialogEditarTarefa: HTMLDivElement;
  private botaoAcaoEditarTarefa: HTMLButtonElement;
  private botaoCancelarEditarTarefa: HTMLButtonElement;

  private formularioEditarTarefa: HTMLFormElement;
  private campoEditarDescricaoTarefa: HTMLInputElement;
  private campoSelecionarCategoriaTarefa: HTMLSelectElement;
  private campoEditarDataTarefa: HTMLInputElement;

  // Modal Excluir Tarefa
  private dialogExcluirTarefa: HTMLDivElement;
  private botaoAcaoExcluirTarefa: HTMLButtonElement;
  private botaoCancelarExcluirTarefa: HTMLButtonElement;

  constructor(
    private tarefaController: TarefaController,
    private tarefaRepository: TarefaRepository,
    private categoriaController: CategoriaController,
    private categoriaRepository: CategoriaRepository,
    private quadroTarefasView: QuadroTarefasView,
    private categoriaView: CategoriaView,
    private globalView: GlobalView
  ) {
    this.formularioAdicionarTarefa = document.getElementById(
      "formulario-adicionar-tarefa"
    ) as HTMLFormElement;
    this.campoDescricaoTarefa = document.getElementById(
      "campo-descricao-tarefa"
    ) as HTMLInputElement;
    this.botoesAdicionarTarefaAFazer = document.querySelectorAll(
      "#botao-adicionar-tarefa-a-fazer"
    );
    this.botoesAdicionarTarefaEmAndamento = document.querySelectorAll(
      "#botao-adicionar-tarefa-em-andamento"
    );
    this.botoesAdicionarTarefaConcluida = document.querySelectorAll(
      "#botao-adicionar-tarefa-concluida"
    );

    this.dialogEditarTarefa = document.getElementById(
      "dialog-editar-tarefa"
    ) as HTMLDivElement;
    this.botaoCancelarEditarTarefa = document.getElementById(
      "botao-cancelar-editar-tarefa"
    ) as HTMLButtonElement;
    this.botaoAcaoEditarTarefa = document.getElementById(
      "botao-acao-editar-tarefa"
    ) as HTMLButtonElement;
    this.formularioEditarTarefa = document.getElementById(
      "formulario-editar-tarefa"
    ) as HTMLFormElement;
    this.campoEditarDescricaoTarefa = document.getElementById(
      "campo-editar-descricao-tarefa"
    ) as HTMLInputElement;
    this.campoSelecionarCategoriaTarefa = document.getElementById(
      "campo-selecionar-categoria-tarefa"
    ) as HTMLSelectElement;
    this.campoEditarDataTarefa = document.getElementById(
      "campo-editar-data-tarefa"
    ) as HTMLInputElement;

    this.dialogExcluirTarefa = document.getElementById(
      "dialog-excluir-tarefa"
    ) as HTMLDivElement;
    this.botaoCancelarExcluirTarefa = document.getElementById(
      "botao-cancelar-excluir-tarefa"
    ) as HTMLButtonElement;
    this.botaoAcaoExcluirTarefa = document.getElementById(
      "botao-acao-excluir-tarefa"
    ) as HTMLButtonElement;

    this.exibirTarefas();

    this.formularioAdicionarTarefa?.addEventListener("submit", (evento) => {
      evento.preventDefault();
      const descricao = this.campoDescricaoTarefa.value;
      const resposta = this.tarefaController.criarTarefa(descricao);
      this.campoDescricaoTarefa.value = "";
      this.campoDescricaoTarefa.placeholder = "Adicionar Tarefa";
      this.globalView.exibirToast(
        resposta.resultado,
        resposta.titulo,
        resposta.mensagem
      );
      this.removerStatusTarefaDaURL();
      this.exibirTarefas();
    });

    this.botoesAdicionarTarefaAFazer?.forEach((botao) => {
      botao.addEventListener("click", () => {
        this.removerStatusTarefaDaURL();
        this.campoDescricaoTarefa.focus();
        this.campoDescricaoTarefa.placeholder = "Adicionar Tarefa A Fazer";
      });
    });

    this.botoesAdicionarTarefaEmAndamento?.forEach((botao) => {
      botao.addEventListener("click", () => {
        this.removerStatusTarefaDaURL();
        this.adicionarStatusTarefaURL(1);
        this.campoDescricaoTarefa.focus();
        this.campoDescricaoTarefa.placeholder = "Adicionar Tarefa Em Andamento";
      });
    });

    this.botoesAdicionarTarefaConcluida?.forEach((botao) => {
      botao.addEventListener("click", () => {
        this.removerStatusTarefaDaURL();
        this.adicionarStatusTarefaURL(2);
        this.campoDescricaoTarefa.focus();
        this.campoDescricaoTarefa.placeholder = "Adicionar Tarefa Concluída";
      });
    });

    this.formularioEditarTarefa?.addEventListener("submit", (evento) => {
      evento.preventDefault();

      const idTarefa = Number(this.dialogEditarTarefa.dataset.id);
      const descricao = this.campoEditarDescricaoTarefa.value;
      const categoria = Number(this.campoSelecionarCategoriaTarefa.value);
      const data = this.campoEditarDataTarefa.value;

      const resposta = this.tarefaController.editarTarefa(
        idTarefa,
        descricao,
        categoria,
        data
      );
      this.fecharDialogEditarTarefa();
      this.globalView.exibirToast(
        resposta.resultado,
        resposta.titulo,
        resposta.mensagem
      );
      this.exibirTarefas();
      this.categoriaView.popoverCategoria.classList.add("hidden");
    });
  }

  private inicializarPopovers(): void {
    this.popoversTarefa = document.querySelectorAll('[id^="popover-tarefa-"]');
    this.botoesPopoverTarefa = document.querySelectorAll(
      '[id^="botao-popover-tarefa-"]'
    );
    this.botoesFecharPopoverTarefa = document.querySelectorAll(
      '[id^="botao-fechar-popover-tarefa-"]'
    );
  }

  private adicionarEventosPopover(): void {
    if (this.popoversTarefa) {
      this.botoesPopoverTarefa?.forEach((botao, indice) => {
        botao.addEventListener("click", () => {
          const popover = this.popoversTarefa?.[indice];
          this.globalView.trocarExibicaoPopover(popover as HTMLDivElement);
        });
      });

      this.botoesFecharPopoverTarefa?.forEach((botao, indice) => {
        botao.addEventListener("click", () => {
          const popover = this.popoversTarefa?.[indice];
          this.globalView.trocarExibicaoPopover(popover as HTMLDivElement);
        });
      });

      document.addEventListener("click", (evento: MouseEvent) => {
        this.botoesPopoverTarefa?.forEach((botao, indice) => {
          const popover = this.popoversTarefa?.[indice];
          this.globalView.fecharPopoverAoClicarFora(
            evento,
            botao as HTMLButtonElement,
            popover as HTMLDivElement
          );
        });
      });
    }
  }

  private exibirTarefas(): void {
    const tarefas = this.tarefaRepository.carregarTarefas();

    this.quadroTarefasView.colunaTarefasAFazer!.innerHTML = "";
    this.quadroTarefasView.colunaTarefasEmAndamento!.innerHTML = "";
    this.quadroTarefasView.colunaTarefasConcluidas!.innerHTML = "";

    tarefas.forEach((tarefa) => {
      const cardTarefa = this.cardTarefa(tarefa);

      switch (tarefa.status) {
        case "A fazer":
          this.quadroTarefasView.colunaTarefasAFazer?.appendChild(cardTarefa);
          break;
        case "Em andamento":
          this.quadroTarefasView.colunaTarefasEmAndamento?.appendChild(
            cardTarefa
          );
          break;
        case "Concluída":
          this.quadroTarefasView.colunaTarefasConcluidas?.appendChild(
            cardTarefa
          );
          break;
      }
    });

    this.inicializarPopovers();
    this.adicionarEventosPopover();

    this.iniciarBotoesDefinirStatusConcluida();
    this.AdicionarEventosBotaoDefinirStatusConcluida();

    this.iniciarBotoesOpcoesTarefa();
    this.AdicionarEventosBotoesOpcoesTarefa();

    this.AdicionarEventosBotoesAcaoDialog();

    this.categoriaView.AdicionarEventosBotoesOpcoesCategoria();
  }

  private cardTarefa(tarefa: Tarefa): HTMLDivElement {
    const cardTarefa = document.createElement("div");
    cardTarefa.classList.add("card-tarefa");
    cardTarefa.id = `tarefa-${tarefa.id}`;
    cardTarefa.setAttribute("draggable", "true");

    const corCategoria = this.categoriaRepository
      .carregarCategorias()
      .find((categoria) => categoria.id === Number(tarefa.categoria))?.cor;
    const nomeCategoria = this.categoriaRepository
      .carregarCategorias()
      .find((categoria) => categoria.id === Number(tarefa.categoria))?.nome;

    cardTarefa.classList.add(
      corCategoria ? `border-${corCategoria}-400` : "border-gray-200"
    );

    const descricaoTarefa = document.createElement("p");
    descricaoTarefa.classList.add("descricao-tarefa");
    descricaoTarefa.innerText = tarefa.descricao;

    cardTarefa.innerHTML = `
          <!-- Botão -->
          <button id="botao-definir-status-concluida-${
            tarefa.id
          }" class="rounded-full bg-gray-100 h-8 w-8 flex justify-center items-center hover:bg-green-500 transition-all ${
      tarefa.status === "Concluída" ? "bg-green-500" : "bg-gray-100"
    }">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="13" viewBox="0 0 18 13" fill="none">
              <path d="M15.0666 2L6.2666 10.8L2.2666 6.8" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <!-- Detalhes da Tarefa -->
          <div class="flex-1">
            <span class="text-sm">${tarefa.descricao}</span>
            <div class="flex gap-1 ${!tarefa.data ? "hidden" : ""}">
              <!-- Ícone de calendário -->
              <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
            >
              <path
                d="M13.3333 2.66678H3.99996C3.26358 2.66678 2.66663 3.26373 2.66663 4.00011V13.3334C2.66663 14.0698 3.26358 14.6668 3.99996 14.6668H13.3333C14.0697 14.6668 14.6666 14.0698 14.6666 13.3334V4.00011C14.6666 3.26373 14.0697 2.66678 13.3333 2.66678Z"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11.3333 1.33325V3.99992"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.99988 1.33325V3.99992"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.66663 6.66678H14.6666"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.99988 9.33325H6.00988"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.66663 9.33325H8.67663"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11.3333 9.33325H11.3433"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.99988 12H6.00988"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.66663 12H8.67663"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11.3333 12H11.3433"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              </svg>
              <span class="text-xs ${
                this.verificarDataMenorQueAtual(tarefa.dataVencimento)
                  ? "text-red-500"
                  : "text-gray-500"
              }">${this.converterDataParaTextoCorrido(tarefa.dataVencimento)}</span>
            </div>
          </div>

          <!-- Categoria -->
          <span class="text-xs text-gray-500 ${
            !tarefa.categoria || tarefa.categoria === undefined ? "hidden" : ""
          }">${nomeCategoria}</span>

          <!-- Popover -->
          <div class="flex justify-end">
            <div
                id="popover-tarefa-${tarefa.id}"
                class="w-[216px] mt-10 absolute rounded-md border bg-white shadow-md hidden text-sm font-medium"
            >
                <div
                class="popover-header font-semibold border-b-[1px] border-gray-100 p-3 text-blue-950"
                >
                Opções
                </div>
                <div class="popover-body p-1">
                <ul class="flex flex-col gap-2">
                    <li
                    class="flex gap-2 items-center hover:bg-gray-100 rounded-md"
                    >
                    <button id="botao-editar-tarefa-${
                      tarefa.id
                    }" class="w-full flex items-center gap-2 p-2">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        >
                        <g clip-path="url(#clip0_85_1221)">
                            <path
                            d="M11.3334 2.00022C11.5085 1.82513 11.7163 1.68623 11.9451 1.59147C12.1739 1.49671 12.4191 1.44794 12.6667 1.44794C12.9143 1.44794 13.1595 1.49671 13.3883 1.59147C13.6171 1.68623 13.8249 1.82513 14 2.00022C14.1751 2.17532 14.314 2.38319 14.4088 2.61196C14.5036 2.84073 14.5523 3.08593 14.5523 3.33355C14.5523 3.58118 14.5036 3.82638 14.4088 4.05515C14.314 4.28392 14.1751 4.49179 14 4.66689L5.00004 13.6669L1.33337 14.6669L2.33337 11.0002L11.3334 2.00022Z"
                            stroke="#334155"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_85_1221">
                            <rect
                                width="16"
                                height="16"
                                fill="white"
                                transform="translate(0 0.000244141)"
                            />
                            </clipPath>
                        </defs>
                        </svg>
                        <span>Editar tarefa</span>
                    </button>
                    </li>
                    <li
                    class="flex gap-2 items-center hover:bg-gray-100 rounded-md"
                    >
                    <button id="botao-excluir-tarefa-${
                      tarefa.id
                    }" class="w-full flex items-center gap-2 p-2">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        >
                        <path
                            d="M13.3334 3.33356H6.00004L1.33337 8.00022L6.00004 12.6669H13.3334C13.687 12.6669 14.0261 12.5264 14.2762 12.2764C14.5262 12.0263 14.6667 11.6872 14.6667 11.3336V4.66689C14.6667 4.31327 14.5262 3.97413 14.2762 3.72408C14.0261 3.47403 13.687 3.33356 13.3334 3.33356Z"
                            stroke="#334155"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M12 6.00024L8 10.0002"
                            stroke="#334155"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M8 6.00024L12 10.0002"
                            stroke="#172554"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        </svg>
                        <span>Excluir tarefa</span>
                    </button>
                    </li>
                </ul>
                </div>
                <div
                class="popover-footer border-t-[1px] border-gray-100 p-1 text-blue-950"
                >
                <ul class="flex flex-col gap-2">
                    <li
                    class="flex gap-2 items-center hover:bg-gray-100 rounded-md"
                    >
                    <button
                        id="botao-fechar-popover-tarefa-${tarefa.id}"
                        class="w-full flex items-center gap-2 p-2"
                    >
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        >
                        <path
                            d="M6 14.0002H3.33333C2.97971 14.0002 2.64057 13.8598 2.39052 13.6097C2.14048 13.3597 2 13.0205 2 12.6669V3.33358C2 2.97996 2.14048 2.64082 2.39052 2.39077C2.64057 2.14072 2.97971 2.00024 3.33333 2.00024H6"
                            stroke="#334155"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M10.6666 11.3336L14 8.00026L10.6666 4.66693"
                            stroke="#334155"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M14 8.00024H6"
                            stroke="#172554"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        </svg>
                        <span>Fechar</span>
                    </button>
                    </li>
                </ul>
                </div>
            </div>
            <button
                id="botao-popover-tarefa-${tarefa.id}"
                class=" text-white p-2 border-[1px] ${
                  corCategoria
                    ? "bg-" +
                      corCategoria +
                      "-50 " +
                      "hover:bg-" +
                      corCategoria +
                      "-100 " +
                      "border-" +
                      corCategoria +
                      "-100"
                    : "bg-gray-50 border-gray-100 hover:bg-gray-100"
                }  rounded-md "
            >
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                >
                <path
                    d="M8.66667 8.66667C9.03486 8.66667 9.33333 8.36819 9.33333 8C9.33333 7.63181 9.03486 7.33334 8.66667 7.33334C8.29848 7.33334 8 7.63181 8 8C8 8.36819 8.29848 8.66667 8.66667 8.66667Z"
                    fill="#9CA3AF"
                    stroke="#9CA3AF"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
                <path
                    d="M8.66667 4C9.03486 4 9.33333 3.70152 9.33333 3.33333C9.33333 2.96514 9.03486 2.66666 8.66667 2.66666C8.29848 2.66666 8 2.96514 8 3.33333C8 3.70152 8.29848 4 8.66667 4Z"
                    fill="#9CA3AF"
                    stroke="#9CA3AF"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
                <path
                    d="M8.66667 13.3333C9.03486 13.3333 9.33333 13.0349 9.33333 12.6667C9.33333 12.2985 9.03486 12 8.66667 12C8.29848 12 8 12.2985 8 12.6667C8 13.0349 8.29848 13.3333 8.66667 13.3333Z"
                    fill="#9CA3AF"
                    stroke="#9CA3AF"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
                </svg>
            </button>
            </div>
        `;

    return cardTarefa;
  }

  private adicionarStatusTarefaURL(novoStatus: number) {
    const parametrosURL = new URLSearchParams(window.location.search);

    parametrosURL.set("status", novoStatus.toString());

    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${parametrosURL.toString()}`
    );
  }

  private removerStatusTarefaDaURL() {
    const url = new URL(window.location.href);

    url.searchParams.delete("status");

    window.history.replaceState({}, document.title, url.toString());
  }

  private iniciarBotoesDefinirStatusConcluida(): void {
    this.botoesDefinirStatusConcluida = document.querySelectorAll(
      '[id^="botao-definir-status-concluida-"]'
    );
  }

  private AdicionarEventosBotaoDefinirStatusConcluida(): void {
    if (this.botoesDefinirStatusConcluida) {
      this.botoesDefinirStatusConcluida?.forEach((botao, indice) => {
        botao.addEventListener("click", () => {
          const botaoDefinirStatusConcluida =
            this.botoesDefinirStatusConcluida?.[indice];
          const idTarefa = botaoDefinirStatusConcluida?.id.split("-").pop();
          this.tarefaController.trocarStatusTarefa(Number(idTarefa));
          this.exibirTarefas();
        });
      });
    }
  }

  private iniciarBotoesOpcoesTarefa(): void {
    this.botoesEditarTarefa = document.querySelectorAll(
      '[id^="botao-editar-tarefa-"]'
    );
    this.botoesExcluirTarefa = document.querySelectorAll(
      '[id^="botao-excluir-tarefa-"]'
    );
  }

  private AdicionarEventosBotoesOpcoesTarefa(): void {
    if (this.botoesExcluirTarefa) {
      this.botoesExcluirTarefa?.forEach((botao, indice) => {
        botao.addEventListener("click", () => {
          const botaoExcluirTarefa = this.botoesExcluirTarefa?.[indice];
          const idTarefa = botaoExcluirTarefa?.id.split("-").pop();
          this.exibirDialogExcluirTarefa(Number(idTarefa));
        });
      });
    }

    if (this.botoesEditarTarefa) {
      this.botoesEditarTarefa?.forEach((botao, indice) => {
        botao.addEventListener("click", () => {
          const botaoEditarTarefa = this.botoesEditarTarefa?.[indice];
          const idTarefa = botaoEditarTarefa?.id.split("-").pop();
          this.exibirDialogEditarTarefa(Number(idTarefa));
        });
      });
    }
  }

  private AdicionarEventosBotoesAcaoDialog(): void {
    if (this.botaoAcaoExcluirTarefa) {
      this.botaoAcaoExcluirTarefa?.removeEventListener(
        "click",
        this.OnBotaoExcluirTarefaClick
      );
      this.botaoAcaoExcluirTarefa?.addEventListener(
        "click",
        this.OnBotaoExcluirTarefaClick
      );
    }

    if (this.botaoCancelarExcluirTarefa) {
      this.botaoCancelarExcluirTarefa?.removeEventListener(
        "click",
        this.onBotaoCancelarExcluirTarefaClick
      );
      this.botaoCancelarExcluirTarefa?.addEventListener(
        "click",
        this.onBotaoCancelarExcluirTarefaClick
      );
    }

    if (this.botaoCancelarEditarTarefa) {
      this.botaoCancelarEditarTarefa?.removeEventListener(
        "click",
        this.onBotaoCancelarEditarTarefaClick
      );
      this.botaoCancelarEditarTarefa?.addEventListener(
        "click",
        this.onBotaoCancelarEditarTarefaClick
      );
    }
  }

  private OnBotaoExcluirTarefaClick = (evento: MouseEvent): void => {
    const idTarefa = this.botaoAcaoExcluirTarefa?.id.split("-").pop();
    const resposta = this.tarefaController.excluirTarefa(Number(idTarefa));
    this.exibirTarefas();
    this.fecharDialogExcluirTarefa();
    this.globalView.exibirToast(resposta.resultado, resposta.titulo, resposta.mensagem);
  };

  private onBotaoCancelarExcluirTarefaClick = (): void => {
    this.fecharDialogExcluirTarefa();
  };

  private exibirDialogExcluirTarefa(idTarefa: number): void {
    this.dialogExcluirTarefa?.classList.remove("hidden");
    if (this.botaoAcaoExcluirTarefa) {
      (this.botaoAcaoExcluirTarefa as HTMLElement).id =
        this.botaoAcaoExcluirTarefa.id + "-" + idTarefa;
    }
  }

  private fecharDialogExcluirTarefa(): void {
    this.dialogExcluirTarefa?.classList.add("hidden");
    if (this.botaoAcaoExcluirTarefa) {
      (this.botaoAcaoExcluirTarefa as HTMLElement).id =
        "botao-acao-excluir-tarefa";
    }
  }

  // Dialog Editar Tarefa
  private onBotaoCancelarEditarTarefaClick = (evento: MouseEvent): void => {
    this.fecharDialogEditarTarefa();
  };

  private exibirDialogEditarTarefa(idTarefa: number): void {
    this.categoriaView.atualizarOpcoesCategoria(this.campoSelecionarCategoriaTarefa);
    this.dialogEditarTarefa?.classList.remove("hidden");
    this.dialogEditarTarefa.dataset.id = idTarefa.toString();
    const tarefa = this.tarefaRepository
      .carregarTarefas()
      .find((tarefa) => tarefa.id === idTarefa);

    if (this.botaoAcaoEditarTarefa) {
      (this.botaoAcaoEditarTarefa as HTMLElement).id =
        this.botaoAcaoEditarTarefa.id + "-" + idTarefa;
    }

    if (tarefa) {
      this.campoEditarDescricaoTarefa.value = tarefa.descricao;
      this.campoEditarDescricaoTarefa.focus();

      if (tarefa.categoria) {
        const opcoesCategoria =
          this.campoSelecionarCategoriaTarefa?.querySelectorAll("option");
        if (opcoesCategoria) {
          opcoesCategoria.forEach((opcao: HTMLOptionElement) => {
            if (opcao.value === tarefa.categoria?.toString()) {
              opcao.selected = true;
            }
          });
        }
      }

      if (tarefa.dataVencimento) {
        this.campoEditarDataTarefa.value = tarefa.dataVencimento;
      } else {
        this.campoEditarDataTarefa.value = "";
      }
    }
  }

  private fecharDialogEditarTarefa(): void {
    this.dialogEditarTarefa?.classList.add("hidden");
    if (this.botaoAcaoEditarTarefa) {
      (this.botaoAcaoEditarTarefa as HTMLElement).id =
        "botao-acao-editar-tarefa";
    }
  }
}
