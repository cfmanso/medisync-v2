import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { prisma } from '@medisync/database'; // Importando o client singleton
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppAbility } from '../casl/casl-ability-factory.service';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class AppointmentsService {
  async create(data: CreateAppointmentDto) {
    return prisma.appointment.create({
      data: {
        date: data.date,
        reason: data.reason,
        doctorId: data.doctorId,
        patientId: data.patientId,
        status: 'PENDING',
      },
    });
  }

  findAll(ability: AppAbility) {
    const where = accessibleBy(ability).Appointment;

    return prisma.appointment.findMany({
      orderBy: { date: 'desc' },
      where,
      include: {
        doctor: { select: { id: true, name: true, email: true } },
        patient: { select: { id: true, name: true } },
      },
    });
  }

  async findOne(id: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: { select: { name: true } },
        patient: { select: { name: true } },
      },
    });

    if (!appointment) {
      throw new NotFoundException(`Agendamento com ID ${id} não encontrado.`);
    }

    return appointment;
  }

  async update(id: string, data: UpdateAppointmentDto) {
    await this.findOne(id);

    return prisma.appointment.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return prisma.appointment.delete({
      where: { id },
    });
  }
}
