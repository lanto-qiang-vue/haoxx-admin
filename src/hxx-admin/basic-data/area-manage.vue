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
        store:{},
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
            this.store = res.data;
          }
        })
      },
      selectKeyword(key){
        this.search(key);
      },
      search(keyword){
        //数据过滤...
        this.filterData();
        //递归时间复杂度n^2;利用数组规律性进行处理时间复杂度n
          var da = this.fastFormat(0,1,{title:'中华人民共和国',children:[]});
          console.log(da.children[0].children.length);
          this.data = [da];
      },
      fastFormat(i = 0,level = 1,data,pid = 0){
        for(var a = i;a <this.area.length;a++){
          if(this.area[a].parentId == 0){
            data.children.push({"title":this.area[a].text,"id":this.area[a].id,"parentId":this.area[a].parentId});
             pid = this.area[a].id;
             level = 2;
             continue;
          }
          if(this.area[a].parentId == pid && level == 2){
            var flag = data.children[data.children.length - 1]['children'] ? true : false;
            if(!flag) {
              data.children[data.children.length - 1]['children'] = [];
            }
            data.children[data.children.length - 1]['children'].push({"title":this.area[a].text,"id":this.area[a].id,"parentId":this.area[a].parentId});
            pid = this.area[a].id;
            level = 3;
            continue;
          }
          if(this.area[a].parentId == pid && level == 3){
            var flag = data.children[data.children.length - 1]['children'][data.children[data.children.length - 1]['children'].length -1]['children'] ? true : false;
            if(!flag){
              data.children[data.children.length - 1]['children'][data.children[data.children.length - 1]['children'].length -1]['children']= [];
            }
            // {"title":this.highLight(this.area[a].text,this.keyword),"id":this.area[a].id,"parentId":this.area[a].parentId,render:this.renderTree}
           if(this.area[a].text.indexOf(this.keyword) > -1) data.children[data.children.length - 1]['children'][data.children[data.children.length - 1]['children'].length -1]['children'].push({"title":this.area[a].text,"id":this.area[a].id,"parentId":this.area[a].parentId});
            if(a<this.area.length - 2 && this.area[a+1].parentId == data.children[data.children.length - 1].id){
              this.fastFormat(a,2,data,data.children[data.children.length - 1].id);
              break;
            }
          }
        }
        data['expand'] = true;
        return data;
      },
      filterData(){
        var data
      },
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
