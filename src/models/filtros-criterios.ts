export interface FiltroCriterios {
    dataVencimentoInicio?: Date;  // Filtra tarefas com data de vencimento a partir desta data
    dataVencimentoFim?: Date;     // Filtra tarefas com data de vencimento até esta data
    prioridade?: number;          // Filtra tarefas por nível de prioridade
    status?: string;              // Filtra tarefas por status (ex: 'A fazer', 'Concluída', etc.)
    categoria?: number;           // Filtra tarefas por categoria específica
    tags?: string[];              // Filtra tarefas por uma ou mais tags
    ordenacao?: 'dataCriacao' | 'dataVencimento' | 'prioridade' | 'status';  // Define a ordenação das tarefas
}
