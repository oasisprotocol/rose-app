import { DateUtils } from './date.utils'

export abstract class CalendarUtils {
  static addGoogleCalendarEventLink(
    title: string,
    start: Date,
    end: Date,
    location: string,
    description: string
  ) {
    return [
      'https://www.google.com/calendar/render?action=TEMPLATE',
      `&text=${encodeURIComponent(title)}`,
      `&dates=${DateUtils.toBasicISO8601(start)}/${DateUtils.toBasicISO8601(end)}`,
      `&location=${encodeURIComponent(location)}`,
      `&details=${encodeURIComponent(description)}`,
    ].join('')
  }
}
