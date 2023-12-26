import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    return await this.userService.findUser('email', email);
  }

  async login(user: any) {
    const payload = {
      sub: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: this.jwtService.sign(payload),
    };
  }
}
