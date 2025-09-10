import { IsOptional, IsString } from 'class-validator'
import { Expose } from 'class-transformer'

export class FilterUserDto {
  @IsString()
  @IsOptional()
  email?: string
}

export class UserDto {
  @Expose()
  id: string

  @Expose()
  email: string

  @Expose()
  role: string
}
