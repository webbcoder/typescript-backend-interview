import { Module, MiddlewareConsumer } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthMiddleware } from './auth.middleware'

@Module({
  providers: [AuthService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*')
  }
}
