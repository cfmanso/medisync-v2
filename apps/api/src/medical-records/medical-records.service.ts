import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { prisma } from '@medisync/database';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { AppAbility } from '../casl/casl-ability-factory.service';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class MedicalRecordsService {
  async create(data: CreateMedicalRecordDto) {
    return prisma.medicalRecord.create({
      data: {
        description: data.description,
        patientId: data.patientId,
      },
    });
  }

  findAll(ability?: AppAbility) {
    const where = accessibleBy(ability).MedicalRecord;
    return prisma.medicalRecord.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        patient: { select: { name: true } },
      },
    });
  }

  findByPatient(patientId: string) {
    return prisma.medicalRecord.findMany({
      where: { patientId },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    const record = await prisma.medicalRecord.findUnique({
      where: { id },
    });
    if (!record) throw new NotFoundException('Prontuário não encontrado');
    return record;
  }

  async update(id: string, data: UpdateMedicalRecordDto) {
    await this.findOne(id);
    return prisma.medicalRecord.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return prisma.medicalRecord.delete({
      where: { id },
    });
  }
}
