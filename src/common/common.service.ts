import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promises } from 'fs';
import { join } from 'path';
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  QueryRunner,
  Repository,
} from 'typeorm';

import { HOST, PROTOCOL } from './const/env-keys.const';
import { FILTER_MAPPER } from './const/filter-mapper.const';
import { ImageModelEnum } from './const/image-model.const';
import {
  TEMP_FOLDER_PATH,
  ALCOHOLS_IMAGES_FOLDER_PATH,
  REVIEWS_IMAGES_FOLDER_PATH,
  USERS_IMAGES_FOLDER_PATH,
} from './const/path.const';
import { BasePaginationDto } from './dto/base-pagination.dto';
import { CreateImageDto } from './dto/create-image';
import { UpdateImageDto } from './dto/update-image';
import { BaseModel } from './entity/base.entity';
import { ImageModel } from './entity/image.entity';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(ImageModel)
    private readonly imageRepository: Repository<ImageModel>,
  ) {}

  private repositoryMap = {
    image: this.imageRepository,
  };

  private modelMap = {
    image: ImageModel,
  };

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
  getRepositoryWithQueryRunner<T extends BaseModel>(
    type: string,
    repositoryMap: { [key: string]: Repository<T> },
    modelMap: { [key: string]: typeof BaseModel },
    queryRunner?: QueryRunner,
  ): Repository<T> {
    const repository = this.selectRepositoryByType<T>(type, repositoryMap);
    const model = this.selectModelByType(type, modelMap);

    if (!queryRunner) {
      return repository as Repository<T>;
    } else {
      return queryRunner.manager.getRepository(model) as Repository<T>;
    }
  }

  private selectRepositoryByType<T extends BaseModel>(
    type: string,
    repositoryMap: { [key: string]: Repository<T> },
  ): Repository<T> {
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

  async createImage(dto: CreateImageDto, queryRunner?: QueryRunner): Promise<ImageModel> {
    const tempImagePath = join(TEMP_FOLDER_PATH, dto.path);

    try {
      await promises.access(tempImagePath);
    } catch (e) {
      throw new BadRequestException('Image not found');
    }

    const { alcoholId, reviewId, userId, ...dtoWithoutId } = dto;

    const type = alcoholId
      ? ImageModelEnum.ALCOHOL_IMAGE
      : reviewId
        ? ImageModelEnum.REVIEW_IMAGE
        : ImageModelEnum.USER_IMAGE;

    const basePath =
      type === ImageModelEnum.ALCOHOL_IMAGE
        ? ALCOHOLS_IMAGES_FOLDER_PATH
        : type === ImageModelEnum.REVIEW_IMAGE
          ? REVIEWS_IMAGES_FOLDER_PATH
          : USERS_IMAGES_FOLDER_PATH;

    const newPath = join(basePath, dto.path);

    const repository = this.getRepositoryWithQueryRunner(
      'image',
      this.repositoryMap,
      this.modelMap,
      queryRunner,
    ) as Repository<ImageModel>;

    const image = repository.create({
      ...dtoWithoutId,
      type,
      alcohol: {
        id: alcoholId,
      },
      review: {
        id: reviewId,
      },
      user: {
        id: userId,
      },
    });

    const result = await repository.save(image);

    await promises.rename(tempImagePath, newPath);

    return result;
  }

  async updateImage(
    imageId: string,
    dto: UpdateImageDto,
    queryRunner?: QueryRunner,
  ): Promise<ImageModel> {
    const repository = this.getRepositoryWithQueryRunner(
      'image',
      this.repositoryMap,
      this.modelMap,
      queryRunner,
    ) as Repository<ImageModel>;

    const image = await this.findImageModel(imageId, repository);

    const result = await repository.save({
      ...image,
      ...dto,
    });

    return result;
  }

  async deleteImageById(imageId: string, queryRunner?: QueryRunner): Promise<void> {
    const repository = this.getRepositoryWithQueryRunner(
      'image',
      this.repositoryMap,
      this.modelMap,
      queryRunner,
    ) as Repository<ImageModel>;

    const image = await this.findImageModel(imageId, repository);

    const imagePath = join(ALCOHOLS_IMAGES_FOLDER_PATH, image.path);

    await repository.delete(imageId);

    try {
      await promises.unlink(imagePath);
    } catch (e) {
      throw new InternalServerErrorException('Failed to delete image file');
    }
  }

  async findImageModel(imageId: string, repository: Repository<ImageModel>): Promise<ImageModel> {
    const image = await repository.findOne({
      where: { id: imageId },
    });

    if (!image) {
      throw new NotFoundException(`Image with id ${imageId} not found`);
    }

    return image;
  }
}
