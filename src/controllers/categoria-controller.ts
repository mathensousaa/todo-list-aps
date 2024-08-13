import { Categoria } from "../models";
import { CategoriaRepository } from "../repositories";
import { CorCategoriaService } from "../services";

export class CategoriaController {
  constructor(
    private categoriaRepository: CategoriaRepository,
    private corCategoriaService: CorCategoriaService
  ) {}

  criarCategoria(nome: string): {
    resultado: string;
    titulo: string;
    mensagem?: string;
  } {
    try {
      const corDisponivel = this.corCategoriaService.obterCorDisponivel();
      if (!corDisponivel) {
        throw new Error("Nenhuma cor disponível.");
      }

      const idCategoria = this.obterProximoId();
      const novaCategoria = new Categoria(idCategoria, nome, corDisponivel);
      this.categoriaRepository.salvarCategoria(novaCategoria);
      this.corCategoriaService.atualizarStatusCor(corDisponivel, true);

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

  editarCategoria(
    id: number,
    novoNome: string
  ): { resultado: string; titulo: string; mensagem?: string } {
    try {
      const categoria = this.categoriaRepository.carregarCategoriaPorId(id);
      if (!categoria) {
        throw new Error(`Categoria ${id} não encontrada.`);
      }

      categoria.nome = novoNome;
      this.categoriaRepository.atualizarCategoria(categoria);

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

  excluirCategoria(id: number): {
    resultado: string;
    titulo: string;
    mensagem?: string;
  } {
    try {
      const categoria = this.categoriaRepository.carregarCategoriaPorId(id);
      if (!categoria) {
        throw new Error(`Categoria ${id} não encontrada!`);
      }

      this.categoriaRepository.removerCategoria(id);
      this.corCategoriaService.atualizarStatusCor(categoria.cor, false);

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

  obterCategorias(): Categoria[] {
    return this.categoriaRepository.carregarCategorias();
  }

  private obterProximoId(): number {
    const todasCategorias = this.categoriaRepository.carregarCategorias();
    const ultimoId =
      todasCategorias.length > 0
        ? todasCategorias[todasCategorias.length - 1].id
        : 0;
    return ultimoId + 1;
  }
}
