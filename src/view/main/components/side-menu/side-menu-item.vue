<template>
  <Submenu :name="`${parentName}`">
    <template slot="title">
      <!--<common-icon :type="parentItem.icon || ''" :custom="parentItem.custom"/>-->
      <common-icon :type="'logo-buffer'" :custom="parentItem.custom"/>
      <span>{{ showTitle(parentItem) }}</span>
      <!--<span>{{parentItem.custom}}</span>-->
    </template>
    <template v-for="item in children">
      <template v-if="item.children && item.children.length === 1">
        <!--<side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>-->
        <!--<menu-item v-else :name="getNameOrHref(item, true)" :key="`menu-${item.children[0].name}`"><common-icon :type="item.children[0].icon || ''" :custom="item.children[0].custom"/><span>{{ showTitle(item.children[0])}}</span></menu-item>-->
      </template>
      <template v-else>
        <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
        <menu-item v-else :name="getNameOrHref(item)" :key="`menu-${item.name}`"><common-icon :type="item.icon || ''" :custom="item.custom"/><span>{{ showTitle(item) }}</span></menu-item>
      </template>
    </template>
  </Submenu>
</template>
<script>
import mixin from './mixin'
import itemMixin from './item-mixin'
export default {
  name: 'SideMenuItem',
  mixins: [ mixin, itemMixin ]
}
</script>
