<template>
  <div class="home">
    <ul class="list-wrap">
      <li v-for="(item,idx) in utilsList" :key="item" @click="click(item)">{{item}}</li>
    </ul>
    <pre>
    {{dispatchStr}}
    </pre>
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
      utilsList: Object.keys(ktools),
      dispatchStr: ""
    };
  },
  mounted() {},
  methods: {
    click(name) {
      switch (name) {
        case "deepClone":
          this.deepCloneDemo();
          break;
      }
    },
    deepCloneDemo() {
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
      console.group("deepCloneDemo");
      console.log(`原始数据：`, originData);
      let clone = ktools.deepClone(originData, {
        name: "new_name", //  原对象 name 映射到新对象的 new_name
        //  原对象 birth 映射到新对象 birthday，并且对值进行修改
        birth: (val, obj) => {
          return {
            birthday: `${obj.name}_${val}`
          };
        },
        location: "position" //  原对象 location 映射到新对象的 position
      });
      this.dispatchStr = `ktools.deepClone(originData, {
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
      console.groupEnd("deepCloneDemo");
    }
  }
};
</script>
<style lang="less" scoped>
.home {
  position: absolute;
  height: 100%;
  width: 100%;
  padding-top: 100px;
  display: flex;
  justify-content: space-around;
  ul {
    height: 80%;
    width: 200px;
    overflow: auto;
    padding: 10px;
    border: 5px solid #999;
    border-radius: 5px;
    text-align: center;
    font-weight: bold;
    li {
      height: 30px;
      line-height: 30px;
    }
    li:nth-child(even) {
      background: #eaeaea;
    }
    li:hover {
      background: lightblue;
    }
  }
  pre {
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    height: 80%;
    width: 700px;
    border: 5px solid red;
    line-height: 30px;
    overflow: auto;
  }
}
</style>

