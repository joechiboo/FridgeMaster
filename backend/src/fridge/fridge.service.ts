import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFridgeDto } from './dto';

@Injectable()
export class FridgeService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateFridgeDto) {
    return this.prisma.fridge.create({
      data: {
        name: dto.name,
        ownerId: userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.fridge.findMany({
      where: { ownerId: userId },
      include: {
        items: {
          orderBy: { expireAt: 'asc' },
        },
      },
    });
  }

  async findOne(userId: string, fridgeId: string) {
    const fridge = await this.prisma.fridge.findFirst({
      where: {
        id: fridgeId,
        ownerId: userId,
      },
      include: {
        items: {
          orderBy: { expireAt: 'asc' },
        },
      },
    });

    if (!fridge) {
      throw new NotFoundException('Fridge not found');
    }

    return fridge;
  }

  async delete(userId: string, fridgeId: string) {
    const fridge = await this.prisma.fridge.findFirst({
      where: {
        id: fridgeId,
        ownerId: userId,
      },
    });

    if (!fridge) {
      throw new NotFoundException('Fridge not found');
    }

    await this.prisma.fridge.delete({
      where: { id: fridgeId },
    });

    return { message: 'Fridge deleted successfully' };
  }
}
