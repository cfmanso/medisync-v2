import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/casl/check-policies.decorator';
import {
  Action,
  CaslAbilityFactoryService,
} from 'src/casl/casl-ability-factory.service';

@Controller('appointments')
@UseGuards(PoliciesGuard)
export class AppointmentsController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly caslAbilityFactory: CaslAbilityFactoryService,
  ) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.Create, 'Appointment'))
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.Read, 'Appointment'))
  findAll(@Request() req) {
    const ability = this.caslAbilityFactory.createForUser(req.user);
    return this.appointmentsService.findAll(ability);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const appointment = await this.appointmentsService.findOne(id);
    if (!appointment) throw new NotFoundException();

    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (ability.cannot(Action.Read, appointment as any)) {
      throw new ForbiddenException('Sem permissão para visualizar este agendamento');
    }

    return appointment;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @Request() req,
  ) {
    const appointment = await this.appointmentsService.findOne(id);
    if (!appointment) throw new NotFoundException();

    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (ability.cannot(Action.Update, appointment as any)) {
      throw new ForbiddenException('Sem permissão para editar este agendamento');
    }

    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const appointment = await this.appointmentsService.findOne(id);
    if (!appointment) throw new NotFoundException();

    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (ability.cannot(Action.Delete, appointment as any)) {
      throw new ForbiddenException('Sem permissão para deletar este agendamento');
    }

    return this.appointmentsService.remove(id);
  }
}
