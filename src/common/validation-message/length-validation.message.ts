import { ValidationArguments } from 'class-validator';

export const lengthValidationMessage = (args: ValidationArguments) => {
  if (args.constraints.length === 2) {
    return `${args.property} must be longer than or equal to ${args.constraints[0]} and shorter than or equal to ${args.constraints[1]} characters`;
  } else {
    return `${args.property} must be longer than or equal to ${args.constraints[0]} characters`;
  }
};
