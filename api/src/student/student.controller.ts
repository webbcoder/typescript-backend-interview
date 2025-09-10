import { Controller, Param, Post, Body, Delete, Get } from '@nestjs/common'

import { StudentService } from './student.service'
import { StudentEnrollDto } from './dto/student-enroll.dto'

@Controller('student/:id')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get('schedule')
  schedule(@Param('id') id: string) {
    return this.studentService.schedule(id)
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
