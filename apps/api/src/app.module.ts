import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { MedicalRecordsModule } from './medical-records/medical-records.module';

@Module({
  imports: [UsersModule, AppointmentsModule, MedicalRecordsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
