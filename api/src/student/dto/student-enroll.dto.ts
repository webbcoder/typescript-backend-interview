import { IsUUID } from 'class-validator'

export class StudentEnrollDto {
  @IsUUID()
  sectionId!: string
}
