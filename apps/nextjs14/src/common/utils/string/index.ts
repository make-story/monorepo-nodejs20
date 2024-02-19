import _ from 'lodash';

// const camelCased = (str: String) =>
//   str.replace(/-([a-z])/g, function (g) {
//     return g[1].toUpperCase();
//   });

interface StringMap {
  [key: string]: any;
}
/* transform snake_case/kebab-case keys to camelCase keys */
export const keysToCamel = function (o: any): StringMap {
  const toCamel = (s: string) => {
    return s.replace(/([-_][a-z])/gi, ($1: string) => {
      return $1.toUpperCase().replace('-', '').replace('_', '');
    });
  };
  const isArray = function (a: any) {
    return Array.isArray(a);
  };
  const isObject = function (o: any) {
    return o === Object(o) && !isArray(o) && typeof o !== 'function';
  };
  if (isObject(o)) {
    const n: StringMap = {};

    Object.keys(o).forEach(k => {
      n[toCamel(k)] = keysToCamel(o[k]);
    });

    return n;
  } else if (isArray(o)) {
    return o.map((i: number) => {
      return keysToCamel(i);
    });
  }

  return o;
};

/**
 * 대상문자열의 byte 반환
 */
export const getByteLength = (data: string | number) => {
  let byteLength = 0;

  if (!_.isEmpty(data)) {
    for (let i = 0; i < String(data)?.length; ++i) {
      byteLength += charByteSize(String(data).charAt(i));
    }
  }

  return byteLength;
};

/**
 * 한글자에 대한 byte 반환
 */
export const charByteSize = (data: string | number) => {
  if (!_.isEmpty(data)) {
    return String(data).charCodeAt(0) <= 0x00007f
      ? 1
      : String(data).charCodeAt(0) <= 0x0007ff
        ? 2
        : String(data).charCodeAt(0) <= 0x00ffff
          ? 3
          : 4;
  }
  return 0;
};

/**
 * 글자수 제한
 */
export const strLimitLength = (
  str: string,
  limit: number,
  overflow: string = '...',
  { isSpaceCount = false }: any = {},
) => {
  let count = 0;
  let index = 0; // 글자 인덱스
  let isOverflow = false;
  const specPattern = /[~!@#$%^&*()_+|<>?:{}]/;
  while (index < str.length) {
    if (!specPattern.test(str[index])) {
      // 글자수
      if (isSpaceCount === true || str[index] !== ' ') {
        count += 1;
      }
      // 최대 글자수
      if (limit < count) {
        isOverflow = true;
        break;
      }
    }
    // 자르기 index
    index += 1;
  }
  const result = str.substr(0, index);
  if (isOverflow) {
    return result.replace(/\s+$/, '') + overflow;
  } else {
    return result;
  }
};

/**
 * @description 10 이하에서는 앞자리에 0을 붙임 (ex. 01, 02, 03 ..). 단, 100이하까지만 표현
 * @param (number) rank
 * @returns (string) ranking
 */
export const getRank = (rank: number): string =>
  rank === 99 ? '100' : ('0' + (rank + 1)).slice(-2);

/**
 * 한글 문자열을 초성 문자열로 변환
 * - Unicode Hangul Syllables: https://unicode.org/charts/PDF/UAC00.pdf
 * - 한글코드: 0xac00(가) ~ 0xdcaf(힣)
 * - 한글문자 조합공식: 0xac00 + ${초성순번}*0x24c + ${중성순번}*0x1c + ${종성순번}
 *   - 초성: ㄱ, ㄲ, ㄴ, ㄷ, ㄸ, ㄹ, ㅁ, ㅂ, ㅃ, ㅅ, ㅆ, ㅇ, ㅈ, ㅉ, ㅊ, ㅋ, ㅌ, ㅍ, ㅎ
 *   - 중성: ㅏ, ㅐ, ㅑ, ㅒ, ㅓ, ㅔ, ㅕ, ㅖ, ㅗ, ㅘ, ㅙ, ㅚ, ㅛ, ㅜ, ㅝ, ㅞ, ㅟ, ㅠ, ㅡ, ㅢ, ㅣ
 *   - 종성: 없음, ㄱ, ㄲ, ㄳ, ㄴ, ㄵ, ㄶ, ㄷ, ㄹ, ㄺ, ㄻ, ㄼ, ㄽ, ㄾ, ㄿ, ㅀ, ㅁ, ㅂ, ㅄ, ㅅ, ㅆ, ㅇ, ㅈ, ㅊ, ㅋ, ㅌ, ㅍ, ㅎ
 */
export function hangulToConsonant(value: string) {
  /** 유니코드 초성 목록 (자음과 다름) */
  const initials = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
  const charToConsonant = (char: string) => {
    const index = Math.floor((char.charCodeAt(0) - 0xac00) / 0x24c);
    if (index < 0) return char;
    if (index > 53) return char;
    return initials[index];
  };

  return value.split('').map(charToConsonant).join();
}

/**
 * SQL 예약어 필터링
 * - 예약어를 공백 문자열로 변환한다
 * - 예약어 목록
 *   - UNION
 *   - SELECT
 *   - INSERT
 *   - DROP
 *   - UPDATE
 *   - FROM
 *   - WHERE
 *   - JOIN
 *   - SUBSTR
 *   - SUBSTRING
 *
 * @example
 * sanitizeSQLReservedWord('Move from a to b'); // 'Move  a to b'
 * sanitizeSQLReservedWord('Select your name where table'); // ' your name  table'
 * sanitizeSQLReservedWord('Select your name where table', { trim: true }); // 'your name  table'
 */
export const sanitizeSQLReservedWord = (
  value: string,
  { trim = false } = {},
) => {
  let result = value.replace(
    /(union|select|insert|drop|update|from|where|join|substring|substr)/gi,
    '',
  );
  if (trim) result = result.trim();
  return result;
};

/**
 * 이메일 유효성 체크
 * @param inputValue
 */
export const checkEmailAddress = (inputValue: string) =>
  /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/.test(inputValue);
