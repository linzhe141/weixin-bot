# 企业微信群机器人 - 发送图片

这个项目实现了一个企业微信群机器人，用于自动发送图片到对应的微信群。

> [!IMPORTANT]
> 需要 docker 和 pnpm

## 功能介绍

- 使用企业微信机器人的 API 发送图片到群
- 支持`zip`压缩包
- 支持`heic`文件格式的图片
- 后台每次发送最多 20 张图片，并在发送 20 张后等待一段时间再继续发送（微信 api 限制 😈）

## 安装

- 1、`clone`该仓库，并通过`pnpm install`安装依赖，安装成功后执行`pnpm run build`进行打包。
- 2、通过在项目根目录新建 `.env` 文件配置企业微信机器人的 Webhook URL。

  ```
  WEIXIN_BOT_URL=企业微信机器人url;
  ```

- 3、在项目根目录执行`docker-compose build`，构建镜像。
- 4、在项目根目录执行`docker-compose up -d`，启动对应相关容器，访问`http://localhost:4534`即可通过 web 上传图片，支持`zip`压缩包。
