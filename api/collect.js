// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2024 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import request from "@/utils/request.js";

/**
 * 获取收藏列表
 * @param object data 参数对象，包含收藏类型
 */
export function getCollectList(data) {
  return request.get("group/collect/get", data);
}

/**
 * 添加收藏
 * @param object data 参数对象，包含收藏ID和类型
 */
export function addCollect(data) {
  return request.post("group/collect/add", data);
}

/**
 * 取消收藏
 * @param object data 参数对象，包含收藏ID和类型
 */
export function deleteCollect(data) {
  return request.post("group/collect/del", data);
}

/**
 * 检查收藏状态
 * @param object data 参数对象，包含收藏ID和类型
 */
export function checkCollectStatus(data) {
  return request.get("group/collect/check", data);
}

/**
 * 批量操作收藏
 * @param object data 批量操作数据
 */
export function batchCollect(data) {
  return request.post("group/collect/batch", data);
} 