import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController, ItemDetailController } from './item.controller';

@Module({
  controllers: [ItemController, ItemDetailController],
  providers: [ItemService],
})
export class ItemModule {}
