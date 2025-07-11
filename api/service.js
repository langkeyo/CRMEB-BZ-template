import request from "@/utils/request.js";

/**
 * 获取客服列表
 */
export function getServiceList() {
  return request.get("user/service/list");
}

/**
 * 获取聊天记录
 * @param {Object} data - 请求参数
 * @param {Number} data.service_id - 客服ID
 * @param {Number} data.page - 页码
 * @param {Number} data.limit - 每页条数
 * @param {Number} data.last_msg_id - 最后一条消息ID（可选，用于轮询）
 */
export function getServiceRecord(data) {
  return request.get("user/service/record", data);
}

/**
 * 发送消息给客服
 * @param {Object} data - 请求参数
 * @param {Number} data.service_id - 客服ID
 * @param {String} data.content - 消息内容
 * @param {String} data.session_id - 会话ID
 */
export function sendServiceMessage(data) {
  // 根据API文档，修改为正确的接口路径
  // 使用客服聊天记录接口，可能需要传入toUid参数
  return request.post(`user/service/record/${data.service_id}`, {
    msn: data.content,
    msn_type: 1 // 1=文字
  });
}

/**
 * 提交客服反馈
 * @param {Object} data - 请求参数
 * @param {String} data.rela_name - 姓名
 * @param {String} data.phone - 电话
 * @param {String} data.content - 反馈内容
 */
export function submitServiceFeedback(data) {
  return request.post("user/service/feedback", data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
} 