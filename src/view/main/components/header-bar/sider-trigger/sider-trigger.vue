<template>
<a @click="handleChange" type="text" :class="['sider-trigger-a', collapsed ? 'collapsed' : '']">
  <Tooltip  :content="collapsed?'展开菜单':'收起菜单'" style="line-height: normal;vertical-align: middle;color:#515B6D;">
    <Icon :type="icon" :size="size" />
  </Tooltip>
</a>
</template>
<script>
export default {
  name: 'siderTrigger',
  props: {
    collapsed: Boolean,
    icon: {
      type: String,
      default: 'navicon-round'
    },
    size: {
      type: Number,
      default: 26
    }
  },
  methods: {
    handleChange () {
      this.$emit('on-change', !this.collapsed)
    }
  }
}
</script>
<style lang="less">
@import './sider-trigger.less';
</style>
