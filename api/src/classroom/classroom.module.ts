import { Module } from '@nestjs/common'

import { ClassroomRepository } from './classroom.repository'

@Module({
  providers: [ClassroomRepository],
  exports: [ClassroomRepository],
})
export class ClassroomModule {}
