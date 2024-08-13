export function converterDataParaTextoCorrido(
  dataString: string | null
): string {
  if (!dataString) {
    return "";
  }

  const data = new Date(dataString);

  const meses = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  const dia = data.getDate() + 1;
  const mes = meses[data.getMonth()];
  const ano = data.getFullYear();

  const textoCorrido = dia + " de " + mes + " de " + ano;

  return textoCorrido;
}

export function verificarDataMenorQueAtual(dataString: string | null): boolean {
  if (!dataString) {
    return false;
  }

  const dataFornecida = new Date(dataString);

  // Obtém a data atual
  const dataAtual = new Date();

  // Compara as datas
  return dataFornecida < dataAtual ? true : false;
}
