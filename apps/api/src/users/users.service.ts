import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { prisma } from '@medisync/database';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
  }

  findAll() {
    return prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
    });
  }

  findOne(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...dataWithoutPassword } = updateUserDto;
    return prisma.user.update({ where: { id }, data: dataWithoutPassword });
  }

  remove(id: string) {
    return prisma.user.delete({ where: { id } });
  }
}
