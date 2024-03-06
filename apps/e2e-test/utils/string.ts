/**
 * string -> boolean 타입 변환
 */
export function stringToBoolean(string: any) {
  if (typeof string !== 'string') {
    return string;
  }
  switch (string.toLowerCase().trim()) {
    case 'true':
    case 'yes':
    case 'y':
    case '1':
      return true;
    case 'false':
    case 'no':
    case 'n':
    case '0':
      return false;
  }
}
