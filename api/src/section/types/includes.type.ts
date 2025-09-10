import { Prisma } from '@prisma/client'

export type SectionWithIncludes = Prisma.SectionGetPayload<{
  include: { subject: true; teacher: true; classroom: true; days: true }
}>
