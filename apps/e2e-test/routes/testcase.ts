/**
 * 테스트케이스
 */
import path from 'node:path';
import express, { Request, NextFunction, Response } from 'express';

import { getDirectoryFile } from '#/utils/fileSystem';

const router = express.Router();

router.get(
  '/list',
  (request: Request, response: Response, next: NextFunction) => {
    const { file } = getDirectoryFile('headlessbrowser/testcase', {
      isFileExtension: false,
    });

    //return next();
    return response.json({
      data: file,
    });
  },
);

export default router;
