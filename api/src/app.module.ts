import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { PrismaModule } from './prisma/prisma.module'
import { StudentModule } from './student/student.module'
import { SectionModule } from './section/section.module'
import { ClassroomModule } from './classroom/classroom.module'
import config from './config'

@Module({
  imports: [
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env', `.env.${process.env.NODE_ENV}.local`, '.env.local'],
      isGlobal: true,
      load: [config],
    }),
    StudentModule,
    SectionModule,
    ClassroomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
