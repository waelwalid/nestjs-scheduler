import { PipeTransform, Injectable } from '@nestjs/common';
import * as moment from 'moment';
@Injectable()
export class DatePipe implements PipeTransform {
  transform(value: any) {
    if (value['workingDay']) {
      value['workingDay'] = moment(value['workingDay'], 'YYYY/MM/DD').format(
        'YYYY-MM-DD',
      );
    }
    return value;
  }
}
