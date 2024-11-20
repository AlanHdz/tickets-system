import { BadRequestException, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { stringify } from 'querystring';
import { envs } from 'src/config/envs';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('Auth Service')

  constructor(
    private readonly jwtService: JwtService
  ) {
    super();
  }
  
  async onModuleInit() {
    await this.$connect()
    this.logger.log('Database connected')
  }

  async signJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    try {
      
      const user = await this.user.findUnique({
        where: {
          email: email
        }
      })

      if (!user) {
        throw new BadRequestException('User not exists.')
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password)

      if (!isPasswordValid) {
        throw new BadRequestException('Password incorrect')
      }

      const {  password: __, ...rest } = user;

      return {
        user: { ...rest, id: Number(rest.id) },
        token: await this.signJwt({ ...rest, id: Number(rest.id) })
      }

    } catch(error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }

  }

  async registerUser(registerUserDto: RegisterUserDto) {
    
    const { email, name, username, lastName, password } = registerUserDto

    try {
      
      const user = await this.user.findUnique({
        where: {
          email: email
        }
      })

      if (user) {
        throw new BadRequestException('User already exists.')
      }

      const newUser = await this.user.create({
        data: {
          name: name,
          email: email,
          username: username,
          lastName: lastName,
          password: bcrypt.hashSync(password, 10)
        }
      })

      const { password: __, ...rest } = newUser

      return {
        user: { ...rest, id: Number(rest.id) },
        token: await this.signJwt({ ...rest, id: Number(rest.id) })
      }


    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message)
    }
  }

  async verifyToken(token: string) {
    try {
      
      const { sub, iat, exp, ...user } = this.jwtService.verify(token, { secret: envs.jwtSecret })
      

      return {
        user: user,
        token: await this.signJwt(user)
      }

    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message)
    }
  }
  

}
