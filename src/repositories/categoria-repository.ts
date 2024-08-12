import { Categoria } from "../models";
import { EstrategiaPersistencia } from "../persistence";

export class CategoriaRepository {
    constructor(private persistencia: EstrategiaPersistencia) {}

    salvarCategoria(categoria: Categoria): void {
        const categorias = this.carregarCategorias();
        categorias.push(categoria);
        this.persistencia.salvar('categorias', categorias);
    }

    carregarCategorias(): Categoria[] {
        return this.persistencia.carregar('categorias') || [];
    }

    carregarCategoriaPorId(id: number): Categoria | undefined {
        const categorias = this.carregarCategorias();
        return categorias.find(categoria => categoria.id === id);
    }

    atualizarCategoria(categoria: Categoria): void {
        const categorias = this.carregarCategorias();
        const indice = categorias.findIndex(c => c.id === categoria.id);
        if (indice !== -1) {
            categorias[indice] = categoria;
            this.persistencia.salvar('categorias', categorias);
        }
    }

    removerCategoria(id: number): void {
        let categorias = this.carregarCategorias();
        categorias = categorias.filter(categoria => categoria.id !== id);
        this.persistencia.salvar('categorias', categorias);
    }
}
