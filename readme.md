# 企业微信群机器人 - 发送照片

这个项目实现了一个企业微信群机器人，用于自动发送照片到指定的微信群。

## 功能介绍

- 使用企业微信机器人的 API 发送照片到群
- 支持照片发送成功后删除本地文件
- 每次发送最多 20 张照片，并在发送 20 张后等待一段时间再继续发送

你可以通过 `.env` 文件配置企业微信机器人的 Webhook URL。

```bash
WEIXIN_BOT_URL=企业微信机器人url
```