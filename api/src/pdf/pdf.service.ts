import { Injectable } from '@nestjs/common'
import PDFDocument from 'pdfkit'

import { ScheduleRow } from './types/row.type'

@Injectable()
export class PdfService {
  async buildStudentSchedulePdf(studentName: string, rows: ScheduleRow[]): Promise<Buffer> {
    const doc = new PDFDocument({ size: 'LETTER', margins: { top: 50, left: 50, right: 50, bottom: 50 } })
    const chunks: Buffer[] = []
    doc.on('data', c => chunks.push(c))
    const done = new Promise<Buffer>(resolve => doc.on('end', () => resolve(Buffer.concat(chunks))))

    doc.fontSize(18).text(`Schedule for ${studentName}`, { align: 'left' }).moveDown(1)

    doc
      .fontSize(12)
      .text('Subject', 50, doc.y, { continued: true, width: 180 })
      .text('Time', 230, undefined, { continued: true, width: 120 })
      .text('Days', 350, undefined, { continued: true, width: 100 })
      .text('Teacher', 450, undefined, { continued: true, width: 160 })
      .text('Classroom', 610)

    doc
      .moveTo(50, doc.y + 5)
      .lineTo(560, doc.y + 5)
      .stroke()

    for (const r of rows) {
      doc.moveDown(0.4)
      const subj = `${r.subjectCode} — ${r.subjectTitle}`
      const time = `${r.start}–${r.end}`
      const days = r.days.join('/')
      doc
        .fontSize(11)
        .text(subj, 50, doc.y, { width: 180, continued: true })
        .text(time, 230, undefined, { width: 120, continued: true })
        .text(days, 350, undefined, { width: 100, continued: true })
        .text(r.teacher, 450, undefined, { width: 160, continued: true })
        .text(r.classroom, 610)
    }

    doc.end()
    return done
  }
}
