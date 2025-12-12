import { AbilityBuilder, PureAbility } from '@casl/ability';
import { PrismaQuery, Subjects, createPrismaAbility } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { User, Appointment, MedicalRecord } from '@medisync/database';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type AppSubjects =
  | 'User'
  | 'Appointment'
  | 'MedicalRecord'
  | Subjects<{
      User: User;
      Appointment: Appointment;
      MedicalRecord: MedicalRecord;
    }>
  | 'all';

export type AppAbility = PureAbility<[string, AppSubjects], PrismaQuery>;

@Injectable()
export class CaslAbilityFactoryService {
  createForUser(user: User): AppAbility {
    const { can, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

    if (user.role === 'ADMIN') {
      can(Action.Manage, 'all');
    } else if (user.role === 'DOCTOR') {
      can(Action.Read, 'Appointment', { doctorId: user.id });
      can(Action.Create, 'Appointment');
      can(Action.Update, 'Appointment', { doctorId: user.id });

      can(Action.Read, 'MedicalRecord');
      can(Action.Create, 'MedicalRecord');
      can(Action.Update, 'MedicalRecord');

      can(Action.Read, 'User', { id: user.id });
      can(Action.Read, 'User', { role: 'PATIENT' });
    } else if (user.role === 'PATIENT') {
      can(Action.Read, 'Appointment', { patientId: user.id });
      can(Action.Read, 'MedicalRecord', { patientId: user.id });
      can(Action.Read, 'User', { id: user.id });
    }

    return build();
  }
}
