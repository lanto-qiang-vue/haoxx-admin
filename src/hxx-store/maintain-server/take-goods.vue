<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :page="page" @onRowClick="onRowClick" :ellipsis="false"
                ref="table" :loading="loading"
                class="take-goods">
    <div slot="operate">
      <Button type="primary" @click="take" :disabled="!detail.id">确认收货</Button>
    </div>
    <Modal
      v-model="showModal"
      title="确认收货"
      width="550"
      :mask-closable="false"
      :scrollable="true"
      :transfer="false"
      :transition-names="['', '']">
      <Form :label-width="120" :model="detail" ref="detail" :rules="rule">
        <FormItem label="发货单:">
          <span>{{detail.id}}</span>
        </FormItem>
        <FormItem label="输入商品数量：" prop="items">
          <li v-for="(item , key) in detail.items" :key="key">
            <span>{{item.goodsDesc}}</span>
            <span class="unit">瓶</span>
            <InputNumber  v-model="item.num" :min="0" placeholder="数量" class="com-num"/>
          </li>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button @click="closeDetail">取消</Button>
        <Button type="primary" @click="ok">提交</Button>
      </div>
    </Modal>

  </common-table>
</template>

<script>
import commonTable from '@/hxx-components/common-table.vue'
export default {
  name: "take-goods",
  components: {commonTable},
  data() {
    let rule= {required:true,message:'必填项不能为空'}
    return {
      detail: {
        items: []
      },
      showModal: false,
      columns: [
        {title: '发货单', key: 'id', width: 70},
        {title: '供应商Id', key: 'supplierId', width: 80},
        {title: '发货时间', key: 'createTime', width: 100},
        {title: '要求送达时间', key: 'requestDeliveryTime', minWidth: 120},
        {title: '入库时间', key: 'storeReceiptTime', minWidth: 120},
        {title: '货物列表', key: 'items', minWidth: 250, render:(h,params) => {
            let arr= [], list= params.row.items
            list.map((item)=>{
              arr.push( h('li', `${item.goodsDesc} * ${item.goodsNum}`) )
            })
            return h('ul',  arr)
          }},
      ],
      tableData: [],
      total: 0,
      showTable: false,
      loading: true,
      page: 1,
      limit: 25,
      rule:{
        items: { validator:(rule, value, callback) => {
            let pass= true
            // console.log('value', value)
            value.map((item)=>{
              if(!item.num) pass= false
            })
            if(pass){
              callback();
            }else{
              callback(new Error('请输入数量'));
            }
          }
        },
      },

    }
  },
  mounted(){
    this.getList()
  },
  methods:{
    getList(){
      this.loading= true
      this.detail= {}
      this.axios.post('/tenant/supplier/invoice', {
        limit:this.limit,
        page:this.page,
      }).then( (res) => {
        console.log(res)
        if(res.success){
          this.total= res.total
          this.tableData= res.data
          this.loading= false
        }
      })
    },
    take(){
      this.showModal= true
    },
    ok(){
      this.$refs.detail.validate(validator =>{
        if(validator){
          this.axios.post('/tenant/supplier/checkin', {
            invoiceId: this.detail.id,
            storeId: this.detail.storeId,
            items: this.detail.items,
          }).then( (res) => {
            console.log(res)
            if(res.success){
              this.closeDetail()
              this.getList()
            }
          })
        }
      })
    },
    onRowClick(item) {
      item.items.map((o)=>{
        o.num= null;
        o.id= o.goodsId;
      })
      this.detail = item;
    },
    closeDetail(){
      this.$refs.detail.resetFields()
      this.showModal= false
    },
    changePageSize(size) {
      this.limit = size;
      if (this.page == 1) this.getList();
    },
    changePage(page) {
      // console.log("changePage");
      this.page = page;
      this.getList();
    }
  }
}
</script>

<style scoped lang="less">
.take-goods{
  .com-num{
    float: right;
  }
  .unit{
    position: absolute;
    right: 5px;
    z-index: 1;
  }
}
</style>
<style lang="less">
.take-goods{
  .com-num input{
    text-align: left;
  }
}

</style>
