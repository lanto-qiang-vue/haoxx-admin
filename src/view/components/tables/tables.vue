<template>
  <!--<div id="t1">-->
    <!--<Card>-->
      <tables ref="tables" editable searchable search-place="top" v-model="tableData" :height="300" :columns="columns" @on-delete="handleDelete"/>
      <!--<Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>-->
    <!--</Card>-->
  <!--</div>-->
</template>

<script>
import Tables from '_c/tables'
import { getTableData } from '@/api/data'
export default {
  name: 'tables_page',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        {type: 'selection', width: 50},
        {title: 'Name', key: 'name', sortable: true, minWidth: 200},
        {title: 'Email', key: 'email', editable: true, minWidth: 200},
        {title: 'Create-Time', key: 'createTime', minWidth: 200},
        {
          minWidth: 200,
          title: 'Handle',
          key: 'handle',
          options: ['delete'],
          button: [
            (h, params, vm) => {
              return h('Poptip', {
                props: {
                  confirm: true,
                  title: '你确定要删除吗?'
                },
                on: {
                  'on-ok': () => {
                    vm.$emit('on-delete', params)
                    vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
                  }
                }
              }, [
                h('Button', '自定义删除')
              ])
            }
          ]
        }
      ],
      tableData: []
    }
  },
  methods: {
    handleDelete (params) {
      console.log(params)
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    }
  },
  mounted () {
    getTableData().then(res => {
      console.log(res)
      this.tableData = res.data.concat(res.data, res.data, res.data)
    })
  }
}
</script>

<style>

</style>
