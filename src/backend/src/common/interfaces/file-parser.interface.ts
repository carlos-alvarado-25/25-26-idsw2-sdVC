export interface IFileParser {
  parse<T>(buffer: Buffer, headers?: string[]): T[];
}
