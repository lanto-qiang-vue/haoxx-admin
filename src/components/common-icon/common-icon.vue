<template>
  <component :is="iconType" :type="iconName" :color="iconColor" :size="iconSize" :custom="iconCustom"/>
</template>

<script>
import Icons from '_c/icons'
export default {
  name: 'CommonIcon',
  components: {Icons},
  props: {
    type: {
      type: String,
      required: true
    },
    color: String,
    size: Number,
    custom: String
  },
  computed: {
    iconType () {
      return this.type.indexOf('_') === 0 ? 'Icons' : 'Icon'
    },
    iconName () {
      return this.iconType === 'Icons' ? this.getCustomIconName(this.type) : this.type
    },
    iconSize () {
      return this.size || (this.iconType === 'Icons' ? 12 : undefined)
    },
    iconColor () {
      return this.color || ''
    },
    iconCustom () {
      // console.log('iconCustom', this.custom)
      return this.custom || ''
    }
  },
  methods: {
    getCustomIconName (iconName) {
      return iconName.slice(1)
    }
  }
}
</script>

<style>

</style>
