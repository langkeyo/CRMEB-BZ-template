---
title: 团购项目
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# 团购项目

Base URLs:

# Authentication

# 张帅坤

## GET 获取商品列表

GET /adminapi/group/combination/goods_list

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page|query|integer| 否 |页码|
|limit|query|integer| 否 |每页数量|
|title|query|string| 是 |商品名称|
|Authori-Zation|header|string| 否 |none|
|authori-zation|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 新增拼团商品

POST /adminapi/group/combination/create

> Body 请求参数

```yaml
product_id: 0
people: 2
price: 0
cost: 0
stock: 0
sort: 0
is_host: 0
is_show: 1
start_time: "0"
stop_time: "0"
effective_time: 0
min_buy_num: 1
max_buy_num: 0
quota: 0
limit_buy: 0
rule_desc: ""

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authori-Zation|header|string| 否 |none|
|authori-zation|header|string| 否 |none|
|body|body|object| 否 |none|
|» product_id|body|integer| 否 |商品ID（必填）|
|» people|body|integer| 否 |成团人数（默认2人）|
|» price|body|integer| 否 |拼团价格（必填）|
|» cost|body|integer| 否 |成本价格（默认0）|
|» stock|body|integer| 否 |库存数量（必填）|
|» sort|body|integer| 否 |排序值（默认0）|
|» is_host|body|integer| 否 |是否推荐（默认0-否）|
|» is_show|body|integer| 否 |是否上架（默认1-是）|
|» start_time|body|string| 否 |开始时间（必填，时间戳，Y-m-d H:i）|
|» stop_time|body|string| 否 |结束时间（必填，时间戳，Y-m-d H:i）|
|» effective_time|body|integer| 否 |有效时间（必填，秒）|
|» min_buy_num|body|integer| 否 |最小购买数量（默认1）|
|» max_buy_num|body|integer| 否 |最大购买数量（默认0-不限）|
|» quota|body|integer| 否 |限购数量（默认0-不限）|
|» limit_buy|body|integer| 否 |是否限购（默认0-否）|
|» rule_desc|body|string| 是 |规则描述（可选）|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 恢复拼团商品

POST /adminapi/group/combination/restore/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer| 是 |要恢复的商品id|
|Authori-Zation|header|string| 是 |none|
|authori-zation|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取收藏列表

GET /api/group/collect/get

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|type|query|string| 否 |默认为0(0->商品,1->租赁)|
|Authori-Zation|header|string| 否 |none|
|authori-zation|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 添加收藏到列表

POST /api/group/collect/add

> Body 请求参数

```yaml
fav_id: "32"
type: "1"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authori-Zation|header|string| 否 |none|
|authori-zation|header|string| 否 |none|
|body|body|object| 否 |none|
|» fav_id|body|string| 否 |收藏id|
|» type|body|string| 否 |收藏类型(默认为0,0->商品,1->租赁)|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 取消收藏

POST /api/group/collect/del

> Body 请求参数

```yaml
fav_id: "1"
type: "0"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authori-Zation|header|string| 否 |none|
|authori-zation|header|string| 否 |none|
|body|body|object| 否 |none|
|» fav_id|body|string| 否 |收藏id|
|» type|body|string| 否 |收藏类型(默认为0,0->商品,1->租赁)|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取购物车信息

GET /api/group/cart/get

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authori-Zation|header|string| 否 |none|
|authori-zation|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 添加/删除商品到购物车

POST /api/group/cart/update

> Body 请求参数

```yaml
goods_id: "32"
quantity: "1"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authori-Zation|header|string| 否 |none|
|authori-zation|header|string| 否 |none|
|body|body|object| 否 |none|
|» goods_id|body|string| 否 |商品id|
|» quantity|body|string| 否 |商品数量(正数,负数)|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 删除购物车商品

POST /api/group/cart/remove

> Body 请求参数

```yaml
goods_id: "1"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authori-Zation|header|string| 否 |none|
|authori-zation|header|string| 否 |none|
|body|body|object| 否 |none|
|» goods_id|body|string| 否 |商品id|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 张帅坤/管理端-拼团商品

## GET 获取拼团商品列表

GET /adminapi/group/combination/list

管理端获取拼团商品列表，支持筛选、搜索、分页

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page|query|integer| 否 |页码|
|limit|query|integer| 否 |每页数量|
|is_show|query|string| 否 |显示状态|
|store_name|query|string| 否 |关键字搜索|
|start_status|query|string| 否 |活动状态|
|is_host|query|string| 否 |是否推荐|
|type|query|string| 否 |列表类型|
|Authori-Zation|header|string| 是 |none|
|authori-zation|header|string| 否 |none|

#### 枚举值

|属性|值|
|---|---|
|is_show|0|
|is_show|1|
|is_show||
|start_status|-1|
|start_status|0|
|start_status|1|
|start_status||
|is_host|0|
|is_host|1|
|is_host||
|type|hot|
|type||

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取拼团商品详情

GET /adminapi/group/combination/info/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer| 是 |拼团商品ID|
|Authori-Zation|header|string| 是 |none|
|authori-zation|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取拼团统计数据

GET /adminapi/group/combination/statistics

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authori-Zation|header|string| 是 |none|
|authori-zation|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 更新拼团商品

POST /adminapi/group/combination/update/{id}

支持更新多个字段，只需传入要修改的字段

> Body 请求参数

```yaml
is_show: 0
is_host: 0
sort: 0
people: 0
price: 0
cost: 0
stock: 0
start_time: 0
stop_time: 0
effective_time: 0
min_buy_num: 0
max_buy_num: 0
quota: 0
limit_buy: 0
rule_desc: ""

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer| 是 |拼团商品ID|
|Authori-Zation|header|string| 是 |none|
|authori-zation|header|string| 否 |none|
|body|body|object| 否 |none|
|» is_show|body|integer| 否 |显示状态|
|» is_host|body|integer| 否 |推荐状态|
|» sort|body|integer| 否 |排序值|
|» people|body|integer| 否 |成团人数|
|» price|body|number| 否 |拼团价格|
|» cost|body|number| 否 |成本价格|
|» stock|body|integer| 否 |库存数量|
|» start_time|body|integer| 否 |开始时间戳|
|» stop_time|body|integer| 否 |结束时间戳|
|» effective_time|body|integer| 否 |有效时间(秒)|
|» min_buy_num|body|integer| 否 |最小购买数量|
|» max_buy_num|body|integer| 否 |最大购买数量|
|» quota|body|integer| 否 |限购数量|
|» limit_buy|body|integer| 否 |是否限购|
|» rule_desc|body|string| 否 |规则描述|

#### 枚举值

|属性|值|
|---|---|
|» is_show|0|
|» is_show|1|
|» is_host|0|
|» is_host|1|
|» limit_buy|0|
|» limit_buy|1|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## DELETE 删除拼团商品

DELETE /adminapi/group/combination/del/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer| 是 |拼团商品ID|
|Authori-Zation|header|string| 是 |none|
|authori-zation|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 张帅坤/管理端-优惠券管理

## GET 获取优惠券列表

GET /adminapi/group/coupons/list

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|name|query|string| 否 |优惠券名称搜索|
|type|query|integer| 否 |优惠券类型|
|status|query|integer| 否 |状态|
|time|query|array[string]| 否 |时间范围|
|page|query|integer| 否 |页码|
|limit|query|integer| 否 |每页数量|
|Authori-Zation|header|string| 否 |none|
|authori-zation|header|string| 否 |none|

#### 枚举值

|属性|值|
|---|---|
|type|1|
|type|2|
|status|0|
|status|1|

> 返回示例

> 200 Response

```json
{
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取优惠券详情

GET /adminapi/group/coupons/info/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer| 是 |优惠券ID|
|Authori-Zation|header|string| 否 |none|
|authori-zation|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取优惠券统计数据

GET /adminapi/group/coupons/statistics

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authori-Zation|header|string| 否 |none|
|authori-zation|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 优惠券使用记录

GET /adminapi/group/coupons/usage_records

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|coupon_id|query|integer| 否 |优惠券ID|
|user_id|query|integer| 否 |用户ID|
|status|query|integer| 否 |状态|
|source|query|integer| 否 |来源|
|time|query|array[string]| 否 |时间范围|
|Authori-Zation|header|string| 否 |none|
|authori-zation|header|string| 否 |none|

#### 枚举值

|属性|值|
|---|---|
|status|0|
|status|1|
|status|2|
|source|1|
|source|2|
|source|3|

> 返回示例

> 200 Response

```json
{
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 创建优惠券

POST /adminapi/group/coupons/save

> Body 请求参数

```yaml
name: test
type: 1
discount_amount: 10
discount_rate: 0
min_amount: 0
start_time: 2025-07-01 00:00:00
end_time: 2025-07-01 23:59:59
total_quantity: 10
per_user_limit: 1
status: 1
visibility_type: 2
allowed_users: 4,6

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authori-Zation|header|string| 否 |none|
|authori-zation|header|string| 否 |none|
|body|body|object| 否 |none|
|» name|body|string| 是 |优惠卷名称|
|» type|body|integer| 是 |优惠卷类型(1-满减券，2-折扣券)|
|» discount_amount|body|integer| 是 |满减金额|
|» discount_rate|body|integer| 是 |折扣率(type=2时使用，0.8表示8折)|
|» min_amount|body|integer| 是 |最低消费|
|» start_time|body|string| 是 |开始时间|
|» end_time|body|string| 是 |到期时间|
|» total_quantity|body|integer| 是 |发行总数|
|» per_user_limit|body|integer| 是 |用户限制领取数量|
|» status|body|integer| 是 |优惠卷状态(0-停用，1-启用)|
|» visibility_type|body|integer| 是 |可见类型(1-公开，2-指定用户，4-新用户专享)|
|» allowed_users|body|string| 是 |可见用户(支持批量如1,2)|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 发放优惠券给用户

POST /adminapi/group/coupons/give

> Body 请求参数

```json
{
  "coupon_id": 0,
  "user_ids": "string",
  "source": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authori-Zation|header|string| 否 |none|
|authori-zation|header|string| 否 |none|
|body|body|object| 否 |none|
|» coupon_id|body|integer| 是 |优惠券ID|
|» user_ids|body|string| 是 |用户ID列表|
|» source|body|integer| 否 |发放来源|

#### 枚举值

|属性|值|
|---|---|
|» source|1|
|» source|2|
|» source|3|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 更新优惠券

POST /adminapi/group/coupons/update/{id}

> Body 请求参数

```yaml
{}

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer| 是 |优惠券ID|
|Authori-Zation|header|string| 否 |none|
|authori-zation|header|string| 否 |none|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## DELETE 删除优惠券

DELETE /adminapi/group/coupons/del/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer| 是 |优惠券ID|
|Authori-Zation|header|string| 否 |none|
|authori-zation|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 张帅坤/用户端-优惠券

## GET 获取可用优惠券列表

GET /api/group/coupons/available/list

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|name|query|string| 否 |优惠券名称搜索|
|type|query|integer| 否 |优惠券类型(1-满减券，2-折扣券)|
|page|query|integer| 否 |页码(默认1)|
|limit|query|integer| 否 |每页数量(默认20)|
|Authori-Zation|header|string| 否 |none|
|authori-zation|header|string| 否 |none|

#### 枚举值

|属性|值|
|---|---|
|type|1|
|type|2|

> 返回示例

> 200 Response

```json
{
  "data": [
    {
      "is_received": true,
      "received_count": 0
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取优惠券详情

GET /api/group/coupons/detail/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer| 是 |优惠券ID|
|Authori-Zation|header|string| 否 |none|
|authori-zation|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "data": {
    "is_received": true,
    "received_count": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取我的优惠券列表

GET /api/group/coupons/my/list

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|status|query|integer| 否 |状态筛选|
|page|query|integer| 否 |页码|
|limit|query|integer| 否 |每页数量|
|Authori-Zation|header|string| 否 |none|
|authori-zation|header|string| 否 |none|

#### 枚举值

|属性|值|
|---|---|
|status|0|
|status|1|
|status|2|

> 返回示例

> 200 Response

```json
{
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取订单可用优惠券

GET /api/group/coupons/order/available

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|order_amount|query|number(float)| 是 |订单金额|
|Authori-Zation|header|string| 否 |none|
|authori-zation|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "data": {
    "list": [
      {}
    ],
    "count": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 领取优惠券

POST /api/group/coupons/receive

> Body 请求参数

```yaml
coupon_id: 1

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authori-Zation|header|string| 否 |none|
|authori-zation|header|string| 否 |none|
|body|body|object| 否 |none|
|» coupon_id|body|integer| 否 |优惠券ID|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 张帅坤/用户端-拼团商品

## GET 获取拼团商品列表

GET /api/group/combination/list

用户端获取拼团商品列表，支持筛选、搜索、排序

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page|query|integer| 否 |页码|
|limit|query|integer| 否 |每页数量|
|keyword|query|string| 否 |搜索关键词|
|is_host|query|string| 否 |是否推荐|
|price_min|query|number| 否 |最低价格|
|price_max|query|number| 否 |最高价格|
|people|query|integer| 否 |成团人数|
|order|query|string| 否 |排序方式|
|Authori-Zation|header|string| 否 |none|
|authori-zation|header|string| 否 |none|

#### 枚举值

|属性|值|
|---|---|
|is_host|0|
|is_host|1|
|is_host||
|order|sales_desc|
|order|price_asc|
|order|price_desc|
|order|time_desc|
|order||

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "list": [
      {
        "id": 0,
        "product_id": 0,
        "title": "string",
        "image": "string",
        "description": "string",
        "group_price": "string",
        "original_price": "string",
        "save_amount": "string",
        "people": 0,
        "sales": 0,
        "is_host": 0,
        "start_time": 0,
        "stop_time": 0,
        "start_time_text": "string",
        "stop_time_text": "string",
        "time_left": {
          "total_seconds": 0,
          "days": 0,
          "hours": 0,
          "minutes": 0,
          "seconds": 0,
          "text": "string"
        },
        "status": 0,
        "status_text": "string"
      }
    ],
    "count": 0,
    "page": 0,
    "limit": 0,
    "total_page": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[UserCombinationListResponse](#schemausercombinationlistresponse)|

## GET 获取拼团商品详情

GET /api/group/combination/detail/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer| 是 |拼团商品ID|
|Authori-Zation|header|string| 否 |none|
|authori-zation|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "id": 0,
    "product_id": 0,
    "title": "string",
    "image": "string",
    "description": "string",
    "group_price": "string",
    "original_price": "string",
    "save_amount": "string",
    "people": 0,
    "sales": 0,
    "is_host": 0,
    "start_time": 0,
    "stop_time": 0,
    "start_time_text": "string",
    "stop_time_text": "string",
    "time_left": {
      "total_seconds": 0,
      "days": 0,
      "hours": 0,
      "minutes": 0,
      "seconds": 0,
      "text": "string"
    },
    "status": 0,
    "status_text": "string",
    "images": [
      "string"
    ],
    "effective_time": 0,
    "effective_time_text": "string",
    "min_buy_num": 0,
    "max_buy_num": 0,
    "quota": 0,
    "limit_buy": 0,
    "rule_desc": "string",
    "add_time": 0,
    "add_time_text": "string",
    "recommend_list": [
      {
        "id": 0,
        "product_id": 0,
        "title": "string",
        "image": "string",
        "description": "string",
        "group_price": "string",
        "original_price": "string",
        "save_amount": "string",
        "people": 0,
        "sales": 0,
        "is_host": 0,
        "start_time": 0,
        "stop_time": 0,
        "start_time_text": "string",
        "stop_time_text": "string",
        "time_left": {},
        "status": 0,
        "status_text": "string"
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[UserCombinationDetailResponse](#schemausercombinationdetailresponse)|

## GET 获取推荐拼团商品

GET /api/group/combination/recommend

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authori-Zation|header|string| 否 |none|
|authori-zation|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": [
    {
      "id": 0,
      "product_id": 0,
      "title": "string",
      "image": "string",
      "description": "string",
      "group_price": "string",
      "original_price": "string",
      "save_amount": "string",
      "people": 0,
      "sales": 0,
      "is_host": 0,
      "start_time": 0,
      "stop_time": 0,
      "start_time_text": "string",
      "stop_time_text": "string",
      "time_left": {
        "total_seconds": 0,
        "days": 0,
        "hours": 0,
        "minutes": 0,
        "seconds": 0,
        "text": "string"
      },
      "status": 0,
      "status_text": "string"
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[UserCombinationRecommendResponse](#schemausercombinationrecommendresponse)|

# 数据模型

<h2 id="tocS_TimeLeft">TimeLeft</h2>

<a id="schematimeleft"></a>
<a id="schema_TimeLeft"></a>
<a id="tocStimeleft"></a>
<a id="tocstimeleft"></a>

```json
{
  "total_seconds": 0,
  "days": 0,
  "hours": 0,
  "minutes": 0,
  "seconds": 0,
  "text": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total_seconds|integer|false|none||总剩余秒数|
|days|integer|false|none||剩余天数|
|hours|integer|false|none||剩余小时|
|minutes|integer|false|none||剩余分钟|
|seconds|integer|false|none||剩余秒数|
|text|string|false|none||剩余时间文本|

<h2 id="tocS_UserCombinationItem">UserCombinationItem</h2>

<a id="schemausercombinationitem"></a>
<a id="schema_UserCombinationItem"></a>
<a id="tocSusercombinationitem"></a>
<a id="tocsusercombinationitem"></a>

```json
{
  "id": 0,
  "product_id": 0,
  "title": "string",
  "image": "string",
  "description": "string",
  "group_price": "string",
  "original_price": "string",
  "save_amount": "string",
  "people": 0,
  "sales": 0,
  "is_host": 0,
  "start_time": 0,
  "stop_time": 0,
  "start_time_text": "string",
  "stop_time_text": "string",
  "time_left": {
    "total_seconds": 0,
    "days": 0,
    "hours": 0,
    "minutes": 0,
    "seconds": 0,
    "text": "string"
  },
  "status": 0,
  "status_text": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer|false|none||拼团ID|
|product_id|integer|false|none||商品ID|
|title|string|false|none||商品标题|
|image|string|false|none||商品主图|
|description|string|false|none||商品描述|
|group_price|string|false|none||拼团价格|
|original_price|string|false|none||原价|
|save_amount|string|false|none||节省金额|
|people|integer|false|none||成团人数|
|sales|integer|false|none||销量|
|is_host|integer|false|none||是否推荐|
|start_time|integer|false|none||开始时间戳|
|stop_time|integer|false|none||结束时间戳|
|start_time_text|string|false|none||开始时间文本|
|stop_time_text|string|false|none||结束时间文本|
|time_left|[TimeLeft](#schematimeleft)|false|none||none|
|status|integer|false|none||活动状态|
|status_text|string|false|none||状态文本|

<h2 id="tocS_UserCombinationDetail">UserCombinationDetail</h2>

<a id="schemausercombinationdetail"></a>
<a id="schema_UserCombinationDetail"></a>
<a id="tocSusercombinationdetail"></a>
<a id="tocsusercombinationdetail"></a>

```json
{
  "id": 0,
  "product_id": 0,
  "title": "string",
  "image": "string",
  "description": "string",
  "group_price": "string",
  "original_price": "string",
  "save_amount": "string",
  "people": 0,
  "sales": 0,
  "is_host": 0,
  "start_time": 0,
  "stop_time": 0,
  "start_time_text": "string",
  "stop_time_text": "string",
  "time_left": {
    "total_seconds": 0,
    "days": 0,
    "hours": 0,
    "minutes": 0,
    "seconds": 0,
    "text": "string"
  },
  "status": 0,
  "status_text": "string",
  "images": [
    "string"
  ],
  "effective_time": 0,
  "effective_time_text": "string",
  "min_buy_num": 0,
  "max_buy_num": 0,
  "quota": 0,
  "limit_buy": 0,
  "rule_desc": "string",
  "add_time": 0,
  "add_time_text": "string",
  "recommend_list": [
    {
      "id": 0,
      "product_id": 0,
      "title": "string",
      "image": "string",
      "description": "string",
      "group_price": "string",
      "original_price": "string",
      "save_amount": "string",
      "people": 0,
      "sales": 0,
      "is_host": 0,
      "start_time": 0,
      "stop_time": 0,
      "start_time_text": "string",
      "stop_time_text": "string",
      "time_left": {
        "total_seconds": 0,
        "days": 0,
        "hours": 0,
        "minutes": 0,
        "seconds": 0,
        "text": "string"
      },
      "status": 0,
      "status_text": "string"
    }
  ]
}

```

### 属性

allOf

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|*anonymous*|[UserCombinationItem](#schemausercombinationitem)|false|none||none|

and

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|*anonymous*|object|false|none||none|
|» images|[string]|false|none||商品图片集合|
|» effective_time|integer|false|none||拼团有效时间|
|» effective_time_text|string|false|none||有效时间文本|
|» min_buy_num|integer|false|none||最少购买数量|
|» max_buy_num|integer|false|none||最多购买数量|
|» quota|integer|false|none||每人限购数量|
|» limit_buy|integer|false|none||是否限购|
|» rule_desc|string|false|none||拼团规则说明|
|» add_time|integer|false|none||添加时间戳|
|» add_time_text|string|false|none||添加时间文本|
|» recommend_list|[[UserCombinationItem](#schemausercombinationitem)]|false|none||推荐商品列表|

<h2 id="tocS_UserCombinationListResponse">UserCombinationListResponse</h2>

<a id="schemausercombinationlistresponse"></a>
<a id="schema_UserCombinationListResponse"></a>
<a id="tocSusercombinationlistresponse"></a>
<a id="tocsusercombinationlistresponse"></a>

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "list": [
      {
        "id": 0,
        "product_id": 0,
        "title": "string",
        "image": "string",
        "description": "string",
        "group_price": "string",
        "original_price": "string",
        "save_amount": "string",
        "people": 0,
        "sales": 0,
        "is_host": 0,
        "start_time": 0,
        "stop_time": 0,
        "start_time_text": "string",
        "stop_time_text": "string",
        "time_left": {
          "total_seconds": 0,
          "days": 0,
          "hours": 0,
          "minutes": 0,
          "seconds": 0,
          "text": "string"
        },
        "status": 0,
        "status_text": "string"
      }
    ],
    "count": 0,
    "page": 0,
    "limit": 0,
    "total_page": 0
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||none|
|msg|string|false|none||none|
|data|object|false|none||none|
|» list|[[UserCombinationItem](#schemausercombinationitem)]|false|none||none|
|» count|integer|false|none||总数量|
|» page|integer|false|none||当前页码|
|» limit|integer|false|none||每页数量|
|» total_page|integer|false|none||总页数|

<h2 id="tocS_UserCombinationDetailResponse">UserCombinationDetailResponse</h2>

<a id="schemausercombinationdetailresponse"></a>
<a id="schema_UserCombinationDetailResponse"></a>
<a id="tocSusercombinationdetailresponse"></a>
<a id="tocsusercombinationdetailresponse"></a>

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "id": 0,
    "product_id": 0,
    "title": "string",
    "image": "string",
    "description": "string",
    "group_price": "string",
    "original_price": "string",
    "save_amount": "string",
    "people": 0,
    "sales": 0,
    "is_host": 0,
    "start_time": 0,
    "stop_time": 0,
    "start_time_text": "string",
    "stop_time_text": "string",
    "time_left": {
      "total_seconds": 0,
      "days": 0,
      "hours": 0,
      "minutes": 0,
      "seconds": 0,
      "text": "string"
    },
    "status": 0,
    "status_text": "string",
    "images": [
      "string"
    ],
    "effective_time": 0,
    "effective_time_text": "string",
    "min_buy_num": 0,
    "max_buy_num": 0,
    "quota": 0,
    "limit_buy": 0,
    "rule_desc": "string",
    "add_time": 0,
    "add_time_text": "string",
    "recommend_list": [
      {
        "id": 0,
        "product_id": 0,
        "title": "string",
        "image": "string",
        "description": "string",
        "group_price": "string",
        "original_price": "string",
        "save_amount": "string",
        "people": 0,
        "sales": 0,
        "is_host": 0,
        "start_time": 0,
        "stop_time": 0,
        "start_time_text": "string",
        "stop_time_text": "string",
        "time_left": {},
        "status": 0,
        "status_text": "string"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||none|
|msg|string|false|none||none|
|data|[UserCombinationDetail](#schemausercombinationdetail)|false|none||none|

<h2 id="tocS_UserCombinationRecommendResponse">UserCombinationRecommendResponse</h2>

<a id="schemausercombinationrecommendresponse"></a>
<a id="schema_UserCombinationRecommendResponse"></a>
<a id="tocSusercombinationrecommendresponse"></a>
<a id="tocsusercombinationrecommendresponse"></a>

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": [
    {
      "id": 0,
      "product_id": 0,
      "title": "string",
      "image": "string",
      "description": "string",
      "group_price": "string",
      "original_price": "string",
      "save_amount": "string",
      "people": 0,
      "sales": 0,
      "is_host": 0,
      "start_time": 0,
      "stop_time": 0,
      "start_time_text": "string",
      "stop_time_text": "string",
      "time_left": {
        "total_seconds": 0,
        "days": 0,
        "hours": 0,
        "minutes": 0,
        "seconds": 0,
        "text": "string"
      },
      "status": 0,
      "status_text": "string"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||none|
|msg|string|false|none||none|
|data|[[UserCombinationItem](#schemausercombinationitem)]|false|none||none|

