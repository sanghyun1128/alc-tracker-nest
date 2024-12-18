import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class MaxLengthPipe {
  /**
   * Creates an instance of MaxLengthPipe.
   * @param maxLength - The maximum allowed length(inclusive) for the value.
   */
  constructor(private readonly maxLength: number) {}

  transform(value: any, metadata: any) {
    value = value.toString();

    if (value.length > this.maxLength) {
      throw new BadRequestException(
        `Value must be less than ${this.maxLength} characters`,
      );
    }

    return value;
  }
}

@Injectable()
export class MinLengthPipe {
  /**
   * Creates an instance of MaxLengthPipe.
   * @param minLength - The minimum allowed length(inclusive) for the value.
   */
  constructor(private readonly minLength: number) {}

  transform(value: any, metadata: any) {
    value = value.toString();

    if (value.length < this.minLength) {
      throw new BadRequestException(`
        Value must be more than ${this.minLength} characters`);
    }

    return value;
  }
}
