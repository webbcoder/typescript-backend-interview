import { IsEnum, IsString, IsUUID, ArrayNotEmpty, IsArray } from 'class-validator'

import { DayOfWeek } from '../enums/day-of-week.enum'

export class SectionCreateDto {
  @IsUUID()
  subjectId!: string

  @IsUUID()
  teacherId!: string

  @IsUUID()
  classroomId!: string

  @IsString()
  startTime!: string

  @IsString()
  endTime!: string

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(DayOfWeek, { each: true })
  days!: DayOfWeek[]
}
