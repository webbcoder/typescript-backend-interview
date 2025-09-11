import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, NotFoundException } from '@nestjs/common'

import { StudentService } from './student.service'
import { StudentRepository } from './student.repository'
import { SectionRepository } from '../section/section.repository'
import { ClassroomRepository } from '../classroom/classroom.repository'
import { PrismaService } from '../prisma/prisma.service'

function mkTime(hm: string) {
  return new Date(`1970-01-01T${hm}:00.000Z`)
}

describe('StudentService', () => {
  let service: StudentService
  const studentId = 'student-1'
  const sectionIdOk = 'sec-ok'
  const sectionIdConflict = 'sec-conflict'
  const prisma = {
    student: {
      findUnique: jest.fn(async ({ where: { id } }: any) =>
        id === studentId ? { id: studentId, name: 'Alice' } : null,
      ),
    },
    section: {
      findUnique: jest.fn(async ({ where: { id } }: any) => {
        if (id === sectionIdOk) {
          return {
            id,
            startTime: mkTime('10:00'),
            endTime: mkTime('10:50'),
            days: [{ day: 'MON' }, { day: 'WED' }, { day: 'FRI' }],
            subject: { code: 'CHEM-101', title: 'General Chemistry I' },
            teacher: { name: 'Prof' },
            classroom: { name: 'A-101' },
          }
        }
        if (id === sectionIdConflict) {
          return {
            id,
            startTime: mkTime('08:30'),
            endTime: mkTime('09:20'),
            days: [{ day: 'MON' }, { day: 'WED' }],
            subject: { code: 'MATH-201', title: 'Calculus' },
            teacher: { name: 'Dr' },
            classroom: { name: 'B-202' },
          }
        }
        return null
      }),
    },
    studentSection: {
      count: jest.fn(async () => 0),
      findMany: jest.fn(async ({ where: { studentId: sid } }: any) => {
        if (sid !== studentId) return []
        return [
          {
            section: {
              startTime: mkTime('08:00'),
              endTime: mkTime('08:50'),
              days: [{ day: 'MON' }, { day: 'WED' }, { day: 'FRI' }],
              subject: { code: 'CHEM-101' },
              teacher: { name: 'Prof Curie' },
              classroom: { name: 'Sci-201' },
            },
          },
        ]
      }),
      create: jest.fn(async (args: any) => ({ ...args.data })),
      delete: jest.fn(async () => ({ ok: true })),
    },
    classroom: {
      findUnique: jest.fn(async ({ where: { id } }) => (id === 'c1' ? { id, capacity: 30 } : null)),
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentService, StudentRepository, PrismaService, ClassroomRepository, SectionRepository],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile()

    service = module.get<StudentService>(StudentService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('enroll throws when time & day overlap', async () => {
    prisma.studentSection.count.mockResolvedValueOnce(1)
    await expect(service.enroll(studentId, { sectionId: sectionIdConflict })).rejects.toBeInstanceOf(
      BadRequestException,
    )
    expect(prisma.studentSection.create).not.toHaveBeenCalled()
  })

  it('enroll success when no conflict', async () => {
    const res = await service.enroll(studentId, { sectionId: sectionIdOk })
    expect(res).toEqual({
      section: {
        connect: {
          id: sectionIdOk,
        },
      },
      student: {
        connect: {
          id: studentId,
        },
      },
    })
    expect(prisma.studentSection.create).toHaveBeenCalled()
  })

  it('student not found', async () => {
    await expect(service.enroll('nope', { sectionId: sectionIdOk })).rejects.toBeInstanceOf(NotFoundException)
  })

  it('section not found', async () => {
    await expect(service.enroll(studentId, { sectionId: 'unknown' })).rejects.toBeInstanceOf(NotFoundException)
  })

  it('unenroll calls prisma delete', async () => {
    const resp = await service.unenroll(studentId, sectionIdOk)
    expect(resp).toEqual({ ok: true })
    expect(prisma.studentSection.delete).toHaveBeenCalledWith({
      where: { studentId_sectionId: { studentId, sectionId: sectionIdOk } },
    })
  })

  it('getSchedule flattens rows', async () => {
    prisma.student.findUnique.mockResolvedValueOnce({
      id: studentId,
      name: 'Alice',
      enrollments: [
        {
          sectionId: 's1',
          section: {
            subject: { code: 'CHEM-101', title: 'General Chemistry I' },
            teacher: { name: 'Prof Curie' },
            classroom: { name: 'Sci-201' },
            days: [{ day: 'MON' }, { day: 'WED' }, { day: 'FRI' }],
            startTime: new Date(1970, 0, 1, 8, 0, 0, 0),
            endTime: new Date(1970, 0, 1, 8, 50, 0, 0),
          },
        },
      ],
    } as any)

    const rows = await service.scheduleForPdf(studentId)
    expect(rows[0]).toMatchObject({
      subjectCode: 'CHEM-101',
      teacher: 'Prof Curie',
      classroom: 'Sci-201',
      days: ['MON', 'WED', 'FRI'],
      start: '08:00',
      end: '08:50',
    })
  })
})
