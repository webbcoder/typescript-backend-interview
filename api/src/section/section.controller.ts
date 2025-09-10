import { Controller, Body, Get, Param, Post, Query } from '@nestjs/common'

import { SectionService } from './section.service'
import { SectionCreateDto } from './dto/section-create.dto'
import { PaginationDto } from '../common/dto/pagination.dto.'

@Controller('section')
export class SectionController {
  constructor(private sectionService: SectionService) {}

  @Get('all')
  async sections(@Query() params: PaginationDto) {
    return this.sectionService.findall(params)
  }

  @Get(':id')
  section(@Param('id') id: string) {
    return this.sectionService.findOne(id)
  }

  @Post('create')
  create(@Body() payload: SectionCreateDto) {
    return this.sectionService.create(payload)
  }
}
