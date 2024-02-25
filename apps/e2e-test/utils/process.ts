/**
 * Node.js process 관련
 */

// 쉘 명령에서 '--옵션값' 존재여부
// $ node <실행 파일> --옵션키
export const isArgv = (argv: string) => process.argv.indexOf(`--${argv}`) >= 0;

// 쉘 명령에서 '--옵션키'의 '옵션값' 반환
// $ node <실행 파일> --옵션키 옵션값
export const getArgv = (argv: string) => {
  let value = null;
  if (
    process.argv.includes(`--${argv}`) &&
    process.argv[process.argv.indexOf(`--${argv}`) + 1]
  ) {
    value = process.argv[process.argv.indexOf(`--${argv}`) + 1];
  }
  return value;
};
