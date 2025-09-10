import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ClassroomRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique<T extends Prisma.ClassroomInclude | undefined, U extends Prisma.ClassroomSelect | undefined>(
    where: Prisma.ClassroomWhereUniqueInput,
    select?: U,
    include?: T,
  ) {
    return this.prisma.classroom.findUnique({ where, include })
  }
}
