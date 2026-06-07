import { Injectable } from '@nestjs/common';
import { ExamenExporter, ExamenExportData, ExportOptions } from './examen-exporter.interface';
import PDFDocument from 'pdfkit';

@Injectable()
export class PdfExporterService implements ExamenExporter {
  async exportar(datos: readonly ExamenExportData[], opciones: ExportOptions): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40 });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err: any) => reject(err));

      doc.fontSize(20).text('Calendario de Exámenes', { align: 'center' });
      doc.moveDown(1);

      doc.fontSize(10).fillColor('#666666').text(`Generado el: ${new Date().toLocaleString()}`, { align: 'right' });
      doc.moveDown(2);

      doc.fillColor('#000000').fontSize(10);

      let y = doc.y;

      const columns = [
        { label: 'Cód.', width: 65 },
        { label: 'Fecha', width: 70 },
        { label: 'Hora', width: 50 },
        { label: 'Tipo', width: 75 },
        { label: 'Asignatura', width: 120 },
      ];

      if (opciones.incluirAula) {
        columns.push({ label: 'Aula', width: 70 });
      }
      if (opciones.incluirProfesor) {
        columns.push({ label: 'Profesor', width: 80 });
      }

      let x = 40;
      doc.font('Helvetica-Bold');
      columns.forEach(col => {
        doc.text(col.label, x, y);
        x += col.width;
      });

      y += 15;
      doc.moveTo(40, y).lineTo(570, y).stroke();
      y += 10;

      doc.font('Helvetica');
      datos.forEach(d => {
        if (y > 700) {
          doc.addPage();
          y = 50;
          x = 40;
          doc.font('Helvetica-Bold');
          columns.forEach(col => {
            doc.text(col.label, x, y);
            x += col.width;
          });
          y += 15;
          doc.moveTo(40, y).lineTo(570, y).stroke();
          y += 10;
          doc.font('Helvetica');
        }

        x = 40;

        doc.text(d.codigo, x, y, { lineBreak: false });
        x += columns[0].width;

        doc.text(d.fecha, x, y, { lineBreak: false });
        x += columns[1].width;

        doc.text(d.hora, x, y, { lineBreak: false });
        x += columns[2].width;

        doc.text(d.tipo, x, y, { lineBreak: false });
        x += columns[3].width;

        let asigName = d.nombreAsignatura;
        if (asigName.length > 22) {
          asigName = asigName.substring(0, 20) + '...';
        }
        doc.text(asigName, x, y, { lineBreak: false });
        x += columns[4].width;

        let colIdx = 5;
        if (opciones.incluirAula) {
          let aulaName = d.nombreAula;
          if (aulaName.length > 13) {
            aulaName = aulaName.substring(0, 11) + '..';
          }
          doc.text(aulaName, x, y, { lineBreak: false });
          x += columns[colIdx].width;
          colIdx++;
        }
        if (opciones.incluirProfesor) {
          let profName = d.nombreProfesor;
          if (profName.length > 15) {
            profName = profName.substring(0, 13) + '..';
          }
          doc.text(profName, x, y, { lineBreak: false });
        }

        y += 20;
      });

      doc.end();
    });
  }
}
