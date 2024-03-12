/**
 * https://nodejs.org/api/fs.html
 */
import path from 'node:path';
import fs from 'node:fs';

/**
 * 해당경로의 디렉토리 및 파일 리스트 반환
 */
export const getDirectoryFile = (
  pathname: string = 'headlessbrowser/testcase',
  options?: { isFileExtension: boolean },
) => {
  const source = path.resolve(__dirname, '../', pathname);
  let directory: string[] = [];
  let file: string[] = [];

  if (fs.existsSync(source)) {
    const read: fs.Dirent[] = fs.readdirSync(source, { withFileTypes: true });
    ({ directory, file } = read.reduce(
      (accumulator: { directory: string[]; file: string[] }, item, index) => {
        if (item.isDirectory()) {
          // 폴더 리스트
          accumulator.directory.push(item.name);
        } else {
          // 파일 리스트
          let filename = item.name;
          if (!options?.isFileExtension) {
            // 확장자 제거
            const arr = filename.split('.');
            if (1 < arr.length) {
              arr.pop();
            }
            filename = arr.join('');
          }
          accumulator.file.push(filename);
        }
        return accumulator;
      },
      { directory: [], file: [] },
    ));
  }

  return { directory, file };
};
