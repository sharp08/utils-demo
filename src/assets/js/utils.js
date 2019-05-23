/**
 * @description: 检测类型
 * @param {any} o 数据源
 * @return: Object,Array,Null,Number...
 */
const getType = (o) => {
  let type = Object.prototype.toString.call(o);
  type = type.slice(8, -1)
  return type
}
/**
* @description: 深拷贝
* @param {any} o  拷贝源
* @param {object} option
*      分两种情况:
*          1.{ 拷贝源属性 A : 新对象属性 B } : 将 A 对应的值拷贝到 B 上
*          2.{ 
*              拷贝源属性A : function(A 对应的值, A 所在的整个对象) {
*                              处理A...
*                              return { 
*                                  C:处理后的A
*                              }
*                           }
*            } 
*            可以将A对应的值进行处理，再放到新对象的C属性上(C与A平级)
* @return: 深拷贝后的新对象
*/
const deepClone = (o, option) => {
  let newObj;
  if (getType(o) === "Array") {
    newObj = []
  } else if (getType(o) === "Object") {
    newObj = {}
  } else {
    newObj = o
    return newObj
  }
  //  循环拷贝源
  for (let name in o) {
    //  不传 option 参数时，直接克隆
    if (getType(option) === "Undefined") {
      newObj[name] = deepClone(o[name], option)
      continue;
    }
    //  标识 option 中指定的参数是否存在于拷贝源
    let exist = false
    //  传递了 option 参数，循环配置对象
    for (let oldProp in option) {
      //  处理 option 中指定的原对象的属性
      if (oldProp === name) {
        exist = true
        //  如果配置对象的某个属性值不是函数,则符合情况1
        if (getType(option[oldProp]) !== "Function") {
          newObj[option[oldProp]] = deepClone(o[name], option)
        }
        //  如果配置对象的某个值是函数,则符合情况2。将函数返回值与新对象合并
        else {
          let rtn = option[oldProp](o[oldProp], o)
          Object.assign(newObj, rtn)
        }
      }
    }
    //  其他未在 option 中指定的属性则直接拷贝
    if (!exist) {
      newObj[name] = deepClone(o[name], option)
    }
  }
  return newObj
}
/**
 * @description: 时间格式化
 * @param {String,Date} date  
 * @param {String} fmt 转换的格式
 * @param {any} 不传时间时返回值
 * @return: 
 */
const fmtDate = (date, fmt = "yyyy-MM-dd HH:mm:ss", rtn = null) => {
  if (!date) return rtn
  let me = new Date(date);
  var o = {
    "M+": me.getMonth() + 1, //月份         
    "d+": me.getDate(), //日         
    "h+": me.getHours() % 12 == 0 ? 12 : me.getHours() % 12, //小时         
    "H+": me.getHours(), //小时         
    "m+": me.getMinutes(), //分         
    "s+": me.getSeconds(), //秒         
    "q+": Math.floor((me.getMonth() + 3) / 3), //季度         
    "S": me.getMilliseconds() //毫秒         
  };
  var week = {
    "0": "/u65e5",
    "1": "/u4e00",
    "2": "/u4e8c",
    "3": "/u4e09",
    "4": "/u56db",
    "5": "/u4e94",
    "6": "/u516d"
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (me.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[me.getDay() + ""]);
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

export {
  getType,// 查看类型
  deepClone, // 深拷贝
  fmtDate,  //  时间格式化
}
