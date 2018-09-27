<template>
  <div>
    <div>
      <Input  placeholder="参数名称..." v-model="keyword" @on-change="selectKeyword" style="width: 300px"></Input>
      <ButtonGroup size="small">
        <Button type="primary" @click="getList()"><Icon type="ios-search" size="24"/></Button>
        <Button type="primary" @click="clear()"><Icon type="ios-undo" size="24"/></Button>
      </ButtonGroup>
    </div>
    <Tree :data="data"></Tree>
  </div>
</template>

<script>
  export default {
    name: "area-manage",
    data(){
      return{
        area:{},
        data:[],
        kdata:{},
        children:[],
        keyword:"",
      }
    },
    mounted(){
      this.getList();
    },
    methods:{
      clear(){
        this.keyword = "";
      },
      getList(){
        this.axios.request({
          url: '/manage/basedata/bdregion/list',
          method: 'post',
          data:{
            access_token:this.$store.state.user.token,
            node:0,
          },
        }).then(res => {
          if (res.success === true) {
            this.area = res.data;
          }
        })
      },
      selectKeyword(key){
        this.search(key);
      },
      search(keyword){
        //递归时间复杂度n^2;利用数组规律性进行处理时间复杂度n
        console.log('dadadadda',this.area);
          var da = this.fastFormat(0,1,{title:'中华人民共和国',children:[]});
          console.log(da.children[0].children.length);
          this.data = [da];
      },
      fastFormat(i = 0,level = 1,data,pid = 0){
        for(var a = i;a <15;a++){
          console.log(a);
          console.log(JSON.stringify(data));
          console.log("========开始=========");
          console.log("最开始之前的值",JSON.stringify(this.area[a-1]));
          this.area[a].title = this.area[a].text;
          if(this.area[a].parentId == 0){
            console.log(JSON.stringify(this.area[a]));
            console.log("========什么鬼=========");
             data.children.push(this.area[a]);
             pid = this.area[a].id;
             level = 2;
             continue;
          }
          if(this.area[a].parentId == pid && level == 2){
            var flag = data.children[data.children.length - 1]['children'] ? true : false;
            console.log(this.area[a].title);
            if(!flag) {
              data.children[data.children.length - 1]['children'] = [];
            }
            data.children[data.children.length - 1]['children'].push(this.area[a]);
            pid = this.area[a].id;
            level = 3;
            continue;
          }
          if(this.area[a].parentId == pid && level == 3){
            var flag = data.children[data.children.length - 1]['children'][data.children[data.children.length - 1]['children'].length -1]['children'] ? true : false;
            if(!flag){
              data.children[data.children.length - 1]['children'][data.children[data.children.length - 1]['children'].length -1]['children']= [];
            }
            data.children[data.children.length - 1]['children'][data.children[data.children.length - 1]['children'].length -1]['children'].push(this.area[a]);
            
            continue;
          }
          // this.fastFormat(a,2,data,data.children[data.children.length - 1].id);
          // break;
        }
        return data;
      },
      // areaFormat(parentId,store,keyword = ""){
      //   store.children = [];
      //   for(var i in this.children){
      //     if(this.children[i].parentId == parentId){
      //       if(keyword == "" || keyword == " "){
      //         this.children[i].title = this.children[i].text;
      //       }else{
      //         this.children[i].title = this.highLight(this.children[i].text, keyword);
      //         this.children[i].render = this.renderTree;
      //       }
      //       store.children.push(this.children[i]);
      //       this.areaFormat(this.children[i].id,store.children[store.children.length - 1],keyword);
      //     }
      //   }
      //   return store;
      // },
      renderTree(h, { root, node, data }){
        return h('span', {
          class: {'ivu-tree-title': true},
          domProps: {
            innerHTML: data.title
          }
        })
      },
      highLight(text, words, tag) {
        tag = tag || 'span';
        let re = new RegExp(words, 'gi');
        if (re.test(text)) {
          text = text.replace(re, '<'+ tag +' class="highlight">$&</'+ tag +'>');
        }
        return text;
      }
    },
  }
</script>

<style lang="less">
  .highlight{
    color:red;
  }
</style>
