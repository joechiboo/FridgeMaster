import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { FridgeService } from './fridge.service';
import { CreateFridgeDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('fridges')
@UseGuards(JwtAuthGuard)
export class FridgeController {
  constructor(private fridgeService: FridgeService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateFridgeDto) {
    return this.fridgeService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Request() req) {
    return this.fridgeService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.fridgeService.findOne(req.user.id, id);
  }

  @Delete(':id')
  delete(@Request() req, @Param('id') id: string) {
    return this.fridgeService.delete(req.user.id, id);
  }
}
