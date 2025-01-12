import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PasswordPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    value = value.toString();

    if (value.length > 16 || value.length < 8) {
      throw new BadRequestException('Password must be between 8 and 16 characters');
    }

    return value;
  }
}
