import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '@medisync/database';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

type Subjects = 'Appointment' | 'MedicalRecord' | 'User' | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactoryService {
  createForUser(user: User): AppAbility {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    if (user.role === 'ADMIN') {
      can(Action.Manage, 'all');
    } else if (user.role === 'DOCTOR') {
      can(Action.Read, 'Appointment', { doctorId: user.id } as any);
      can(Action.Create, 'Appointment');
      can(Action.Update, 'Appointment', { doctorId: user.id } as any);

      can(Action.Read, 'MedicalRecord');
      can(Action.Create, 'MedicalRecord');
      can(Action.Update, 'MedicalRecord');
    } else if (user.role === 'PATIENT') {
      can(Action.Read, 'Appointment', { patientId: user.id } as any);
      can(Action.Read, 'MedicalRecord', { patientId: user.id } as any);
    }

    return build();
  }
}
