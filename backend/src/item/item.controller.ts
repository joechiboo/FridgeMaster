import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto, UpdateItemDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('fridges/:fridgeId/items')
@UseGuards(JwtAuthGuard)
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Post()
  create(
    @Request() req,
    @Param('fridgeId') fridgeId: string,
    @Body() dto: CreateItemDto,
  ) {
    return this.itemService.create(req.user.id, fridgeId, dto);
  }

  @Get()
  findAll(
    @Request() req,
    @Param('fridgeId') fridgeId: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.itemService.findAll(req.user.id, fridgeId, { category, search });
  }

  @Get('expiring-soon')
  getExpiringSoon(@Request() req, @Query('days') days?: string) {
    const daysNum = days ? parseInt(days) : 7;
    return this.itemService.getExpiringSoon(req.user.id, daysNum);
  }
}

@Controller('items')
@UseGuards(JwtAuthGuard)
export class ItemDetailController {
  constructor(private itemService: ItemService) {}

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.itemService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateItemDto) {
    return this.itemService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  delete(@Request() req, @Param('id') id: string) {
    return this.itemService.delete(req.user.id, id);
  }
}
