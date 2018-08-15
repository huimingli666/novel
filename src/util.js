/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，1995-2017，所有权利保留。
 * 项目名：my-project
 * 文件名：util
 * 模块说明：
 * 修改历史：
 * 2018/7/2 - lihuiming - 创建
 */

export default {
  getScrollTop () {
    var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0
    if (document.body) {
      bodyScrollTop = document.body.scrollTop
    }
    if (document.documentElement) {
      documentScrollTop = document.documentElement.scrollTop
    }
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop
    return scrollTop
  },

  getScrollHeight () {
    var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0
    if (document.body) {
      bodyScrollHeight = document.body.scrollHeight
    }
    if (document.documentElement) {
      documentScrollHeight = document.documentElement.scrollHeight
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight
    return scrollHeight
  },

  getWindowHeight () {
    var windowHeight = 0
    if (document.compatMode == 'CSS1Compat') {
      windowHeight = document.documentElement.clientHeight
    } else {
      windowHeight = document.body.clientHeight
    }
    return windowHeight
  }
}
