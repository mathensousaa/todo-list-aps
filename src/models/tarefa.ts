export class Tarefa {
  constructor(
    public id: number,
    public titulo: string,
    public descricao: string | null,
    public dataVencimento: string | null,
    public status: string,
    public categoria: number | null,
    public comentarios: string[],
    public anexos: string[],
    public notificacao: boolean
  ) {}
}
