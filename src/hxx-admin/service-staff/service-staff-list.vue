<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :page="page" :loading="loading">
    <div slot="search">
      <div class="search-block">
        <Input placeholder="会员账号/姓名" v-model="search.name"></Input>
      </div>
      <div class="search-block">
        <Select v-model="search.status" placeholder="请选择接单状态">
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
  </common-table>
</template>

<script>
    export default {
        name: "service-staff-list",
        data(){
          return {
            search:{
              name:'',
              status:0,
            },
            statusList:[
              {id:0,name:'请选择接单状态'},
              {id:1,name:'可接单'},
              {id:1,name:'不可接单'},
              {id:1,name:'已接单'},
            ],
          }
        },
      methods:{
          getList(){

          }
      }
    }
</script>

<style scoped>

</style>
