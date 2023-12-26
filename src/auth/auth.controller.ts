import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { TokenHandler } from 'src/utils/token-handler';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const userExists = await this.userService.findUser(
      'email',
      createUserDto.email,
    );

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const password = await TokenHandler.hashKey(createUserDto.password);

    const user = await this.userService.createUser({
      ...createUserDto,
      password,
    });

    if (user) {
      return this.authService.login(user);
    }

    throw new BadRequestException('Invalid user data');
  }
}
