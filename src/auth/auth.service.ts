import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.iterface';

@Injectable()
export class AuthService {
  constructor(
      private userRepository: UsersRepository,
      private jwtService: JwtService
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });
    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        //console.error('Username already exists');
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
      // console.error('Error during sign up:', error.code);
    }
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
    const { username, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
        // Return a JWT or some token
        const payload : JwtPayload = {username};
        const accessToken: string = await this.jwtService.sign(payload);
        return { accessToken };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
