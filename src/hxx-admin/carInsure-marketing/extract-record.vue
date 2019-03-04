<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :page="page" @onRowClick="rowClick">
    <div slot="search">
      <div class="search-block">
        <DatePicker format="yyyy/MM/dd" type="daterange" placeholder="提现日期" style="width:250px"></DatePicker>
      </div>
      <div class="search-block">
        <Input placeholder="门店"></Input>
      </div>
      <div class="search-block">
        <Select  placeholder="请选择状态...">
          <Option v-for="(item, index) in statusList"
                  :key="index" :value="item.id">{{item.name}}
          </Option>
        </Select>
      </div>
      <ButtonGroup size="small">
        <Button type="primary" @click="page=1;getList()">
          <Icon type="ios-search" size="24"/>
        </Button>
      </ButtonGroup>
    </div>
    <div slot="operate">
      <Button type="primary">提现成功</Button>
      <Button type="primary">取消提现成功</Button>
      <Button type="primary">提现失败</Button>
      <Button type="primary">取消提现失败</Button>
      <Button type="primary">查看打款图</Button>
    </div>
    <Modal v-model="showModal" title="提现成功" :width="500">
      <Form ref="formData" :rules="rule" :model="formData" :mask-closable="false" :closable="false" :label-width="100" style="width:350px;">
        <FormItem label="付款银行">
          <Input></Input>
        </FormItem>
        <FormItem label="付款银行账户">
        <Input></Input>
      </FormItem>
        <FormItem label="付款银行账号">
          <Input></Input>
        </FormItem>
        <FormItem label="操作时间">
          <DatePicker format="yyyy/MM/dd" type="date" style="width:250px"></DatePicker>
        </FormItem>
        <FormItem label="操作人">
          <Select  placeholder="请选择操作人">
            <Option v-for="(item, index) in personList"
                    :key="index" :value="item.id">{{item.name}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="打款截图">
          <!--<DatePicker format="yyyy/MM/dd" type="date" style="width:250px"></DatePicker>-->
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="showModal=false">取消</Button>
        <Button type="primary" @click="save('formData')">保存</Button>
      </div>
    </Modal>
  </common-table>
</template>

<script>
  import commonTable from '@/hxx-components/common-table.vue'
    export default {
        name: "extract-record",
        components:{commonTable},
      data(){
          return{
            tableData:[],
            showModal:true,
            formData:{},
            rule:{},
            columns:[
              {title: '序号',  width: 70,align:'center',
                render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
              },
              {title: '提现时间',  width: 130,key:'A'},
              {title: '门店',  width: 100,key:'B'},
              {title: '提现人',  width: 100,key:'C'},
              {title: '金额',  width:100,key:'D'},
              {title: '银行',  width: 200,key:'E'},
              {title: '账户名称',  width: 100,key:'F'},
              {title: '账号',  width: 150,key:'G'},
              {title: '状态',  width: 140,key:'H'},
              {title: '付款银行',  width: 200,key:'I'},
              {title: '付款银行账户',  width: 140,key:'J'},
              {title: '付款银行账号',  width: 140,key:'K'},
              {title: '操作时间',  width: 130,key:'L'},
              {title: '操作人',  width: 100,key:'M'},
              {title: '备注',  width: 140,key:'N'},
            ],
            total:0,
            page:1,
            limit:25,
            showTable:true,
            statusList:[
              {id:0,name:'请选择状态'},
              {id:1,name:'申请中'},
              {id:2,name:'成功'},
              {id:3,name:'失败'}
            ],
            personList:[
              {id:0,name:'请选择操作人'},
              {id:1,name:'李冰'},
              {id:2,name:'陈程'},
              {id:3,name:'夏林'},
              {id:4,name:'袁红'}
            ],
          }
      },
      mounted(){
          this.showTable = Math.random();
          this.getList();
      },
      methods:{
        changePageSize(size){
          this.limit = size;
          this.getList();
        },
        changePage(page){
          this.page = page;
          this.getList();
        },
        rowClick(){

        },
        getList(){
         this.tableData = [{
           A:'18-09-09 16:35',
           B:'华麟长宁店',
           C:'李军',
           D:750,
           E:'中国建设银行上海支行',
           F:'李军',
           G:'3204000000001',
           H:'提现成功',
           I:'中国建设银行上海支行',
           J:'上海衡益',
           K: '3204000098574',
           L:'18-09-10 16:35',
           M:'陈娟',
           N:'备注',
         }];
        }
      }
    }
</script>

<style scoped>

</style>
