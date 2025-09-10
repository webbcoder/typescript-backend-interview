import { Test, TestingModule } from '@nestjs/testing'
import { UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { PrismaService } from '../prisma/prisma.service'

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
  it('should throw UnauthorizedException if authHeader is missing', () => {
    expect(() => service.validateUser(null)).rejects.toThrow(UnauthorizedException)
    expect(() => service.validateUser('')).rejects.toThrow(UnauthorizedException)
  })

  it('should throw UnauthorizedException if authHeader is invalid format', () => {
    expect(() => service.validateUser('Bearer token')).rejects.toThrow(UnauthorizedException)
    expect(() => service.validateUser('Basic')).rejects.toThrow(UnauthorizedException)
  })

  it('should throw UnauthorizedException for invalid credentials', () => {
    const invalidAuthHeader = `Basic ${Buffer.from('user1:wrongpassword').toString('base64')}`
    expect(() => service.validateUser(invalidAuthHeader)).rejects.toThrow(UnauthorizedException)
  })

  it('should validate successfully for valid credentials', () => {
    const validAuthHeader = `Basic ${Buffer.from('user1:password1').toString('base64')}`
    expect(() => service.validateUser(validAuthHeader)).not.toThrow()
  })
})
