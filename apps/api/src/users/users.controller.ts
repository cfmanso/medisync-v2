import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/auth/public.decorator';
import { Pagination, PaginationParams } from 'src/common/decorators/pagination.decorator';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/casl/check-policies.decorator';
import { Action, CaslAbilityFactoryService } from '../casl/casl-ability-factory.service';

@Controller('users')
@UseGuards(PoliciesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly caslAbilityFactory: CaslAbilityFactoryService,
  ) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.Create, 'User'))
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
  @CheckPolicies((ability) => ability.can(Action.Read, 'User'))
  findAll(@Query('role') role?: string, @Pagination() pagination?: PaginationParams) {
    return this.usersService.findAll(role, pagination);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException();

    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (ability.cannot(Action.Read, user as any)) {
      throw new ForbiddenException('Acesso negado ao perfil');
    }

    return user;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    const userToUpdate = await this.usersService.findOne(id);
    if (!userToUpdate) throw new NotFoundException();

    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (ability.cannot(Action.Update, userToUpdate as any)) {
      throw new ForbiddenException('Você não pode editar este usuário');
    }

    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const userToDelete = await this.usersService.findOne(id);
    if (!userToDelete) throw new NotFoundException();

    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (ability.cannot(Action.Delete, userToDelete as any)) {
      throw new ForbiddenException('Você não pode deletar este usuário');
    }

    return this.usersService.remove(id);
  }
}