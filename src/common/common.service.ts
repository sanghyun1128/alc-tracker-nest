import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  QueryRunner,
  Repository,
} from 'typeorm';

import { HOST, PROTOCOL } from './const/env-keys.const';
import { FILTER_MAPPER } from './const/filter-mapper.const';
import { BasePaginationDto } from './dto/base-pagination.dto';
import { BaseModel } from './entity/base.entity';
@Injectable()
export class CommonService {
  paginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    if (dto.page) {
      return this.pagePaginate(dto, repository, overrideFindOptions);
    } else {
      return this.cursorPaginate(dto, repository, overrideFindOptions, path);
    }
  }

  private async pagePaginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
  ) {
    const findOptions = this.composeFindOptions<T>(dto);

    const [results, count] = await repository.findAndCount({
      ...findOptions,
      ...overrideFindOptions,
    });

    return {
      data: results,
      total: count,
    };
  }

  private async cursorPaginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    const findOptions = this.composeFindOptions<T>(dto);

    const results = await repository.find({
      ...findOptions,
      ...overrideFindOptions,
    });

    const lastItem =
      results.length > 0 && results.length === dto.take ? results[results.length - 1] : null;

    const nextUrl = lastItem ? new URL(`${PROTOCOL}://${HOST}/${path}`) : null;

    if (nextUrl) {
      for (const key of Object.keys(dto)) {
        if (dto[key]) {
          if (key !== 'where__index__more_than' && key !== 'where__index__less_than') {
            nextUrl.searchParams.append(key, dto[key]);
          }
        }
      }

      //TODO: where__index and order__createdAt should be dynamic
      //FIXME: if where__index is not present, it should be added
      const key = 'where__index__' + (dto.order__createdAt === 'ASC' ? 'more_than' : 'less_than');

      nextUrl.searchParams.append(key, lastItem.index.toString());
    }

    return {
      data: results,
      cursor: {
        after: lastItem ? lastItem.index : null,
      },
      count: results.length,
      next: nextUrl,
    };
  }

  private composeFindOptions<T extends BaseModel>(dto: BasePaginationDto): FindManyOptions<T> {
    let where: FindOptionsWhere<T> = {};
    let order: FindOptionsOrder<T> = {};

    for (const [key, value] of Object.entries(dto)) {
      if (key.startsWith('where__')) {
        where = {
          ...where,
          ...this.parseOptionsFilter<T>(key, value),
        };
      } else if (key.startsWith('order__')) {
        order = {
          ...order,
          ...this.parseOptionsFilter<T>(key, value),
        };
      }
    }

    return {
      where,
      order,
      take: dto.take,
      skip: dto.page ? (dto.page - 1) * dto.take : null,
    };
  }

  private parseOptionsFilter<T extends BaseModel>(
    key: string,
    value: any,
  ): FindOptionsWhere<T> | FindOptionsOrder<T> {
    const options: FindOptionsWhere<T> | FindOptionsOrder<T> = {};

    const splitKey = key.split('__');

    if (splitKey.length !== 2 && splitKey.length !== 3) {
      throw new BadRequestException('option filter key is invalid');
    }

    if (splitKey.length === 2) {
      const [, field] = splitKey;

      options[field] = value;
    } else {
      const [, field, operator] = splitKey;

      const values = value.toString().split(',');

      if (operator === 'between') {
        options[field] = FILTER_MAPPER[operator](values[0], values[1]);
      } else if (operator === 'i_like') {
        options[field] = FILTER_MAPPER[operator](`%${value}%`);
      } else {
        options[field] = FILTER_MAPPER[operator](value);
      }
    }

    return options;
  }

  /**
   * Retrieves the repository for a given type.
   *
   * @param {string} type - Key value for select the repository and model from the maps.
   * @param {{ [key: string]: Repository<BaseModel> }} repositoryMap - A map of repositories.
   * @param {{ [key: string]: typeof BaseModel }} modelMap - A map of model types.
   * @param {QueryRunner} [queryRunner] - Optional query runner for transactional operations.
   * @returns {Repository<BaseModel>} - The repository for the specified type.
   */
  getRepositoryWithQueryRunner(
    type: string,
    repositoryMap: { [key: string]: Repository<BaseModel> },
    modelMap: { [key: string]: typeof BaseModel },
    queryRunner?: QueryRunner,
  ): Repository<BaseModel> {
    const repository = this.selectRepositoryByType(type, repositoryMap);
    const model = this.selectModelByType(type, modelMap);

    if (!queryRunner) {
      return repository;
    } else {
      return queryRunner.manager.getRepository(model);
    }
  }

  private selectRepositoryByType(
    type: string,
    repositoryMap: { [key: string]: Repository<BaseModel> },
  ): Repository<BaseModel> {
    const repository = repositoryMap[type];
    if (!repository) {
      throw new InternalServerErrorException('Invalid type');
    }
    return repository;
  }

  private selectModelByType(
    type: string,
    modelMap: { [key: string]: typeof BaseModel },
  ): typeof BaseModel {
    const model = modelMap[type];
    if (!model) {
      throw new InternalServerErrorException('Invalid type');
    }
    return model;
  }
}
