//import moment from 'moment';
//import 'moment-timezone';
//import { format, isValid } from 'date-fns'; // https://date-fns.org/docs/Getting-Started

/**
 * 날짜를 초로 변환  "2020-12-11T00:00:00.000+0900" -> seconds
 */
export const changeDateToSec = (date: string) => {
  const dateArr = date.split('T')[0].split('-');
  return new Date(
    Number(dateArr[0]),
    Number(dateArr[1]) - 1,
    Number(dateArr[2]),
  ).getTime();
};

/**
 * milliseconds -> 시, 분, 초 변환
 * @param milliseconds
 * @returns
 */
export const changeMsToTime = (milliseconds: number) => {
  function padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  // new Date(milliseconds).toISOString().slice(11, 19); // HH:MM:SS
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;
  hours = hours % 24;

  return {
    hours: padTo2Digits(hours),
    minutes: padTo2Digits(minutes),
    seconds: padTo2Digits(seconds),
  };
};

/**
 *
 * @param date
 * @param format
 * @param locale
 * @returns formatted date
 */
/*export const getDateWithFormat = (
  date: string | number,
  format: string = 'YYYY.MM.DD',
  locale?: string,
) => {
  if (date === null) {
    return '';
  }

  if (locale) {
    return moment(date).locale(locale).format(format);
  } else {
    return moment(date).format(format);
  }
};*/

/**
 * 24시간제 -> 12시간제
 */
export const convert24HourTo12HourFormat = (time: string) => {
  if (time === null || time === undefined || time === '') {
    return '';
  }

  const time_array = time?.split(':');
  let time_hour = Number(time_array?.[0]);
  time_hour = time_hour > 12 ? time_hour - 12 : time_hour;
  const time_minute = time_array?.[1];
  const time_seconds = time_array?.[2] ? `:${time_array?.[2]}` : '';

  return `${time_hour}:${time_minute}${time_seconds}`;
};

/**
 * 한국시간
 */
export const getKoreaStandardTime = (): Date => {
  // 1. 현재 시간(Locale)
  const date = new Date();

  // 2. UTC 시간 계산
  // getTimezoneOffset() 함수는 현재 사용자 PC 설정 시간대로부터 UTC 시간까지의 차이를 '분'단위로 리턴
  // getTime() 함수는 '1970년 1월1 일 00:00:00 UTC'로부터 주어진 시간 사이의 경과시간(밀리초)를 리턴
  const UTC = date.getTime() + date.getTimezoneOffset() * 60 * 1000;

  // 3. UTC to KST (UTC + 9시간)
  // 한국 시간(KST)은 UTC시간보다 9시간 더 빠름
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
  const dateKR = new Date(UTC + KR_TIME_DIFF);

  return dateKR;
};

/**
 * D-Day
 */
export interface IDDayResult {
  targetDate: Date | null;
  referenceDate: Date;
  timeDifference: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
}
export const getDDay = (
  targetDate: string | Date,
  { referenceDate = new Date() }: { referenceDate?: Date } = {},
): IDDayResult => {
  const result: IDDayResult = {
    targetDate: null, // D-Day 대상 날짜
    referenceDate, // 기준일자 (대부분 현재)
    timeDifference: 0, // 시간차이
    day: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  // D-Day 날짜 지정
  targetDate = targetDate instanceof Date ? targetDate : new Date(targetDate);
  // 'Invalid Date' 잘못된 Date 형식 확인
  if (isNaN(targetDate.getTime())) {
    return result;
  }
  result.targetDate = targetDate;

  // D-Day 날짜에서 현재 날짜의 차이를 getTime 메서드를 사용해서 밀리초의 값으로 가져온다.
  result.timeDifference =
    result.targetDate.getTime() - result.referenceDate.getTime();

  // D-day 날짜의 연,월,일 구하기
  //const dateYear = targetDate.getFullYear();
  //const dateMonth = targetDate.getMonth() + 1; // getMonth 메서드는 0부터 세기 때문에 +1 해준다.
  //const dateDay = targetDate.getDate();

  // Math.floor 함수를 이용해서 근접한 정수값을 가져온다.
  // 밀리초 값이기 때문에 1000을 곱한다.
  // 1000*60 => 60초(1분)*60 => 60분(1시간)*24 = 24시간(하루)
  // 나머지 연산자(%)를 이용해서 시/분/초를 구한다.
  result.day = Math.floor(result.timeDifference / (1000 * 60 * 60 * 24));
  result.hours = Math.floor(
    (result.timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  result.minutes = Math.floor(
    (result.timeDifference % (1000 * 60 * 60)) / (1000 * 60),
  );
  result.seconds = Math.floor((result.timeDifference % (1000 * 60)) / 1000);

  return result;
};

/**
 * 24시(자정)까지 남은 시간(분)
 */
export const getMidnightMinutes = (now: Date = new Date()): number => {
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    0,
  );
  const difference = midnight.getTime() - now.getTime(); // 밀리 초
  let minutes = Math.ceil(difference / (1000 * 60)); // 분
  if (minutes <= 0) {
    minutes = 60 * 24; // 24시간(분)
  }
  return minutes;
};

/**
 * 국제표준시간을 한국시간으로 변환하고 포멧팅하여 반환
 *
 * - 날짜 유형이 올바르지 않다면 입력값을 그대로 반환
 * - timezone 정보가 없다면 한국시간으로 간주
 */
/*export const convertUtcToFormattedKst = <T extends string | Date | number>(
  utcDate: T,
  format = 'YYYY-MM-DD HH:mm:ss',
) => {
  const date = moment.tz(utcDate, 'Asia/Seoul');
  if (!date.isValid()) return utcDate;
  return date.format(format);
};*/

/**
 * 국제표준시간을 입력받아 유효기간이 지났는지 확인
 *
 * - timezone 정보가 없다면 한국시간으로 간주
 */
/*export const isExpiredTime = (utcDate: string | Date | number) => {
  return moment.tz(utcDate, 'Asia/Seoul').diff(new Date()) < 0;
};*/
