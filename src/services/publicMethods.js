/**
 * @author: YINJUN
 * @Date: 2020-11-07 11:36:15
 * @description: 公共方法
 */
export function price(a = 0) {
  var num = Number(a);
  if (!num) {
    return num + '.00';
  } else {
    //不等于0
    num = Math.round(num * 100) / 10000;
    num = num.toFixed(2);
    num += ''; //转成字符串
    var reg = num.indexOf('.') > -1 ? /(\d{1,3})(?=(?:\d{3})+\.)/g : /(\d{1,3})(?=(?:\d{3})+$)/g; //千分符的正则
    return num.replace(reg, '$1,'); //千分位格式化
  }
}
