import { ValidationArguments } from 'class-validator';

export const numberValidationMessage = (args: ValidationArguments) => {
  return `${args.property} is not number`;
};

export const integerValidationMessage = (args: ValidationArguments) => {
  return `${args.property} is not integer`;
};
