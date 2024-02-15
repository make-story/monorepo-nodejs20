# 해당 스테이지는 deps 라고 명명했으며, 이 과정에서는 프로젝트 빌드에 필요한 package.json, package-lock.json 을 설치해서 node_modules 를 생성한다.
FROM node:18.12.0-alpine3.16 as deps

WORKDIR /app

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

RUN npm ci

# build 단계에서는 deps 에서 생성한 node_modules 를 복사해서 사용한다.
FROM node:18.12.0-alpine3.16 as build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . ./

RUN npm run build

# 마지막으로 runner 단계를 만들어서 standalone 으로 만들어진 Next.js 를 실행한다.
FROM node:18.12.0-alpine3.16 as runner

COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

EXPOSE 3000

ENTRYPOINT ["node", "server.js"]