export enum TipoRepeticao {
    DIARIA = 'diaria',
    SEMANAL = 'semanal',
    MENSAL = 'mensal',
}

export interface RepeticaoConfig {
    tipo: TipoRepeticao;   // Tipo de repetição (diária, semanal, mensal)
    intervalo: number;     // Intervalo de repetição (ex: repetir a cada 2 dias)
    dataInicio: Date;      // Data de início da repetição
    dataFim?: Date;        // (Opcional) Data de término da repetição
    diasDaSemana?: number[]; // (Opcional) Dias da semana para repetição semanal (0=Domingo, 6=Sábado)
}
