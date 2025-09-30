import { Module } from '@nestjs/common';
import { FridgeService } from './fridge.service';
import { FridgeController } from './fridge.controller';

@Module({
  controllers: [FridgeController],
  providers: [FridgeService],
})
export class FridgeModule {}
