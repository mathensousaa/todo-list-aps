import { CategoriaController } from "../controllers";
import { Categoria } from "../models/categoria";

export class CategoriaView {
  constructor(private categoriaController: CategoriaController) {}

  exibirCategorias(categorias: Categoria[]): void;

  configurarEventos(): void;
  renderizarFormularioCategoria(): void;
}
