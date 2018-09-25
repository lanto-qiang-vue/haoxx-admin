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
        name: "select-area",
        data(){
          return{
            area:{},
            data:[],
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
                this.search(this.keyword);
              }
            })
          },
          selectKeyword(key){
            let self= this
            clearTimeout(this.timer);
            this.timer = setTimeout(function(){
              self.search(self.keyword)
            },1000)
          },
          search(keyword){
            this.data = [];
            if(keyword == "" || keyword == " "){
                // this.children = this.area;
              var data = {};
              for(var i in this.area){
                // if()
              }
              //快速遍历...
              // var store =
            }else{
              this.children = [];
              this.data = [];
              var store = this.filterSearch(keyword);
              //去重...
              for(var i=0;i<this.children.length-1;i++){
                for(var a = i+1;a<this.children.length;a++){
                  if(this.children[i].id == this.children[a].id) this.children.splice(i,1);
                }
              }
              for(var i in store){
                this.children.push(store[i]);
              }
            }
            var data = this.areaFormat(0,{title:'中华人民共和国'},keyword);
            data['expand'] = true;
            alert(1);
            this.data.push(data);
          },
          filterSearch(search,store = []){
            for(var i in this.area){
              if(this.area[i].text.indexOf(search) > -1){
                store.push(this.area[i]);
                this.findParent(this.area[i].parentId);
              }
            }
            return store;
          },
          findParent(id){
          for(var i in this.area){
            if(this.area[i].id  == id){
              this.children.push(this.area[i]);
              this.findParent(this.area[i].parentId);
            }
          }
          },
          areaFormat(parentId,store,keyword = ""){
            store.children = [];
            for(var i in this.children){
              if(this.children[i].parentId == parentId){
                if(keyword == "" || keyword == " "){
                  this.children[i].title = this.children[i].text;
                }else{
                  this.children[i].title = this.highLight(this.children[i].text, keyword);
                  this.children[i].render = this.renderTree;
                }
                store.children.push(this.children[i]);
                this.areaFormat(this.children[i].id,store.children[store.children.length - 1],keyword);
              }
            }
            return store;
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
