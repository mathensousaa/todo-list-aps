export interface ViewStrategy {
    inicializarElementos(): void;
    adicionarEventos(): void;
    atualizarView(): void;
}
