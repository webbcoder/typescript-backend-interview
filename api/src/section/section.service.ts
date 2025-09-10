import { Injectable, BadRequestException } from '@nestjs/common'
import { Section } from '@prisma/client'

import { SectionRepository } from './section.repository'
import { SectionWithIncludes, SectionOrderBy } from './types'
import { TIME_RANGE, DURATION } from './constants'
import { DayOfWeek } from './enums/day-of-week.enum'

import { PaginationDto } from '../common/dto/pagination.dto.'
import { SectionCreateDto } from './dto/section-create.dto'

import { parseHmToMinutes } from '../common/utils/time.utils'

@Injectable()
export class SectionService {
  constructor(private readonly repository: SectionRepository) {}

  async findOne(id: string): Promise<Section> {
    return this.repository.findUnique({ id })
  }

  async findall(params: PaginationDto): Promise<SectionWithIncludes[]> {
    const { skip, take } = params
    const include = { subject: true, teacher: true, classroom: true, days: true }
    const orderBy: SectionOrderBy = [{ startTime: 'asc' }, { id: 'asc' }]
    return this.repository.findAll({ skip, take, include, orderBy })
  }

  async create(payload: SectionCreateDto): Promise<Section> {
    const startMins = parseHmToMinutes(payload.startTime)
    const endMins = parseHmToMinutes(payload.endTime)

    if (startMins >= endMins) throw new BadRequestException('startTime must be before endTime')
    if (startMins < TIME_RANGE.earliestValue)
      throw new BadRequestException(`Earliest start is ${TIME_RANGE.earliestTime}`)
    if (endMins > TIME_RANGE.latestValue) throw new BadRequestException(`Latest end is ${TIME_RANGE.latestTime}`)

    const duration = endMins - startMins
    if (![DURATION.Min50, DURATION.Min80].includes(duration)) {
      throw new BadRequestException(`Sections must be ${DURATION.Min50} or ${DURATION.Min80} minutes long`)
    }

    await this.ensureNoResourceConflicts(payload)

    const data = {
      subjectId: payload.subjectId,
      teacherId: payload.teacherId,
      classroomId: payload.classroomId,
      startTime: new Date(`1970-01-01T${payload.startTime}:00.000Z`),
      endTime: new Date(`1970-01-01T${payload.endTime}:00.000Z`),
      days: {
        createMany: {
          data: payload.days.map(d => ({ day: d as DayOfWeek })),
          skipDuplicates: true,
        },
      },
    }

    return this.repository.create(data, { days: true })
  }

  private async ensureNoResourceConflicts(dto: SectionCreateDto) {
    const start = new Date(`1970-01-01T${dto.startTime}:00.000Z`)
    const end = new Date(`1970-01-01T${dto.endTime}:00.000Z`)

    const dayList = dto.days

    const overlapping = await this.repository.findAll({
      where: {
        OR: [{ teacherId: dto.teacherId }, { classroomId: dto.classroomId }],
        days: { some: { day: { in: dayList } } },
      },
      include: { days: true },
    })

    const requestedStart = start.getTime()
    const requestedEnd = end.getTime()
    for (const section of overlapping) {
      const existingStart = section.startTime.getTime()
      const existingEnd = section.endTime.getTime()

      const hasSharedDay = section.days.some(d => dayList.includes(d.day as DayOfWeek))

      const hasTimeOverlap = requestedStart < existingEnd && existingStart < requestedEnd

      if (hasSharedDay && hasTimeOverlap) {
        throw new BadRequestException('Teacher or classroom already booked for these times/days')
      }
    }
  }
}
