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
const fmtDeepClone = (o, option) => {
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
      newObj[name] = fmtDeepClone(o[name], option)
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
          newObj[option[oldProp]] = fmtDeepClone(o[name], option)
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
      newObj[name] = fmtDeepClone(o[name], option)
    }
  }
  return newObj
}
/**
 * @description: 时间格式化
 * @param {String,Date} date  
 * @param {String} fmt 转换的格式
 * @param {any} 不传时间时返回值
 * @return: 格式化的时间 String
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

/**
 * @description: 存储 sessionStorage 如果 value 是 undefined，则存入 空字符串
 * @param {type} 
 * @return: 
 */
const setSession = (key, value) => {
  const type = getType(value);
  if (["Array", "Object"].includes(type)) {
    value = JSON.stringify(value)
  } else if (type === "Undefined") {
    value = ""
  }
  sessionStorage.setItem(key, value)
}

/**
 * @description: 取出 sessionStorage
 * @param {type} 
 * @return: Null,Object,String
 */
const getSession = key => {
  let r = sessionStorage.getItem(key)
  try {
    r = JSON.parse(r)
  } catch (error) { }
  return r
}
/**
 * @description: 删除 / 清空 sessionStorage
 * @param {any} 传哪个删哪个，不传清空
 * @return: 
 */
const removeSession = key => {
  if (getType(key) === "Undefined") {
    sessionStorage.clear()
  } else {
    sessionStorage.removeItem(key)
  }
}


/**
 * @description: 存储 localStorage 如果 value 是 undefined，则存入 空字符串
 * @param {type} 
 * @return: 
 */
const setLocal = (key, value) => {
  const type = getType(value);
  if (["Array", "Object"].includes(type)) {
    value = JSON.stringify(value)
  } else if (type === "Undefined") {
    value = ""
  }
  localStorage.setItem(key, value)
}

/**
 * @description: 取出 localStorage
 * @param {type} 
 * @return: Null,Object,String
 */
const getLocal = key => {
  let r = localStorage.getItem(key)
  try {
    r = JSON.parse(r)
  } catch (error) { }
  return r
}
/**
 * @description: 删除 / 清空 localStorage
 * @param {any} 传哪个删哪个，不传清空
 * @return: 
 */
const removeLocal = key => {
  if (getType(key) === "Undefined") {
    localStorage.clear()
  } else {
    localStorage.removeItem(key)
  }
}

/**
 * @description: 嵌套数组对象扁平化(会修改原数组)
 * @param {Array} arr 嵌套关系数据
 * @param {String} childKey 关系字段
 * @param {Boolean} delOldKey 扁平后是否删除关系字段
 * @return: 扁平后的数据
 */

const tree2Flat = (arr, childKey = "children", delOldKey = true) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][childKey]) {
      arr.push(...arr[i][childKey])
      if (delOldKey) delete arr[i][childKey]
    }
  }
  return arr
}

export {
  getType,// 查看类型
  fmtDeepClone, // 深拷贝并格式化
  fmtDate,  //  时间格式化
  setSession,// 存储 sessionStorage
  getSession,// 取出 sessionStorage
  removeSession,//  删除 / 清空 sessionStorage
  setLocal,// 存储 localStorage
  getLocal,// 取出 localStorage
  removeLocal,//  删除 / 清空 localStorage
  tree2Flat// 嵌套数组对象扁平化
}
