import { Global, Module } from '@nestjs/common';
import { CaslAbilityFactoryService } from './casl-ability-factory.service';
import { PoliciesGuard } from './policies.guard';

@Global()
@Module({
  providers: [CaslAbilityFactoryService, PoliciesGuard],
  exports: [CaslAbilityFactoryService, PoliciesGuard],
})
export class CaslModule {}
