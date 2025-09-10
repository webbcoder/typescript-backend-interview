import { Module } from '@nestjs/common'
import { StudentService } from './student.service'
import { StudentRepository } from './student.repository'
import { StudentController } from './student.controller'

import { SectionModule } from '../section/section.module'
import { ClassroomModule } from '../classroom/classroom.module'
import { PdfModule } from '../pdf/pdf.module'

@Module({
  imports: [SectionModule, ClassroomModule, PdfModule],
  providers: [StudentService, StudentRepository],
  controllers: [StudentController],
  exports: [StudentService, StudentRepository],
})
export class StudentModule {}
