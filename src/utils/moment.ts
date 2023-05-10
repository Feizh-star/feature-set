import moment from 'moment'

export function stringToDate(s: string, formatter = 'YYYYMMDDHHmm') {
  return moment(s, formatter).toDate()
}
export function dateToString(d: Date, formatter = 'YYYYMMDDHHmm') {
  return moment(d).format(formatter)
}
export function addHours(d: string, hours: number, formatter = 'YYYYMMDDHHmm') {
  return moment(d, formatter).add(hours, 'h').format(formatter)
}
export function subHours(d: string, hours: number, formatter = 'YYYYMMDDHHmm') {
  return moment(d, formatter).subtract(hours, 'h').format(formatter)
}
export function stringFormatter(strTime: string, sFormatter = 'YYYYMMDDHHmm', dFormatter='YYYY-MM-DD HH:mm') {
  return dateToString(stringToDate(strTime, sFormatter), dFormatter)
}