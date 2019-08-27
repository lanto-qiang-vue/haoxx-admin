<template>
<common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
              :total="total" :page="page" @onRowClick="onRowClick" :ellipsis="false"
              ref="table" :loading="loading"
              class="inspection-report-head">
  <div slot="search">
    <!--<div class="search-block">-->
    <!--<Input placeholder="会员账号/门店名称/兑换码" v-model="query.keyWord" clearable></Input>-->
    <!--</div>-->
    <div class="search-block">
      <Input placeholder="车主/联系电话" v-model="query.keyWord" clearable></Input>
    </div>
    <div class="search-block">
      <Select placeholder="请选择状态" clearable v-model="query.reportStatus">
        <Option :value="1">有效</Option>
        <Option :value="0">无效</Option>
      </Select>
    </div>
    <div class="search-block">
      <DatePicker type="daterange" format="yyyy-MM-dd" placeholder="创建日期" clearable
                  style="width:100%;" @on-change="queryDateC"></DatePicker>
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
  name: "inspection-report-head",

}
</script>

<style scoped lang="less">

</style>
