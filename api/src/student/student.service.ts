import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { Student } from '@prisma/client'

import { StudentEnrollDto } from './dto/student-enroll.dto'

import { StudentRepository } from './student.repository'
import { SectionRepository } from '../section/section.repository'
import { ClassroomRepository } from '../classroom/classroom.repository'

import { fmt, timeDateToMinutes } from '../common/utils/time.utils'

@Injectable()
export class StudentService {
  constructor(
    private readonly repository: StudentRepository,
    private readonly sectionRepository: SectionRepository,
    private readonly classroomRepository: ClassroomRepository,
  ) {}

  async findOne(id: string): Promise<Student> {
    return this.repository.findUnique({ id })
  }

  async enroll(studentId: string, payload: StudentEnrollDto) {
    const [student, section] = await Promise.all([
      this.repository.findUnique({ id: studentId }),
      this.sectionRepository.findUnique({ id: payload.sectionId }, { days: true, classroom: true }),
    ])

    if (!student) throw new NotFoundException('Student not exist')
    if (!section) throw new NotFoundException('Section not found')

    const newDays = section.days.map(d => d.day)
    if (!newDays?.length) throw new BadRequestException('Section has no days')

    const hasOverlap =
      (await this.sectionRepository.studentSectionCount({
        studentId,
        section: {
          startTime: { lt: section.endTime },
          endTime: { gt: section.startTime },
          days: { some: { day: { in: newDays as any } } },
        },
      })) > 0

    if (hasOverlap) throw new BadRequestException('Time conflict with another enrolled section')

    const [countInSection, capacity] = await Promise.all([
      this.sectionRepository.studentSectionCount({ sectionId: section.id }),
      this.classroomRepository.findUnique({ id: section.classroomId }, { capacity: true }),
    ])

    if (capacity && countInSection >= capacity.capacity) {
      throw new BadRequestException('Classroom is at capacity')
    }

    return this.sectionRepository.createStudentSection({
      student: { connect: { id: studentId } },
      section: { connect: { id: section.id } },
    })
  }

  async unenroll(studentId: string, sectionId: string) {
    return this.sectionRepository.studentSectionDelete({
      studentId_sectionId: { studentId, sectionId },
    })
  }

  async schedule(studentId: string) {
    return this.sectionRepository.studentSectionList({
      where: { studentId },
      include: {
        section: {
          include: {
            subject: true,
            teacher: true,
            classroom: true,
            days: true,
          },
        },
      },
      orderBy: [{ createdAt: 'asc' }],
    })
  }

  async scheduleForPdf(id: string) {
    const student = await this.repository.findUnique(
      { id },
      {
        enrollments: {
          include: {
            section: { include: { subject: true, teacher: true, classroom: true, days: true } },
          },
        },
      },
    )

    if (!student) throw new NotFoundException('Student not exists')

    return student.enrollments.map(e => ({
      sectionId: e.sectionId,
      subjectCode: e.section.subject.code,
      subjectTitle: e.section.subject.title,
      teacher: e.section.teacher.name,
      classroom: e.section.classroom.name,
      days: e.section.days.map(d => d.day),
      start: fmt(timeDateToMinutes(e.section.startTime)),
      end: fmt(timeDateToMinutes(e.section.endTime)),
    }))
  }
}
