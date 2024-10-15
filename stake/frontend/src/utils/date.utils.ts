import { BigNumberish } from 'ethers'

const dateFormatLong = new Intl.DateTimeFormat('en', {
  timeStyle: 'long',
  dateStyle: 'long',
})

const dateFormatShort = new Intl.DateTimeFormat('en', {
  dateStyle: 'long',
})

export abstract class DateUtils {
  static intlDateFormat(date: Date | number, { format }: { format: 'long' | 'short' } = { format: 'long' }) {
    if (format === 'long') {
      return dateFormatLong.format(date)
    }

    return dateFormatShort.format(date)
  }

  static unixFormatToDate(unixFormat: BigNumberish) {
    return new Date(Number(unixFormat) * 1000)
  }

  static toBasicISO8601 = (date: Date) => {
    // Ignore timezone
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, '')
  }
}
