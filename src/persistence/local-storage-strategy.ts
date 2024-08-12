import { EstrategiaPersistencia } from './estrategia-persistencia';

export class LocalStorageStrategy implements EstrategiaPersistencia {
    salvar(chave: string, valor: any): void {
        localStorage.setItem(chave, JSON.stringify(valor));
    }

    carregar(chave: string): any {
        const item = localStorage.getItem(chave);
        return item ? JSON.parse(item) : null;
    }

    remover(chave: string): void {
        localStorage.removeItem(chave);
    }
}
