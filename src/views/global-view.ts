import { ViewStrategy } from "./view-strategy";

export class GlobalView implements ViewStrategy {
  // Toast
  private toastSucesso!: HTMLDivElement;
  private toastErro!: HTMLDivElement;

  constructor() {
    this.inicializarElementos();
    this.adicionarEventos();
  }

  inicializarElementos(): void {
    this.toastErro = document.getElementById("toast-erro") as HTMLDivElement;
    this.toastSucesso = document.getElementById(
      "toast-sucesso"
    ) as HTMLDivElement;
  }

  adicionarEventos(): void {
    this.toastSucesso.addEventListener("click", () => {
      this.toastSucesso.classList.add("hidden");
    });

    this.toastErro.addEventListener("click", () => {
      this.toastErro.classList.add("hidden");
    });
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
