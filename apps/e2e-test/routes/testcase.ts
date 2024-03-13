/**
 * 테스트케이스
 */
import path from 'node:path';
import express, { Request, NextFunction, Response } from 'express';

import { getDirectoryFile } from '#/utils/fileSystem';

const router = express.Router();

// category 반환
router.get(
  '/category',
  (request: Request, response: Response, next: NextFunction) => {
    const { directory } = getDirectoryFile('headlessbrowser/testcase');

    //return next();
    return response.json({
      data: directory,
    });
  },
);

// category 의 테스트케이스 리스트 반환
router.get(
  '/:category/list',
  (request: Request, response: Response, next: NextFunction) => {
    const { category } = request.params;
    const { file } = getDirectoryFile(`headlessbrowser/testcase/${category}`, {
      isFileExtension: false,
    });

    //return next();
    return response.json({
      data: file,
    });
  },
);

export default router;
