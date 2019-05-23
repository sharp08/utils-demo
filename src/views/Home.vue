<template>
  <div class="home">
    <h3 class="info">可在控制台中通过 ktools 进行方法调试</h3>
    <div class="content">
      <div class="content-v left">
        <h3>方法列表</h3>
        <ul class="list-wrap">
          <li v-for="(item,idx) in utilsList" :key="item" @click="click(item)">{{item}}</li>
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
import HelloWorld from "@/components/HelloWorld.vue";
import Mock from "mockjs";

export default {
  name: "home",
  components: {
    HelloWorld
  },
  data() {
    return {
      utilsList: Object.keys(ktools), //  工具方法名列表
      desc: "", //  方法描述
      dispatchStr: "" //  调用区展示
    };
  },
  beforeCreate() {
    window.ktools = ktools;
  },
  mounted() {},
  methods: {
    click(name) {
      switch (name) {
        case "fmtDeepClone":
          this.fmtDeepCloneDemo("fmtDeepClone");
          break;
        case "fmtDate":
          this.fmtDateDemo("fmtDate");
          break;
      }
    },
    //  时间格式化
    fmtDateDemo(name) {
      let a = new Date();
      console.group(name);
      console.log(`原始数据：`, a);
      this.desc = `ktools.fmtDate(Date|String)；时间格式化，默认 yyyy-MM-dd HH:mm:ss`;
      this.dispatchStr = `ktools.fmtDate(new Date());
ktools.fmtDate("2018-12-21");`;
      let b = ktools.fmtDate(a);
      console.log(b);
      console.groupEnd(name);
    },
    //  深拷贝
    fmtDeepCloneDemo(name) {
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
.borderStyle() {
  border-radius: 5px;
  border: 5px solid #999;
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
    justify-content: space-around;
    .list-wrap {
      flex-grow: 1;
      width: 200px;
      overflow: auto;
      padding: 10px;
      .borderStyle();
      text-align: center;
      li {
        height: 30px;
      }
      li:nth-child(even) {
        background: #eaeaea;
      }
      li:hover {
        background: lightblue;
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
          .borderStyle();
          padding: 10px 20px;
          overflow: auto;
        }
      }
      .box:last-child {
        flex-grow: 1;
        pre {
          font-family: Arial, Helvetica, sans-serif;
          flex-grow: 1;
          .borderStyle();
          overflow: auto;
          padding: 10px 20px;
        }
      }
    }
    .left {
      width: 200px;
    }
    .right {
      width: 700px;
    }
  }
}
</style>

