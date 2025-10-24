# MCP Public Promo 后端部署指南

本目录提供一份独立可用的 MCP 服务端，可直接部署给外部模型或客户端使用。所有接口均无需鉴权，基于 HTTP/JSON。

## 目录结构
```
/
├─ README.md              # 本说明
├─ package.json           # npm 依赖清单
└─ src/
   └─ app.js              # Express 服务端实现
```

## 本地快速启动
```bash

npm install
node src/app.js
```
启动后终端输出：
```
MCP Public Promo Server is running on http://localhost:8000
```

## 服务端点
| 方法 | 路径 | 说明 |
| ---- | ---- | ---- |
| GET  | `/.well-known/ai-plugin.json` | MCP 元信息，无需鉴权 |
| GET  | `/openapi.yaml` | OpenAPI 3.0 规格说明 |
| GET  | `/api/mcp/jutuike/public_promo_list` | 公共优惠列表 |
| GET  | `/api/mcp/jutuike/get_promo?actId=...` | 单个优惠详情 |

所有响应均为 JSON，前端或客户端可直接调用。

## 对外开放
将该目录部署到任何支持 Node.js 的平台（如 Render、Railway、VPS）。部署完成后，将生成的域名提供给调用方，并让其访问 `https://域名/.well-known/ai-plugin.json` 与 `https://域名/openapi.yaml` 即可按 MCP 标准对接。

