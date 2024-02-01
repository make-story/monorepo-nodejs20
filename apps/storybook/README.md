# 디자인 시스템 - 스토리북 (StoryBook)

```json
{
  "name": "@ysm/storybook",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "build": "",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  "dependencies": {
    "@ysm/ui": "*",
    "@types/node": "20.3.1",
    "@types/react": "18.2.8",
    "@types/react-dom": "18.2.5",
    "next": "14.0.3",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "typescript": "5.1.3",
    "@storybook/addon-essentials": "^7.0.26",
    "@storybook/addon-interactions": "^7.0.26",
    "@storybook/addon-links": "^7.0.26",
    "@storybook/blocks": "^7.0.26",
    "@storybook/nextjs": "^7.0.26",
    "@storybook/react": "^7.0.26",
    "@storybook/testing-library": "^0.0.14-next.2",
    "eslint-plugin-storybook": "^0.6.12",
    "storybook": "^7.0.26"
  },
  "devDependencies": {}
}
```

# sharp 에러

```
Exit code: 1
Command: (node install/libvips && node install/dll-copy && prebuild-install) || (node install/can-compile && node-gyp rebuild && node install/dll-copy)

...
Output:
sharp: Downloading https://github.com/lovell/sharp-libvips/releases/download/v8.14.5/libvips-8.14.5-darwin-arm64v8.tar.br
node:fs:3003
  binding.copyFile(
          ^

Error: EACCES: permission denied, copyfile ...
```

해당 파일 수동으로 복사 (sudo 명령)

```
$ sudo cp '/var/folders/kb/h8rdmm790z741796_d2xs_x40000gn/T/39487-libvips-8.14.5-darwin-arm64v8.tar.br' '/Users/사용자디렉토리/.npm/_libvips/libvips-8.14.5-darwin-arm64v8.tar.br'
```
