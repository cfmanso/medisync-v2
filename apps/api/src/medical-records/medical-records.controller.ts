import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { subject } from '@casl/ability';
import { MedicalRecordsService } from './medical-records.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/casl/check-policies.decorator';
import {
  Action,
  CaslAbilityFactoryService,
} from 'src/casl/casl-ability-factory.service';
@Controller('medical-records')
@UseGuards(PoliciesGuard)
export class MedicalRecordsController {
  constructor(
    private readonly medicalRecordsService: MedicalRecordsService,
    private readonly caslAbilityFactory: CaslAbilityFactoryService,
  ) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.Create, 'MedicalRecord'))
  create(@Body() createMedicalRecordDto: CreateMedicalRecordDto) {
    return this.medicalRecordsService.create(createMedicalRecordDto);
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.Read, 'MedicalRecord'))
  findAll() {
    return this.medicalRecordsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const record = await this.medicalRecordsService.findOne(id);
    if (!record) throw new NotFoundException();

    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (ability.cannot(Action.Read, record as any)) {
      throw new ForbiddenException('Sem acesso a este prontuário');
    }

    return record;
  }

  @Get('patient/:patientId')
  async findByPatient(@Param('patientId') patientId: string, @Request() req) {
    const ability = this.caslAbilityFactory.createForUser(req.user);

    const record = subject('MedicalRecord', { patientId } as any);

    if (ability.cannot(Action.Read, phantomRecord)) {
      throw new ForbiddenException('Você não pode ver prontuários deste paciente');
    }

    return this.medicalRecordsService.findByPatient(patientId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMedicalRecordDto: UpdateMedicalRecordDto,
    @Request() req,
  ) {
    const record = await this.medicalRecordsService.findOne(id);
    if (!record) throw new NotFoundException();

    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (ability.cannot(Action.Update, record as any)) {
      throw new ForbiddenException('Sem permissão para alterar este prontuário');
    }

    return this.medicalRecordsService.update(id, updateMedicalRecordDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const record = await this.medicalRecordsService.findOne(id);
    if (!record) throw new NotFoundException();

    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (ability.cannot(Action.Delete, record as any)) {
      throw new ForbiddenException();
    }

    return this.medicalRecordsService.remove(id);
  }
}
