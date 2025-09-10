import { Module } from '@nestjs/common'
import { SectionService } from './section.service'
import { SectionRepository } from './section.repository'
import { SectionController } from './section.controller'

@Module({
  providers: [SectionService, SectionRepository],
  controllers: [SectionController],
  exports: [SectionService, SectionRepository],
})
export class SectionModule {}
