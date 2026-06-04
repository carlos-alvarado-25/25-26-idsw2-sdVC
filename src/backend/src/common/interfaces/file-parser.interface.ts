export interface IFileParser {
  /**
   * Procesa el buffer del archivo y retorna un array de objetos genéricos.
   * @param buffer El contenido del archivo.
   * @param headers Opcional: nombres de las columnas si el archivo no tiene cabecera (CSV).
   */
  parse<T>(buffer: Buffer, headers?: string[]): T[];
}
