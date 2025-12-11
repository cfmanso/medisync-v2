import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/auth/public.decorator';
import { Pagination, PaginationParams } from 'src/common/decorators/pagination.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('mock')
  @Public()
  createMockUser() {
    const createUserDto: CreateUserDto = {
      name: 'Admin',
      email: 'admin@medisync.com',
      password: '123456',
      role: 'ADMIN',
    };
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query('role') role?: string, @Pagination() pagination?: PaginationParams) {
    return this.usersService.findAll(role, pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
