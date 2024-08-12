export interface EstrategiaPersistencia {
    salvar(chave: string, valor: any): void;
    carregar(chave: string): any;
    remover(chave: string): void;
}
