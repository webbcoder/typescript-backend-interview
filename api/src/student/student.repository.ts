import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class StudentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique<T extends Prisma.StudentInclude | undefined>(where: Prisma.StudentWhereUniqueInput, include?: T) {
    return this.prisma.student.findUnique({ where, include })
  }
}
