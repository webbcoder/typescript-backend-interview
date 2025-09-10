import { Injectable, UnauthorizedException } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  async validateUser(authHeader: string): Promise<void> {
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new UnauthorizedException('Authorization header missing or invalid')
    }

    const base64Credentials = authHeader.split(' ')[1]
    const [username, password] = Buffer.from(base64Credentials, 'base64').toString('ascii').split(':')
    const user = await this.prisma.user.findUnique({ where: { email: username, password } })
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }
  }
}
