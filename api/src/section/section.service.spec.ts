import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException } from '@nestjs/common'

import { SectionService } from './section.service'
import { SectionRepository } from './section.repository'
import { PrismaService } from '../prisma/prisma.service'

function mkTime(hm: string) {
  return new Date(`1970-01-01T${hm}:00.000Z`)
}

describe('SectionService', () => {
  let service: SectionService
  const prisma = {
    section: {
      findMany: jest.fn(async () => [
        {
          id: 'existing',
          teacherId: 't1',
          classroomId: 'c1',
          startTime: mkTime('10:00'),
          endTime: mkTime('10:50'),
          days: [{ day: 'MON' }],
        },
      ]),
      create: jest.fn(async (args: any) => ({
        id: 'new',
        ...args.data,
        days: args.data.days.createMany.data,
      })),
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SectionService, PrismaService, SectionRepository],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile()

    service = module.get<SectionService>(SectionService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('rejects invalid duration', async () => {
    await expect(
      service.create({
        subjectId: 'sub',
        teacherId: 't1',
        classroomId: 'c1',
        startTime: '08:00',
        endTime: '08:40',
        days: ['MON'],
      } as any),
    ).rejects.toBeInstanceOf(BadRequestException)
  })

  it('rejects too early or too late', async () => {
    await expect(
      service.create({
        subjectId: 'sub',
        teacherId: 't1',
        classroomId: 'c1',
        startTime: '07:20',
        endTime: '08:10',
        days: ['MON'],
      } as any),
    ).rejects.toBeInstanceOf(BadRequestException)

    await expect(
      service.create({
        subjectId: 'sub',
        teacherId: 't1',
        classroomId: 'c1',
        startTime: '21:30',
        endTime: '22:10',
        days: ['MON'],
      } as any),
    ).rejects.toBeInstanceOf(BadRequestException)
  })

  test('rejects teacher/classroom double-booking on same day & overlapping time', async () => {
    await expect(
      service.create({
        subjectId: 'sub',
        teacherId: 't1',
        classroomId: 'c1',
        startTime: '10:30',
        endTime: '11:20',
        days: ['MON'],
      } as any),
    ).rejects.toBeInstanceOf(BadRequestException)
  })

  it('creates section when no conflicts', async () => {
    const res = await service.create({
      subjectId: 'sub',
      teacherId: 't1',
      classroomId: 'c1',
      startTime: '12:00',
      endTime: '12:50',
      days: ['TUE'],
    } as any)

    expect(prisma.section.create).toHaveBeenCalled()
    expect(res.days).toEqual([{ day: 'TUE' }])
  })
})
