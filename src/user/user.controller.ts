import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //PROFILE
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getUserProfile(@Request() req) {
    const user = await this.userService.findUser('_id', req.user._id);
    if (user) {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      };
    }
    throw new BadRequestException('User not found');
  }

  //TODO Map a update password route
  //UPDATE PROFILE
  @UseGuards(JwtAuthGuard)
  @Patch('/profile')
  async updateUser(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.findUser('_id', req.user._id);
    if (user) {
      const user = await this.userService.updateUser(
        req.user._id,
        updateUserDto,
      );
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      };
    }
    throw new BadRequestException('User not found');
  }

  //TODO Protect with admin role
  @UseGuards(JwtAuthGuard)
  @Get()
  async adminGetAllUsers() {
    return this.userService.findAllUsers();
  }
}
