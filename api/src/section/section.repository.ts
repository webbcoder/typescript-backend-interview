import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class SectionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll<T extends Prisma.SectionFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.SectionFindManyArgs>,
  ): Promise<Prisma.SectionGetPayload<T>[] | null> {
    return this.prisma.section.findMany(args)
  }

  async findUnique<T extends Prisma.SectionInclude | undefined>(where: Prisma.SectionWhereUniqueInput, include?: T) {
    return this.prisma.section.findUnique({ where, include })
  }

  async create<T extends Prisma.SectionInclude | undefined>(
    data: Prisma.SectionCreateInput,
    include?: T,
  ): Promise<Prisma.SectionGetPayload<{ include: T }>> {
    return this.prisma.section.create({ data, include })
  }

  async studentSectionList<T extends Prisma.StudentSectionFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.StudentSectionFindManyArgs>,
  ): Promise<Prisma.StudentSectionGetPayload<T>[] | null> {
    return this.prisma.studentSection.findMany(args)
  }
}
