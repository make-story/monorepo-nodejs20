/**
 * 테스트케이스
 * exporess, socket 라우팅 관리
 */
import path from 'node:path';
import express, { Request, NextFunction, Response } from 'express';

import WebSocketMiddleware from '../websocket/index';

const router = express.Router();

router.get('*', (request: Request, response: Response, next: NextFunction) => {
  // 테스트케이스 리스트 반환
  return response.json([]);
});

const socketRouter = () => {
  // ...
};

export { socketRouter };
export default router;
