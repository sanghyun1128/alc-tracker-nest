import { ValidationArguments } from 'class-validator';

export const dateValidationMessage = (args: ValidationArguments) => {
  return `${args.property} is not date format`;
};
