import { ValidationArguments } from 'class-validator';

export const enumValidationMessage = (args: ValidationArguments) => {
  const validValues = Object.values(args.constraints[0]).join(', ');

  return `${args.property} is not valid. Valid values are: ${validValues}`;
};
