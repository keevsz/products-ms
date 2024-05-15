import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);

  onModuleInit() {
    this.$connect().then(() => {
      this.logger.log('Connected to DB');
    });
  }

  create(createProductDto: CreateProductDto) {
    return this.products.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;

    const totalRegisters = await this.products.count({ where: { available: true } });
    const lastPage = Math.ceil(totalRegisters / limit);
    const data = await this.products.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: { available: true },
    });

    return {
      data,
      meta: {
        totalRegisters,
        page,
        lastPage,
      },
    };
  }

  async findOne(id: number) {
    const data = await this.products.findFirst({
      where: { id, available: true },
    });

    if (!data) throw new NotFoundException('Product not found');

    return { data };
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: __, ...dataToUpdate } = updateProductDto;
    await this.findOne(id);

    const data = await this.products.update({
      where: { id },
      data: dataToUpdate,
    });

    return { data };
  }

  async remove(id: number) {
    await this.findOne(id);
    // const data = await this.products.delete({ where: { id } });
    const data = await this.products.update({
      where: { id },
      data: { available: false },
    })
    return { data };
  }
}
