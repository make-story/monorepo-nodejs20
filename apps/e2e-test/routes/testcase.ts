/**
 * 테스트케이스
 * exporess, socket 라우팅 관리
 */
import path from 'node:path';
import express, { Request, NextFunction, Response } from 'express';

const router = express.Router();

router.get('*', (request: Request, response: Response, next: NextFunction) => {
  console.log('request!!!!', request.baseUrl);
  // 테스트케이스 리스트 반환
  // ...

  //return next();
  return response.json([]);
});

export default router;
