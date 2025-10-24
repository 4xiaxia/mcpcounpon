# MCP Public Promo API 文档

## 概述
- **接口基准地址**：`http://{host}`
- **认证方式**：无需认证（`Auth: none`）
- **数据格式**：请求与响应均为 `application/json`
- **字符编码**：UTF-8

## 通用字段说明
| 字段名 | 类型 | 说明 |
| ------ | ---- | ---- |
| `code` | `integer` | 业务状态码，`200` 表示成功 |
| `msg`  | `string`  | 错误说明，仅在异常时返回 |
| `detail` | `string` | 上游错误详情，可选 |

## 接口列表

### 1. 公共优惠列表
- **接口地址**：`GET /api/mcp/jutuike/public_promo_list`
- **功能描述**：返回预设活动目录的全部活动，并附带实时生成的推广链接。
- **请求参数**：无
- **响应示例**：
```json
{
  "code": 200,
  "data": [
    {
      "activityType": "meituan_air_train_school",
      "activityName": "美团机票火车票开学季福利卷",
      "actId": "48",
      "category": "热门优惠（机票/火车票）",
      "desc": "美团官方机票火车票优惠，含开学季专属福利",
      "link": "https://example.com/xxx",
      "miniAppLink": {
        "appId": "xxxx",
        "path": "pages/index",
        "query": "id=48"
      }
    }
  ]
}
```
- **错误码**：
  - `500`：服务器内部错误或上游接口不可用

### 2. 公共优惠筛选查询
- **接口地址**：`GET /api/mcp/jutuike/public_promo_search`
- **功能描述**：根据可选条件筛选活动目录，返回匹配活动及聚推客实时链接。
- **请求参数**：
| 参数名 | 位置 | 类型 | 是否必填 | 说明 |
| ------ | ---- | ---- | -------- | ---- |
| `category` | Query | `string` | 否 | 按活动分类模糊匹配 |
| `activityType` | Query | `string` | 否 | 按活动类型精确匹配 |
| `keyword` | Query | `string` | 否 | 按名称或描述关键词模糊匹配 |

- **响应示例（成功）**：
```json
{
  "code": 200,
  "filtersApplied": {
    "category": "外卖",
    "activityType": "meituan_waimai_cps",
    "keyword": "外卖"
  },
  "data": [
    {
      "activityType": "meituan_waimai_cps",
      "activityName": "美团外卖超级券",
      "actId": "1",
      "category": "外卖类活动",
      "desc": "美团外卖 领券不亏",
      "link": "https://example.com/xxx",
      "miniAppLink": {}
    }
  ]
}
```
- **错误码**：
  - `404`：没有匹配的活动
  - `500`：服务器内部错误或上游接口不可用

### 3. 单个优惠详情
- **接口地址**：`GET /api/mcp/jutuike/get_promo`
- **功能描述**：根据 `actId` 获取单个活动的详细推广信息。
- **请求参数**：
| 参数名 | 位置 | 类型 | 是否必填 | 说明 |
| ------ | ---- | ---- | -------- | ---- |
| `actId` | Query | `string` | 是 | 聚推客活动 ID |

- **响应示例（成功）**：
```json
{
  "code": 200,
  "data": {
    "activity": {
      "activityType": "meituan_waimai_cps",
      "activityName": "美团外卖超级券",
      "actId": "1",
      "category": "外卖类活动",
      "desc": "美团外卖 领券不亏"
    },
    "realLinks": {
      "promoH5": "https://example.com/h5",
      "deeplink": "meituan://xxx",
      "miniApp": {}
    }
  }
}
```
- **错误码**：
  - `400`：缺少 `actId`
  - `404`：活动不存在
  - `502`：上游聚推客返回错误
  - `500`：服务器内部错误

## 响应参数说明

### 1. Activity
| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `activityType` | `string` | 聚推客活动类型标识 |
| `activityName` | `string` | 活动名称 |
| `actId` | `string` | 聚推客活动 ID |
| `category` | `string` | 活动分类 |
| `desc` | `string` | 活动描述 |

### 2. ActivityWithLinks
| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `link` | `string` | 活动 H5 链接 |
| `miniAppLink` | `object` | 小程序跳转参数，原样回传 |

### 3. PromotionDetail
| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `activity` | `Activity` | 活动基础信息 |
| `realLinks` | `object` | 聚推客返回的真实推广链接 |
| `realLinks.promoH5` | `string` | H5 链接 |
| `realLinks.deeplink` | `string` | 深度链接 |
| `realLinks.miniApp` | `object` | 小程序参数 |

## 错误响应结构
```json
{
  "code": 500,
  "msg": "Server Error",
  "detail": "Upstream timeout"
}
```
