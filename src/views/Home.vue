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
          <div>{{desc}}</div>
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
      this.curFnName = name;
      this[name](name);
    },
    //  存储 localStorage  *****************************************************************************************************************
    setLocal() {
      this.desc = `见 setSession`;
    },
    //  取出 localStorage  *****************************************************************************************************************
    getLocal() {
      this.desc = `见 getSession`;
    },
    //  删除 localStorage  *****************************************************************************************************************
    removeLocal() {
      this.desc = `见 removeSession`;
    },
    //  存储 sessionStorage  *****************************************************************************************************************
    setSession(name) {
      this.desc = `ktools.setSession(key,val)；如果 val 是 undefined 则存入 空字符串；可在控制台 Application - sessionStorage 中查看；`;
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
      cursor: pointer;
      .baseWrapStyle();
      text-align: center;
      li {
        height: 30px;
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
        height: 30%;
        div {
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

