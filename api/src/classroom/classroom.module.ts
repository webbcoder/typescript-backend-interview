import { Module } from '@nestjs/common'

import { ClassroomRepository } from './classroom.reposytory'

@Module({
  providers: [ClassroomRepository],
  exports: [ClassroomRepository],
})
export class ClassroomModule {}
