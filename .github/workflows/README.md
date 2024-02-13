# AWS EC2와 Github Actions로 프론트엔드 CI/CD 구축하기

https://velog.io/@zinukk/AWS-EC2%EC%99%80-Github-Actions%EB%A1%9C-%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-CICD-%EA%B5%AC%EC%B6%95%ED%95%98%EA%B8%B0-1

https://velog.io/@zinukk/AWS-EC2%EC%99%80-Github-Actions%EB%A1%9C-%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-CICD-%EA%B5%AC%EC%B6%95%ED%95%98%EA%B8%B0-2-ln8frbiw

https://velog.io/@zinukk/AWS-EC2%EC%99%80-Github-Actions%EB%A1%9C-%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-CICD-%EA%B5%AC%EC%B6%95%ED%95%98%EA%B8%B0-3

https://velog.io/@zinukk/AWS-EC2%EC%99%80-Github-Actions%EB%A1%9C-%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-CICD-%EA%B5%AC%EC%B6%95%ED%95%98%EA%B8%B0-4

# deploy.yml

프로젝트 최상위경로 '.github/workflows/deploy.yml' 생성

`주의! GitHub "Settings → Developer Settings → Personal Access Token → 접속 범위를 변경할 Access token 클릭 → workflow 부분 체크" 확인필요! 파일 수정 후 푸시가 안될 수 있음 (refusing to allow an OAuth App to create or update workflow)`

main 브랜치에 push 가 발생하면 Github Actions 가 이를 감지하고 동작을 시작

`yml 파일에 '#' 주석은 제거한 후 올려야 한다!`

```yml
name: Deploy
on:
  push:
    branches:
      - main #어디로 푸시했을 때 감지할 건지
jobs:
  build:
    runs-on: ubuntu-20.04 #우분투 버전 체크
    steps:
      - name: Checkout source code.
        uses: actions/checkout@v2
      - name: Check Node v
        run: node -v
      - name: Install Dependencies
        run: yarn install --frozen-lockfile
      - name: Build
        run: yarn build
      - name: zip create
        run: zip -qq -r ./build.zip .
        shell: bash
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}
      - name: Upload to S3
        run: |
          aws s3 cp --region ap-northeast-2 ./build.zip s3://mytamra-bucket/build.zip #본인 버킷 이름으로 수정
      - name: Deploy
        run: aws deploy create-deployment
          --application-name myTamra-codeDeploy #본인 코드디플로이로 이름 변경
          --deployment-config-name CodeDeployDefault.AllAtOnce
          --deployment-group-name myTamra-codeDeploy-group #본인 코드디플로이그룹으로 변경
          --s3-location bucket=mytamra-bucket,bundleType=zip,key=build.zip #본인 버킷이름으로 변경
```
