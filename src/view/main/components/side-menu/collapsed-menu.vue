<template>
  <Dropdown @on-click="handleClick" transfer :placement="placement" >
    <a class="drop-menu-a" type="text" @mouseover="handleMousemove($event, children)" :style="{textAlign: !hideTitle ? 'left' : ''}"><common-icon :size="20" :color="textColor" :type="'logo-android'" :custom="parentItem.custom"/><span class="menu-title" v-if="!hideTitle"></span></a>
    <DropdownMenu slot="list" style="background:#001529;" class="drop-menu">
      <template v-for="child in children" >
        <collapsed-menu v-if="showChildren(child)" :icon-size="iconSize" :parent-item="child" :key="`drop-${child.name}`">22</collapsed-menu>
        <DropdownItem v-else :key="`drop-${child.name}`" :name="child.name" style="color:white;"><span class="menu-title">{{ showTitle(child) }}</span></DropdownItem>
      </template>
      <!--<common-icon :size="iconSize" :type="child.icon"/>-->
    </DropdownMenu>
  </Dropdown>
</template>
<script>
import mixin from './mixin'
import itemMixin from './item-mixin'

export default {
  name: 'CollapsedMenu',
  mixins: [ mixin, itemMixin ],
  props: {
    hideTitle: {
      type: Boolean,
      default: false
    },
    rootIconSize: {
      type: Number,
      default: 16
    },
    Icon:{

    },
  },
  data () {
    return {
      placement: 'right-end'
    }
  },
  methods: {
    handleClick (name) {
      this.$emit('on-click', name)
    },
    handleMousemove (event, children) {
      const { pageY } = event
      const height = children.length * 38
      const isOverflow = pageY + height < window.innerHeight
      this.placement = isOverflow ? 'right-start' : 'right-end'
    }
  },mounted(){
    // console.log(JSON.stringify(this.Icon));
  }
}
</script>
<style lang="less">
.drop-menu .ivu-dropdown-item:hover{
  background: #1890FF;
}
  </style>
