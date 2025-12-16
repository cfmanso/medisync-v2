import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { prisma, User } from '@medisync/database';
import * as bcrypt from 'bcrypt';
import { PaginationParams } from 'src/common/decorators/pagination.decorator';
import { AppAbility } from '../casl/casl-ability-factory.service';
import { accessibleBy } from '@casl/prisma';

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

  async findAll(
    role?: string,
    pagination?: PaginationParams,
    ability?: AppAbility,
  ) {
    const { page, limit, skip } = pagination || { page: 1, limit: 10, skip: 0 };

    const securityFilter = ability ? accessibleBy(ability).User : {};
    const businessFilter = role ? { role } : {};
    const where = {
      AND: [securityFilter, businessFilter],
    };
    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        limit,
      },
    };
  }

  findOne(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password, permissions, ...dataWithoutPasswordAndPermissions } = updateUserDto;
    
    const dataToUpdate: any = { ...dataWithoutPasswordAndPermissions };

    if (permissions !== undefined) {
      dataToUpdate.permissions = JSON.stringify(permissions);
    }

    return prisma.user.update({ 
      where: { id }, 
      data: dataToUpdate 
    });
  }

  async updatePermissions(id: string, permissions: any[]) {
    const permissionsString = JSON.stringify(permissions);

    return prisma.user.update({
      where: { id },
      data: { permissions: permissionsString },
    });
  }

  remove(id: string) {
    return prisma.user.delete({ where: { id } });
  }
}
