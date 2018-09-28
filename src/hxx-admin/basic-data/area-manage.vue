<template>
  <div>
    <div>
      <Input placeholder="参数名称..." v-model="keyword" @on-change="selectKeyword" style="width: 300px"></Input>
      <ButtonGroup size="small">
        <Button type="primary" @click="getList()">
          <Icon type="ios-search" size="24"/>
        </Button>
        <Button type="primary" @click="clear()">
          <Icon type="ios-undo" size="24"/>
        </Button>
      </ButtonGroup>
      <Button type="primary" @click="areaImport" style="float:right;margin-right:15px;">导出</Button>
      <Button type="success" @click="areaUpload" style="float:right;margin-right:15px;">导入</Button>
    </div>
    <Tree :data="data"></Tree>
    <upload-excel :type="show" :title="'行政区域导入'" :downUrl="'common/basedata/bdregion/downloadTemple'" :success="'success'" @success="uploadSuccess" :actionUrl="'manage/basedata/bdregion/doImport'" :description="description"></upload-excel>
  </div>
</template>
<script>
  import env from '_conf/url'
  import uploadExcel from '@/hxx-components/upload-excel.vue'
  export default {
    name: "area-manage",
    components:{uploadExcel},
    data() {
      return {
        area: {},
        data: [],
        show:false,
        children: [],
        store: {},
        keyword: "",
        baseUrl:"",
        description:[
          {des:'1、点击“浏览”按钮，找到您所要导入的Excel文件,请确定文件中列表字段顺序为：“【省】-【省代码】-【市】-【市代码】-【区(县)】-【区(县)代码】 ”；'},
          {des:'2、选择好文件后, 点“确定”按钮完成导入。'}
        ],
      }
    },
    mounted() {
      this.baseUrl = env;
      this.getList();
    },
    methods: {
      uploadSuccess(res){
        if(res.success == true){
          let flag = res.data.errorList ? true : false;
          if(flag && res.data.errorList.length > 0){
            let content = "";
            let data = res.data.errorList;
            for(let i in data){
              content += "<div>第"+data[i].rowNum+ "行" + data[i].errorMsg +"</div> ";
            }
            this.$Modal.error({title:'导入错误提示',content:content,width:600});
            return;
          }
          this.getList();
          this.show = false;
          this.$Modal.success({title:'提示信息',content:'批量导入成功'});
        }else{
          this.$Modal.error({title:'错误提示',content:res.Exception.message});
        }
      },
      areaUpload(){
       this.show = Math.random();
      },
      areaImport(){
        window.location.href = this.baseUrl + "/manage/basedata/bdregion/doExport?access_token="+this.$store.state.user.token+"&keyWord="+this.keyword+"&KEYWORD="+this.keyword;
      },
      clear() {
        this.keyword = "";
      },
      getList() {
        this.axios.request({
          url: '/manage/basedata/bdregion/list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            node: 0,
          },
        }).then(res => {
          if (res.success === true) {
            this.area = res.data;
            this.search("");
          }
        })
      },
      selectKeyword(key) {
        this.search(key);
      },
      search(keyword) {
        //递归时间复杂度n^2;利用数组规律性进行处理时间复杂度n
        let da = this.fastFormat(0, 1, {title: '中华人民共和国', children: []});
        if(this.keyword == "" || this.keyword == " "){
          da['expand'] = true;
          this.data = [da];
          return;
        }
        let formData = this.filterData(da);
        formData['expand'] = true;
        this.data = [formData];
      },
      fastFormat(i = 0, level = 1, data, pid = 0) {
        for (var a = i; a < this.area.length; a++) {
          if (this.area[a].parentId == 0) {
            data.children.push({
              "title": this.area[a].text,
              "id": this.area[a].id,
              "parentId": this.area[a].parentId,
              "level": 1
            });
            pid = this.area[a].id;
            level = 2;
            continue;
          }
          if (this.area[a].parentId == pid && level == 2) {
            var flag = data.children[data.children.length - 1]['children'] ? true : false;
            if (!flag) {
              data.children[data.children.length - 1]['children'] = [];
            }
            data.children[data.children.length - 1]['children'].push({
              "title": this.area[a].text,
              "id": this.area[a].id,
              "parentId": this.area[a].parentId,
              "level": 2
            });
            pid = this.area[a].id;
            level = 3;
            continue;
          }
          if (this.area[a].parentId == pid && level == 3) {
            var flag = data.children[data.children.length - 1]['children'][data.children[data.children.length - 1]['children'].length - 1]['children'] ? true : false;
            if (!flag) {
              data.children[data.children.length - 1]['children'][data.children[data.children.length - 1]['children'].length - 1]['children'] = [];
            }
            if (this.keyword != "" && this.keyword != " ") {
              if (this.area[a].text.indexOf(this.keyword) > -1) data.children[data.children.length - 1]['children'][data.children[data.children.length - 1]['children'].length - 1]['children'].push({
                "title": this.highLight(this.area[a].text, this.keyword),
                "id": this.area[a].id,
                "parentId": this.area[a].parentId,
                render: this.renderTree
              });
            } else {
              data.children[data.children.length - 1]['children'][data.children[data.children.length - 1]['children'].length - 1]['children'].push({
                "title": this.area[a].text,
                "id": this.area[a].id,
                "parentId": this.area[a].parentId,
                "level": 3
              });
            }
            if (a < this.area.length - 2 && this.area[a + 1].parentId == data.children[data.children.length - 1].id) {
              this.fastFormat(a, 2, data, data.children[data.children.length - 1].id);
              break;
            }
          }
        }
        //搜索条件过滤.....
        return data;
      },
      filterData(data) {
        let AreaData = {title: '中华人民共和国', children: []};
        for (let i = 0; i < data.children.length; i++) {
          // console.log("=======" + i + "=========");
          let store = this.filterTree(data.children[i].children);
          if(store.length == 0){
            if(data.children[i].title.indexOf(this.keyword) > -1) AreaData.children.push({
              "title": this.highLight(data.children[i].title, this.keyword),
              "id": data.children[i].id,
              "parentId": data.children[i].parentId,
              render: this.renderTree,
              "children": []
            });
          }else{
            AreaData.children.push({
              "title": this.highLight(data.children[i].title, this.keyword),
              "id": data.children[i].id,
              "parentId": data.children[i].parentId,
              render: this.renderTree,
              "children": store
            });
          }
          // console.log(JSON.stringify(data.children[i].children));
        }
        return AreaData;
      },
      filterTree(data) {
        let newData = [];
        for (var a = 0; a < data.length; a++) {
          if (data[a].children.length == 0) {
            if (data[a].title.indexOf(this.keyword) > -1) newData.push({
              "title": this.highLight(data[a].title, this.keyword),
              "id": data[a].id,
              "parentId": data[a].parentId,
              render: this.renderTree,
              "children": []
            });
          } else {
            newData.push({
              "title": this.highLight(data[a].title, this.keyword),
              "id": data[a].id,
              "parentId": data[a].parentId,
              render: this.renderTree,
              "children": data[a].children
            });
          }
        }
        // console.log(JSON.stringify(data));
        return newData;
      },
      renderTree(h, {root, node, data}) {
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
          text = text.replace(re, '<' + tag + ' class="highlight">$&</' + tag + '>');
        }
        return text;
      }
    },
  }
</script>

<style lang="less">
  .highlight {
    color: red;
  }
</style>
