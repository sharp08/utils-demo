<template>
  <div class="home">
    <h3 class="info">可在控制台中通过 ktools 进行方法调试</h3>
    <div class="content">
      <div class="content-v left">
        <h3>方法列表</h3>
        <ul class="list-wrap">
          <li :class="{lightblue:curFnName===item}" :key="item" @click="click(item)" v-for="item in utilsList">{{item}}</li>
        </ul>
      </div>
      <div class="content-v right">
        <div class="box">
          <h3>描述</h3>
          <pre>{{desc}}</pre>
        </div>
        <div class="box">
          <h3>调用</h3>
          <pre>{{dispatchStr}}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Mock from "mockjs";

export default {
  name: "home",
  data() {
    return {
      utilsList: Object.keys(ktools), //  工具方法名列表
      desc: "", //  方法描述
      dispatchStr: "", //  调用区展示
      curFnName: "" //  当前方法名
    };
  },
  beforeCreate() {
    window.ktools = ktools; //  使开发者工具上可以使用 ktools
  },
  mounted() {},
  methods: {
    click(name) {
      console.clear();
      this.curFnName = name;
      this[name](name);
    },
    //  扁平关系数据 => 嵌套数据
    flat2Tree(name) {
      this.desc = `@description: 扁平关系数据 => 嵌套数据(会修改原数组)
@param {Array} data 数据源
@param {String} id 关系 id
@param {String} pId 关系 id
@param {String} childKey 子数据存放的字段
@param {any} root 跟数据 pId 标识
@return: 嵌套数据`;
      this.dispatchStr = `ktools.flat2Tree(originData, "_id", "parentId");`;
      let originData = [
        { _id: 1, text: "1", parentId: 0 },
        { _id: 2, text: "2", parentId: 0 },
        { _id: 3, text: "1-3", parentId: 1 },
        { _id: 4, text: "1-3-4", parentId: 3 },
        { _id: 5, text: "2-5", parentId: 2 },
        { _id: 6, text: "1-3-6", parentId: 3 }
      ];
      let a = ktools.fmtDeepClone(originData);

      console.group(name);
      console.log(`原始数据：`, originData);
      a = ktools.flat2Tree(a, "_id", "parentId");
      console.log(`新数据：`, a);
      console.groupEnd(name);
    },
    //  嵌套数组对象扁平化  *****************************************************************************************************************
    tree2Flat(name) {
      Mock.Random.cname();
      Mock.Random.email();
      Mock.Random.province();
      Mock.Random.date();
      let originData = Mock.mock([
        {
          name: "@cname",
          birth: "@date",
          location: "@province",
          level: 0,
          "children|2-5": [
            {
              name: "@cname",
              birth: "@date",
              location: "@province",
              level: 1,
              "children|0-2": [
                {
                  name: "@cname",
                  birth: "@date",
                  location: "@province",
                  level: 2
                }
              ]
            }
          ]
        }
      ]);
      this.desc = `ktools.tree2Flat(arr[,childKey[,delOldKey]]) 
@param {Array} arr 嵌套关系数据
@param {String} childKey 关系字段
@param {Boolean} delOldKey 扁平后是否删除关系字段`;
      this.dispatchStr = `//  先深拷贝一份
let o = ktools.fmtDeepClone(originData);
ktools.tree2Flat(o, "children");
console.log(o);`;
      console.group(name);
      console.log(`原始数据：`, originData);
      let o = ktools.fmtDeepClone(originData);
      ktools.tree2Flat(o, "children");
      console.log(`扁平后数据：`, o);
      console.groupEnd(name);
    },
    //  存储 localStorage  *****************************************************************************************************************
    setLocal() {
      this.desc = `见 setSession`;
      this.dispatchStr = ``;
    },
    //  取出 localStorage  *****************************************************************************************************************
    getLocal() {
      this.desc = `见 getSession`;
      this.dispatchStr = ``;
    },
    //  删除 localStorage  *****************************************************************************************************************
    removeLocal() {
      this.desc = `见 removeSession`;
      this.dispatchStr = ``;
    },
    //  存储 sessionStorage  *****************************************************************************************************************
    setSession(name) {
      this.desc = `ktools.setSession(key,val)；如果 val 是 undefined 则存入 空字符串；可在控制台 Application - sessionStorage 中查看；`;
      this.dispatchStr = ``;
      let a = [
        "strrr",
        1,
        true,
        null,
        undefined,
        { name: "kaka", age: 12 },
        [1, 2, 3]
      ];
      console.group(name);
      console.log(`存入数据：`, ...a);
      a.forEach(item => {
        let type = ktools.getType(item);
        ktools.setSession(type, item);
      });
      console.groupEnd(name);
    },
    //  取出 sessionStorage  *****************************************************************************************************************
    getSession(name) {
      this.desc = `ktools.getSession(key)；返回 Null,String 或 JSON 对象`;
      this.dispatchStr = ``;
      console.group(name);
      let a = [
        "String",
        "Number",
        "Boolean",
        "Null",
        "Undefined",
        "Object",
        "Array"
      ];
      let r = a.map(item => {
        return ktools.getSession(item);
      });
      console.log(`取出数据：`, ...r);
      console.groupEnd(name);
    },
    //  删除 / 清空 sessionStorage  *****************************************************************************************************************
    removeSession(name) {
      this.desc = `ktools.removeSession(key)；传参就删参数对应值，不传就清空`;
      this.dispatchStr = ``;
      console.group(name);
      console.groupEnd(name);
    },
    //  类型检查  *****************************************************************************************************************
    getType(name) {
      let a = ["strrr", 1, true, null, undefined, {}, []];
      console.group(name);
      console.log(`原始数据：`, ...a);
      this.desc = `ktools.getType(any)；返回类型值`;
      this.dispatchStr = `let a = ["a", 1, true, null, undefined, {}, []]
let b = a.map(item => {
      return ktools.getType(item)
})
console.log(...b)`;
      let b = a.map(item => {
        return ktools.getType(item);
      });
      console.log(`新数据：`, ...b);
      console.groupEnd(name);
    },
    //  时间格式化  *****************************************************************************************************************
    fmtDate(name) {
      let a = new Date();
      console.group(name);
      console.log(`原始数据：`, a);
      this.desc = `ktools.fmtDate(Date|String)；时间格式化，默认 yyyy-MM-dd HH:mm:ss`;
      this.dispatchStr = `ktools.fmtDate(new Date());
ktools.fmtDate("2018-12-21");`;
      let b = ktools.fmtDate(a);
      console.log(`新数据：`, b);
      console.groupEnd(name);
    },
    //  深拷贝  *****************************************************************************************************************
    fmtDeepClone(name) {
      Mock.Random.cname();
      Mock.Random.email();
      Mock.Random.province();
      Mock.Random.date();
      let originData = Mock.mock([
        {
          name: "@cname",
          birth: "@date",
          location: "@province",
          level: 0,
          "children|2-5": [
            {
              name: "@cname",
              birth: "@date",
              location: "@province",
              level: 1,
              "children|0-2": [
                {
                  name: "@cname",
                  birth: "@date",
                  location: "@province",
                  level: 2
                }
              ]
            }
          ]
        }
      ]);
      console.group(name);
      console.log(`原始数据：`, originData);
      let clone = ktools.fmtDeepClone(originData, {
        name: "new_name", //  原对象 name 映射到新对象的 new_name
        //  原对象 birth 映射到新对象 birthday，并且对值进行修改
        birth: (val, obj) => {
          return {
            birthday: `${obj.name}_${val}`
          };
        },
        location: "position" //  原对象 location 映射到新对象的 position
      });
      //  描述展示
      this.desc = `ktools.fmtDeepClone(Object[,Object])；深拷贝并处理，支持修改 key 和 val。`;
      //  调用区展示
      this.dispatchStr = `ktools.fmtDeepClone(originData, {
        name: "new_name", //  原对象 name 映射到新对象的 new_name
        //  原对象 birth 映射到新对象 birthday，并且对值进行修改
        birth: (val, obj) => {
          return {
            birthday: obj.name + '_' + val
          };
        },
        location: "position" //  原对象 location 映射到新对象的 position
  });`;
      console.log(`新数据：`, clone);
      console.groupEnd(name);
    }
  }
};
</script>
<style lang="less" scoped>
.baseWrapStyle() {
  border-radius: 5px;
  border: 5px solid #999;
  background: beige;
}

.lightblue {
  background: lightblue !important;
  color: #fff !important;
}
h3 {
  height: 50px;
  line-height: 50px;
  text-align: center;
}
.home {
  line-height: 30px;
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 30px 30px;
  font-weight: bold;
  .info {
    text-align: center;
  }
  .content {
    width: 100%;
    min-width: 1000px;
    display: flex;
    flex-grow: 1;
    .list-wrap {
      flex-grow: 1;
      width: 200px;
      overflow: auto;
      padding: 10px;
      .baseWrapStyle();
      text-align: center;
      li {
        height: 30px;
        cursor: pointer;
      }
      // li:nth-child(even) {
      //   background: #cdcdcd;
      // }
      li:hover {
        background: lightblue;
        color: #fff;
      }
    }
    .content-v {
      display: flex;
      flex-direction: column;
      .box {
        display: flex;
        flex-direction: column;
      }
      .box:first-child {
        height: 50%;
        pre {
          font-family: Arial, Helvetica, sans-serif;
          flex-grow: 1;
          .baseWrapStyle();
          padding: 10px 20px;
          overflow: auto;
        }
      }
      .box:last-child {
        flex-grow: 1;
        pre {
          font-family: Arial, Helvetica, sans-serif;
          flex-grow: 1;
          .baseWrapStyle();
          overflow: auto;
          padding: 10px 20px;
        }
      }
    }
    .left {
      width: 200px;
    }
    .right {
      margin-left: 50px;
      flex-grow: 1;
    }
  }
}
</style>

