import clamp from 'lodash/clamp';
import floor from 'lodash/floor';

/**
 * max length 처리
 */
export const maxLengthProcessor = (
  value: string,
  maxLength: string | number = Infinity,
) => {
  const maxLengthConverted = Number(maxLength);
  if (!isNaN(maxLengthConverted) && maxLengthConverted >= 0)
    value = value.slice(0, maxLengthConverted);
  return value;
};

/**
 * min, max 처리
 */
export const numberProcessor = (
  value: string,
  { min = -Infinity, max = Infinity, maxLength = Infinity },
) => {
  if (value === '') return '';
  value = maxLengthProcessor(value, maxLength);
  const valueNum = clamp(Number(value), min, max);
  return valueNum.toString();
};

/**
 * 자연수 & min, max 처리
 */
export const naturalProcessor = (
  value: string,
  { min = 0, max = Infinity, maxLength = Infinity },
) => {
  if (value === '') return '';
  value = maxLengthProcessor(value, maxLength);
  const valueNum = clamp(Math.abs(Math.trunc(Number(value))), min, max);
  return valueNum.toString();
};

/**
 * 백분율 소숫점 첫째 자리까지 처리
 * */
export const rateProcessor = (value: string, { min = 0, max = 100 }) => {
  if (value === '') return '';

  let valueNum = Math.abs(floor(Number(value), 2));
  valueNum = Number(valueNum.toFixed(1));

  return clamp(valueNum, min, max);
};

/**
 * 숫자 3자리마다 , 표시. 1234 -> 1,234  형식으로 변환
 */
export const numberWithCommas = (x: number | string) => {
  return x?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 전화번호 형식에 맞는지 체크
 * */
export const phoneNumberCheck = (
  phoneNumber: string,
  checkCellPhone: boolean = false,
  withDash: boolean = true,
) => {
  if (withDash) {
    const checkRegx = checkCellPhone
      ? /(01[0|1|6|7|8|9])-([0-9]{3,4})-([0-9]{4})$/
      : /(01[0|1|6|7|8|9])-([0-9]{3,4})-([0-9]{4})|(02)-([0-9]{3})-([0-9]{4})|(0[1-9]{2})-([0-9]{3})-([0-9]{4})$/;
    return checkRegx.test(phoneNumber);
  } else {
    return /^((010)[0-9]{8}|(01[16789]{1})[0-9]{7,8})$/.test(phoneNumber);
  }
};

/**
 * 전화번호 03112345678 -> 031-1234-5678 형식으로 반환
 */
export const WRONG_NUMBER = '잘못된 번호입니다';
export const phoneNumberFormat = (phoneNumber: number | string = '') => {
  phoneNumber = phoneNumber.toString();

  // 이미 맞는 형태일 때 그대로 값 리턴
  if (phoneNumberCheck(phoneNumber)) return phoneNumber;

  const regx =
    /(01[0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})|(02)([0-9]{3})([0-9]{4})|(0[1-9]{2})([0-9]{3})([0-9]{4})$/;
  if (!regx.test(phoneNumber)) return '';

  if (phoneNumber?.length === 10) {
    phoneNumber = `${phoneNumber.substr(0, 3)}-${phoneNumber.substr(
      3,
      3,
    )}-${phoneNumber.substr(6)}`;
  } else if (phoneNumber?.length === 11) {
    phoneNumber = `${phoneNumber.substr(0, 3)}-${phoneNumber.substr(
      3,
      4,
    )}-${phoneNumber.substr(7)}`;
  }

  return phoneNumber;
};

/**
 * 바코드 번호 1234123412341234 -> 1234-1234-1234-1234 형식으로 반환
 */
export const barcodeNumberFormat = (barcodeNumber: number | string) => {
  barcodeNumber = String(barcodeNumber);

  if (barcodeNumber?.length >= 15) {
    return `${barcodeNumber.substr(0, 4)}-${barcodeNumber.substr(
      4,
      4,
    )}-${barcodeNumber.substr(8, 4)}-${barcodeNumber.substr(12)}`;
  }
  return '';
};

/**
 * 랜덤 넘버 생성
 * - 0 ~ 2^32-1 사이의 랜덤 넘버 생성
 */
export function getRandomNumber(): number;

/**
 * min ~ max 사이의 랜덤 넘버 생성
 *
 * @param min 최소값
 * @param max 최대값
 */
export function getRandomNumber(min: number, max: number): number;

export function getRandomNumber(min?: number, max?: number): number {
  if (min === undefined || max === undefined) {
    if (typeof window === 'undefined') {
      return require('crypto').randomInt(2 ** 32 - 1);
    }
    return window.crypto.getRandomValues(new Uint32Array(1))[0];
  }
  const range = max - min + 1;
  return parseInt(((getRandomNumber() % range) + min).toString(), 10);
}

export default {};

/**
 * 사업자 번호 유효성 체크
 * @param inputNumber
 */
export const checkCorporateRegiNumber = (inputNumber: string) => {
  const regsplitNum = inputNumber
    .replace(/-/gi, '')
    .split('')
    .map(function (item) {
      return parseInt(item, 10);
    });

  if (regsplitNum.length === 10) {
    const regkey = [1, 3, 7, 1, 3, 7, 1, 3, 5];
    let regNumSum = 0;
    for (let i = 0; i < regkey.length; i++) {
      regNumSum += regkey[i] * regsplitNum[i];
    }
    regNumSum += parseInt(((regkey[8] * regsplitNum[8]) / 10).toString(), 10);

    return Math.floor(regsplitNum[9]) === (10 - (regNumSum % 10)) % 10;
  }
  return false;
};
