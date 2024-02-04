/**
 * https://levelup.gitconnected.com/set-up-next-js-with-a-custom-express-server-typescript-9096d819da1c
 * https://github.com/troysandal/nextjs-typescript-express-boilerplate
 */
// 'node:' Node.js 기본 내장 모듈
//import fs from 'node:fs';
//import http from 'node:http';
//import https from 'node:https';
import path from 'node:path';
import { parse } from 'node:url';
import os from 'node:os';
import cluster from 'node:cluster';
import express from 'express';
import next from 'next';
import dotenv from 'dotenv-flow'; // Node.js 20 이상 내장됨 ($ node --env-file .env)
import { json, text, urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser'; // req.cookies 객체
//import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
//import helmet from 'helmet'; // 웹 취약성으로부터 서버를 보호해주는 보안 모듈

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
const isDev = process.env.NODE_ENV !== 'production';
const hostname = process.env.NEXT_PUBLIC_SERVICE_HOSTNAME;
const port = Number(process.env.PORT) || 9040;

/**
 * Node.js 클러스터링
 * https://nodejs.org/api/cluster.html
 *
 * cluster.isMaster 는 Node.js v16.0.0 이후 사용 중단
 * cluster.isPrimary 사용 권장
 */
const numCPUs = os.cpus().length;
if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died!`);
  });
} else {
  /**
   * Next.js 를 Express 와 연결 - 같은 포트에서 실행
   */
  const app = next({ dev: isDev, hostname, port });
  const handle = app.getRequestHandler();
  const expressServer = () => {
    // express
    const server = express();

    // https://expressjs.com/ko/guide/behind-proxies.html
    // https://velog.io/@mochafreddo/Express-%EC%95%B1%EC%97%90%EC%84%9C-%ED%94%84%EB%A1%9D%EC%8B%9C-%EC%84%9C%EB%B2%84%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%A0-%EB%95%8C%EC%9D%98-%EB%AC%B8%EC%A0%9C%EC%99%80-%ED%95%B4%EA%B2%B0-%EB%B0%A9%EB%B2%95
    server.set('trust proxy', 1);

    // middleware - 기능요소
    // https://expressjs.com/ko/resources/middleware.html
    //server.use(helmet());
    server.use(express.json()); // json request body 파싱
    server.use(express.urlencoded({ extended: true })); // body-parser
    server.use(cookieParser()); // process.env.COOKIE_SECRET
    server.use(
      cors({
        origin: false,
        credentials: false,
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
      }),
    );
    server.use(express.static(path.join(__dirname, 'public'))); // public 정적 경로

    // middleware - route
    // server.use('/', function (req, res, next) {
    //   return next();
    // });
    // server.get('*', (req, res) => {
    //   return handle(req, res);
    // });
    // server.post('*', (req, res) => {
    //   return handle(req, res);
    // });
    server.get('/', function (req, res, next) {
      const { page = '' }: any = req.params || {};
      const { host = '' }: any = req.headers || {};
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      console.log('[server] pathname', pathname);

      // TODO: 추후 변경 필요
      return res.redirect('/project1');
    });
    server.all('*', (req, res) => {
      return handle(req, res);
    });

    // error 처리
    server.once('error', error => {
      console.error('[server]', error);
      process.exit(1);
    });

    // http 서버실행
    // http
    //   .createServer()
    //   .listen(port, () =>
    //     console.log(`[server] Server running on port ${port}`),
    //   );
    server.listen(port, () =>
      console.log(`[server] Server running on port ${port}`),
    );

    // https 서버실행 (로컬에서만 설정)
    // if (isDev) {
    //   const portSSL = parseInt(process.env.PORT_SSL, 10) || 3443;
    //   const options = {
    //     key: fs.readFileSync('cert/localhost-key.pem'),
    //     cert: fs.readFileSync('cert/localhost.pem'),
    //   };
    //   https.createServer(options, server).listen(portSSL, err => {
    //     if (err) throw err;
    //     console.log(`[server] Server running on port ${portSSL}`);
    //   });
    // }
  };
  app.prepare().then(expressServer);
}
