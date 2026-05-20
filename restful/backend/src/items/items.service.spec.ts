import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ItemsService', () => {
  let service: ItemsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: PrismaService,
          useValue: {
            item: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an item', async () => {
      const createItemDto = {
        name: 'Test Item',
        description: 'Test Description',
        quantity: 10,
        price: 100,
        category: 'Test',
      };
      const userId = 'user-123';
      const expectedResult = { id: '1', ...createItemDto, createdById: userId };

      jest.spyOn(prisma.item, 'create').mockResolvedValue(expectedResult as any);

      const result = await service.create(createItemDto, userId);
      expect(result).toEqual(expectedResult);
      expect(prisma.item.create).toHaveBeenCalledWith({
        data: { ...createItemDto, createdById: userId },
        include: {
          createdBy: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated items', async () => {
      const paginationDto = { page: 1, limit: 10, sortBy: 'name', sortOrder: 'asc' as const };
      const items = [{ id: '1', name: 'Item 1' }];
      const total = 1;

      jest.spyOn(prisma.item, 'count').mockResolvedValue(total);
      jest.spyOn(prisma.item, 'findMany').mockResolvedValue(items as any);

      const result = await service.findAll(paginationDto);

      expect(result).toEqual({
        data: items,
        meta: {
          total,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });
  });
});
