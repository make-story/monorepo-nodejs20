/**
 * 서버 실행 파일
 */
// 'node:' Node.js 기본 내장 모듈
import path from 'node:path';
import { parse } from 'node:url';
import os from 'node:os';
import cluster from 'node:cluster';
import express, { Request, NextFunction, Response } from 'express';
import dotenv from 'dotenv'; // Node.js 20 이상 내장됨 ($ node --env-file .env)
import { json, text, urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';
//import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

/**
 * node 예외처리
 * UncatchedException 이 발생하면 Node.js 인스턴스가 죽음(서버다운) 방지
 * https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly
 */
process.on('uncaughtException', error => {
  console.log('uncaughtException ', error);
});

/**
 * env 환경변수
 *
 * dotenv 적용 우선순위
 * https://www.npmjs.com/package/dotenv-flow#variables-overwritingpriority
 */
dotenv.config();
console.log('NODE_ENV', process.env.NODE_ENV);
console.log('APP_ENV', process.env.APP_ENV);
const isProd: boolean = process.env.NODE_ENV === 'production';
const port = isProd && process.env.PORT ? process.env.PORT : 9030;

/**
 * express
 */
const app = express();

// express 프록시 환경
// https://expressjs.com/ko/guide/behind-proxies.html
// https://velog.io/@mochafreddo/Express-%EC%95%B1%EC%97%90%EC%84%9C-%ED%94%84%EB%A1%9D%EC%8B%9C-%EC%84%9C%EB%B2%84%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%A0-%EB%95%8C%EC%9D%98-%EB%AC%B8%EC%A0%9C%EC%99%80-%ED%95%B4%EA%B2%B0-%EB%B0%A9%EB%B2%95
app.set('trust proxy', 1);

// 미들웨어 설정
// https://expressjs.com/ko/resources/middleware.html
app.use([json(), urlencoded({ extended: false }), text(), cookieParser()]);
app.use(
  cors({
    origin: false,
    credentials: false,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  }),
);
app.use(express.static(path.join(__dirname, 'public'))); // public 정적 경로
app.use((request: Request, response: Response, next: NextFunction) => {
  // 쿠키 세팅 또는 헤더값 인코딩/디코딩
  return next();
});

// 라우팅
app.use(
  '/api/v1',
  async (request: Request, response: Response, next: NextFunction) => {
    console.log('request!!!!', request.baseUrl);

    // axios
    // ...

    return next();
  },
);
app.use('*', (request: Request, response: Response) => response.send('TEST'));

// 프록시
/*app.use(
  '/*',
  createProxyMiddleware({
    target: 'http://localhost:9031',
    changeOrigin: true,
    secure: false,
  }),
);*/

// 개발/운영환경 SPA HTML (빌드된 HTML 로드)
/*app.use('/*', (request: Request, response: Response) =>
  response.sendFile(resolve(process.cwd(), '../client/build/index.html')),
);*/

// error 처리
app.once('error', error => {
  console.error('[server]', error);
  process.exit(1);
});

// 서버 실행
app.listen(port, () => console.log(`[server] Server running on port ${port}`));
