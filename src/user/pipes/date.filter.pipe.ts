import { PipeTransform, Injectable } from '@nestjs/common';
import * as moment from 'moment';
@Injectable()
export class DateFilterPipe implements PipeTransform {
  transform(value: any) {
    if (value['schedule']['from']) {
      value['schedule']['from'] = moment(
        value['schedule']['from'],
        'YYYY/MM/DD',
      ).format('YYYY-MM-DD 00:00:00');
    }
    if (value['schedule']['to']) {
      value['schedule']['to'] = moment(
        value['schedule']['to'],
        'YYYY/MM/DD',
      ).format('YYYY-MM-DD 00:00:00');
    }
    return value;
  }
}
