export abstract class BaseParser {
  protected cleanRows<T>(rawData: any[]): T[] {
    return rawData.map(row => {
      const cleanRow: any = {};
      for (const key in row) {
        if (typeof row[key] === 'string') {
          cleanRow[key] = row[key].trim();
        } else {
          cleanRow[key] = row[key];
        }
      }
      return cleanRow as T;
    });
  }
}
