import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as moment from 'moment';
@ValidatorConstraint()
export class IsAfterNowConstraint implements ValidatorConstraintInterface {
  validate(date: Date) {
    const nowDate = moment();
    const dateInput = moment(date);
    return dateInput.isBefore(nowDate);
  }

  defaultMessage(args: ValidationArguments) {
    return `Date ${args.property} can not after now.`;
  }
}

export function IsAfterNow(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsAfterNowConstraint,
    });
  };
}
