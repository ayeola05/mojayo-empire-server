import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async createUser(createUserDto: CreateUserDto) {
    return await this.userModel.create(createUserDto);
  }

  async findAllUsers() {
    return await this.userModel.find();
  }

  async findUser(field: string, key: string) {
    return await this.userModel.findOne({ [field]: key });
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.findOneAndUpdate(
      { _id: userId },
      {
        name: updateUserDto.name,
        email: updateUserDto.email,
      },
      { new: true },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
