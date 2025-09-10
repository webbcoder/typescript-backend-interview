import { Controller, Param, Post, Body, Delete, Get, Res } from '@nestjs/common'
import { Response } from 'express'

import { StudentService } from './student.service'
import { PdfService } from '../pdf/pdf.service'
import { StudentEnrollDto } from './dto/student-enroll.dto'

@Controller('student/:id')
export class StudentController {
  constructor(
    private studentService: StudentService,
    private readonly pdf: PdfService,
  ) {}

  @Get('schedule')
  schedule(@Param('id') id: string) {
    return this.studentService.schedule(id)
  }

  @Get('schedule/pdf')
  async schedulePdf(@Param('id') id: string, @Res() res: Response) {
    const rows = await this.studentService.scheduleForPdf(id)
    const pdf = await this.pdf.buildStudentSchedulePdf(id, rows)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="schedule-${id}.pdf"`)
    return res.send(pdf)
  }

  @Post('enroll')
  enroll(@Param('id') id: string, @Body() dto: StudentEnrollDto) {
    return this.studentService.enroll(id, dto)
  }
  @Delete('sections/:sectionId')
  unenroll(@Param('id') id: string, @Param('sectionId') sectionId: string) {
    return this.studentService.unenroll(id, sectionId)
  }
}
