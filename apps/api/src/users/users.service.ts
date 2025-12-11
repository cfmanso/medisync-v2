import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { prisma, User } from '@medisync/database';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        password: hashedPassword,
        role: createUserDto.role,
      },
    });
  }

  findAll(role?: string) {
    return prisma.user.findMany({
      where: role ? { role } : undefined,
      select: { id: true, name: true, email: true, role: true },
      orderBy: { name: 'asc' },
    });
  }

  findOne(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
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
