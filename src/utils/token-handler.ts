import { BadRequestException } from '@nestjs/common';
import * as argon2 from 'argon2';

export class TokenHandler {
  static async hashKey(password: string): Promise<string> {
    try {
      return await argon2.hash(password);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  static async verifyKey(hash: string, password: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
