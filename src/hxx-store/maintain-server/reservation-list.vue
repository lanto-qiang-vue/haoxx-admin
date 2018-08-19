<!--预约单管理-->
<template>
  <common-table v-model="tableData" :columns="columns">
    <div  slot="search"  >
      <div class="search">
        <Input v-model="search.input" placeholder="预约单号/预约人/联系电话..."></Input>
      </div>
      <div class="search">
        <Select v-model="search.select">
          <Option value="beijing">New York</Option>
          <Option value="shanghai">London</Option>
          <Option value="shenzhen">Sydney</Option>
        </Select>
      </div>
      <ButtonGroup size="small">
        <Button type="primary"><Icon type="ios-search" size="24"/></Button>
        <Button type="primary"><Icon type="ios-undo" size="24"/></Button>
      </ButtonGroup>
    </div>
    <div slot="operate">
      <Button type="primary">新增</Button>
      <Button type="primary">新增</Button>
      <Button type="primary">新增</Button>
    </div>
  </common-table>
</template>

<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import { getTableData } from '@/api/data'
	export default {
		name: "reservation-list",
    components: {commonTable},
    data(){
		  return{
        columns: [
          {type: 'selection', width: 50, fixed: 'left'},
          {title: 'Name', key: 'name', sortable: true, minWidth: 300},
          {title: 'Email', key: 'email', editable: true, minWidth: 300},
          {title: 'Create-Time', key: 'createTime', minWidth: 300},
          {title: 'Name', key: 'name', sortable: true, minWidth: 300},
          {title: 'Email', key: 'email', editable: true, minWidth: 300},
          {title: 'Create-Time', key: 'createTime', minWidth: 300},
        ],
        tableData: [],
        search:{
          input: '',
          select: ''
        }
      }
    },
    mounted () {
      getTableData().then(res => {
        console.log(res)
        this.tableData = res.data.concat(res.data, res.data, res.data, res.data, res.data, res.data, res.data, res.data, res.data, res.data, res.data, res.data)
      })
    }
	}
</script>

<style lang="less" scoped>
.search{
  display: inline-block;
  margin-right: 10px;
}
</style>
