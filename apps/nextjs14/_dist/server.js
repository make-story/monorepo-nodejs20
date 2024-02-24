"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * https://levelup.gitconnected.com/set-up-next-js-with-a-custom-express-server-typescript-9096d819da1c
 * https://github.com/troysandal/nextjs-typescript-express-boilerplate
 */
// 'node:' Node.js 기본 내장 모듈
//import fs from 'node:fs';
//import http from 'node:http';
//import https from 'node:https';
var node_path_1 = __importDefault(require("node:path"));
var node_url_1 = require("node:url");
var node_os_1 = __importDefault(require("node:os"));
var node_cluster_1 = __importDefault(require("node:cluster"));
var express_1 = __importDefault(require("express"));
var next_1 = __importDefault(require("next"));
var dotenv_flow_1 = __importDefault(require("dotenv-flow")); // Node.js 20 이상 내장됨 ($ node --env-file .env)
//import { json, text, urlencoded } from 'body-parser';
var cookie_parser_1 = __importDefault(require("cookie-parser")); // req.cookies 객체
//import { createProxyServer } = from 'http-proxy';
//import { createProxyMiddleware } from 'http-proxy-middleware';
var cors_1 = __importDefault(require("cors"));
//import helmet from 'helmet'; // 웹 취약성으로부터 서버를 보호해주는 보안 모듈
/**
 * node 예외처리
 * UncatchedException 이 발생하면 Node.js 인스턴스가 죽음(서버다운) 방지
 * https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly
 */
process.on('uncaughtException', function (error) {
    console.log('uncaughtException ', error);
});
/**
 * env 환경변수
 *
 * dotenv 적용 우선순위
 * https://www.npmjs.com/package/dotenv-flow#variables-overwritingpriority
 */
dotenv_flow_1.default.config();
console.log('NODE_ENV', process.env.NODE_ENV);
console.log('APP_ENV', process.env.APP_ENV);
var isDev = process.env.NODE_ENV !== 'production';
var hostname = process.env.NEXT_PUBLIC_SERVICE_HOSTNAME || 'http://localhost';
var port = Number(process.env.PORT) || 9040;
/**
 * Node.js 클러스터링
 * https://nodejs.org/api/cluster.html
 *
 * cluster.isMaster 는 Node.js v16.0.0 이후 사용 중단
 * cluster.isPrimary 사용 권장
 */
var isCluster = (_a = process.env.IS_CLUSTER) !== null && _a !== void 0 ? _a : false;
var numCPUs = node_os_1.default.cpus().length;
if (isCluster && node_cluster_1.default.isPrimary) {
    for (var i = 0; i < numCPUs; i++) {
        node_cluster_1.default.fork();
    }
    node_cluster_1.default.on('exit', function (worker, code, signal) {
        console.log("worker ".concat(worker.process.pid, " died!"));
    });
}
else {
    /**
     * Next.js 를 Express 와 연결 - 같은 포트에서 실행
     */
    var app = (0, next_1.default)({ dev: isDev, hostname: hostname, port: port });
    var handle_1 = app.getRequestHandler();
    var expressServer = function () {
        // express
        var server = (0, express_1.default)();
        // https://expressjs.com/ko/guide/behind-proxies.html
        // https://velog.io/@mochafreddo/Express-%EC%95%B1%EC%97%90%EC%84%9C-%ED%94%84%EB%A1%9D%EC%8B%9C-%EC%84%9C%EB%B2%84%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%A0-%EB%95%8C%EC%9D%98-%EB%AC%B8%EC%A0%9C%EC%99%80-%ED%95%B4%EA%B2%B0-%EB%B0%A9%EB%B2%95
        server.set('trust proxy', 1);
        /*server.use(
          createProxyMiddleware(['/api/v1'], {
            target: process.env.PROXY_API_URI,
            changeOrigin: true,
            logLevel: 'debug',
            //pathRewrite: {},
            onProxyReq(proxyReq: any) {
              Object.keys(proxyReq.getHeaders()).forEach(key => {
                console.log('HTTP Header key', key);
              });
            },
          }),
        );*/
        // middleware - 기능요소
        // https://expressjs.com/ko/resources/middleware.html
        //server.use(helmet());
        server.use(express_1.default.json()); // json request body 파싱
        server.use(express_1.default.urlencoded({ extended: true })); // body-parser
        server.use((0, cookie_parser_1.default)()); // process.env.COOKIE_SECRET
        server.use((0, cors_1.default)({
            origin: false,
            credentials: false,
            optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        }));
        server.use(express_1.default.static(node_path_1.default.join(__dirname, 'public'))); // public 정적 경로
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
            var _a = (req.params || {}).page, page = _a === void 0 ? '' : _a;
            var _b = (req.headers || {}).host, host = _b === void 0 ? '' : _b;
            var parsedUrl = (0, node_url_1.parse)(req.url, true);
            var pathname = parsedUrl.pathname, query = parsedUrl.query;
            console.log('[server] pathname', pathname);
            // TODO: 추후 변경 필요
            return res.redirect('/project1');
        });
        server.all('*', function (req, res) {
            return handle_1(req, res);
        });
        // error 처리
        server.once('error', function (error) {
            console.error('[server]', error);
            process.exit(1);
        });
        // http 서버실행
        // http
        //   .createServer()
        //   .listen(port, () =>
        //     console.log(`[server] Server running on port ${port}`),
        //   );
        server.listen(port, function () {
            return console.log("[server] Server running on port ".concat(port));
        });
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
