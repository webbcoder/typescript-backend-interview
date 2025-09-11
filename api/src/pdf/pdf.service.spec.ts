import { Test, TestingModule } from '@nestjs/testing'

import { PdfService } from './pdf.service'

describe('PdfService', () => {
  let pdf: PdfService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdfService],
    }).compile()

    pdf = module.get<PdfService>(PdfService)
  })

  it('should be defined', () => {
    expect(pdf).toBeDefined()
  })

  it('buildStudentSchedulePdf returns a Buffer with content', async () => {
    const buf = await pdf.buildStudentSchedulePdf('Alice', [
      {
        subjectCode: 'CHEM-101',
        subjectTitle: 'General Chemistry I',
        teacher: 'Prof Curie',
        classroom: 'Sci-201',
        days: ['MON', 'WED', 'FRI'],
        start: '08:00',
        end: '08:50',
      },
    ])

    expect(Buffer.isBuffer(buf)).toBe(true)
    expect(buf.subarray(0, 4).toString()).toBe('%PDF')
    expect(buf.toString('binary')).toMatch(/%%EOF\s*$/)
    expect(buf.length).toBeGreaterThan(500)
  })
})
