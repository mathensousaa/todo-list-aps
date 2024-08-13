export class ArquivoService {
  anexarArquivo(idTarefa: number, arquivo: File): void {};
  removerArquivo(idTarefa: number, arquivo: string): void {};
  obterArquivos(idTarefa: number): string[] {};
}
