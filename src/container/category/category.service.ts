import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/entities';
import { CategoryParams, PaginationType } from 'src/types';
import { paginationHelper } from 'src/utils';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepo: Repository<CategoryEntity>,
  ) {}

  async addCategory(category: CategoryParams) {
    const createdCategory = this.categoryRepo.create({ ...category });
    return await this.categoryRepo.save(createdCategory);
  }

  async editCategory(id: string, category: CategoryParams) {
    const foundCategory = await this.categoryRepo.findOneBy({ id });
    if (!foundCategory) {
      throw new HttpException('Category is not exist', HttpStatus.NOT_FOUND);
    }
    foundCategory.name = category.name;
    foundCategory.description = category.description;
    await this.categoryRepo.save(foundCategory);
  }

  async removeCategory(id: string) {
    const foundCategory = await this.categoryRepo.findOneBy({ id });
    if (!foundCategory) {
      throw new HttpException('Category is not exist', HttpStatus.NOT_FOUND);
    }
    await this.categoryRepo.remove(foundCategory);
  }

  async fetchDetailCategory(id: string) {
    const foundCategory = await this.categoryRepo.findOneBy({ id });
    if (!foundCategory) {
      throw new HttpException('Category is not exist', HttpStatus.NOT_FOUND);
    }
    return foundCategory;
  }

  async fetchListCategory(pagination: PaginationType, name?: string) {
    const { limit, offset } = paginationHelper(
      pagination.limit,
      pagination.page,
    );
    const queryBuilder = this.categoryRepo.createQueryBuilder('category');
    const queryCategory = queryBuilder.select();

    if (name) {
      queryCategory.andWhere(`category.name LIKE '%${name}%' `);
    }

    const listCategory = await queryCategory
      .orderBy('category.createdAt', 'DESC')
      .limit(limit)
      .offset(offset)
      .getMany();
    const totalListCategory = await queryCategory.getCount();
    return { listCategory, totalListCategory };
  }
}
