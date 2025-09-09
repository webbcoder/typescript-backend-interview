import { IsUUID } from 'class-validator'

export class StudentEnrollDTO {
  @IsUUID()
  sectionId!: string
}
