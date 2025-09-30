import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto, UpdateItemDto } from './dto';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, fridgeId: string, dto: CreateItemDto) {
    // Verify fridge ownership
    const fridge = await this.prisma.fridge.findFirst({
      where: {
        id: fridgeId,
        ownerId: userId,
      },
    });

    if (!fridge) {
      throw new NotFoundException('Fridge not found');
    }

    return this.prisma.item.create({
      data: {
        fridgeId,
        name: dto.name,
        quantity: dto.quantity,
        unit: dto.unit,
        boughtAt: new Date(dto.boughtAt),
        expireAt: new Date(dto.expireAt),
        category: dto.category,
        note: dto.note,
      },
    });
  }

  async findAll(userId: string, fridgeId: string, filters?: { category?: string; search?: string }) {
    // Verify fridge ownership
    const fridge = await this.prisma.fridge.findFirst({
      where: {
        id: fridgeId,
        ownerId: userId,
      },
    });

    if (!fridge) {
      throw new NotFoundException('Fridge not found');
    }

    const where: any = { fridgeId };

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { note: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.item.findMany({
      where,
      orderBy: { expireAt: 'asc' },
      include: {
        reminders: true,
      },
    });
  }

  async findOne(userId: string, itemId: string) {
    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
      include: {
        fridge: true,
        reminders: true,
      },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    // Verify ownership through fridge
    if (item.fridge.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return item;
  }

  async update(userId: string, itemId: string, dto: UpdateItemDto) {
    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
      include: { fridge: true },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    if (item.fridge.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const updateData: any = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.quantity !== undefined) updateData.quantity = dto.quantity;
    if (dto.unit !== undefined) updateData.unit = dto.unit;
    if (dto.boughtAt !== undefined) updateData.boughtAt = new Date(dto.boughtAt);
    if (dto.expireAt !== undefined) updateData.expireAt = new Date(dto.expireAt);
    if (dto.category !== undefined) updateData.category = dto.category;
    if (dto.note !== undefined) updateData.note = dto.note;

    return this.prisma.item.update({
      where: { id: itemId },
      data: updateData,
    });
  }

  async delete(userId: string, itemId: string) {
    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
      include: { fridge: true },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    if (item.fridge.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.item.delete({
      where: { id: itemId },
    });

    return { message: 'Item deleted successfully' };
  }

  async getExpiringSoon(userId: string, days: number = 7) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);

    const fridges = await this.prisma.fridge.findMany({
      where: { ownerId: userId },
      select: { id: true },
    });

    const fridgeIds = fridges.map(f => f.id);

    return this.prisma.item.findMany({
      where: {
        fridgeId: { in: fridgeIds },
        expireAt: {
          lte: targetDate,
          gte: new Date(),
        },
      },
      orderBy: { expireAt: 'asc' },
      include: {
        fridge: true,
      },
    });
  }
}
