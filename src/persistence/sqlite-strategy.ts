import { EstrategiaPersistencia } from "./estrategia-persistencia";

export class SQLiteStrategy implements EstrategiaPersistencia {
  salvar(chave: string, valor: any): void {};
  carregar(chave: string): any {};
  remover(chave: string): void {};
}
