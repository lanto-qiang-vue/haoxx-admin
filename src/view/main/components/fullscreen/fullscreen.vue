<template>
  <div v-if="showFullScreenBtn" class="full-screen-btn-con">
    <Tooltip :content="value ? '退出全屏' : '全屏'" placement="bottom" style="line-height: normal">
      <Icon @click.native="handleChange" :type="value ? 'md-contract' : 'md-expand'" :size="24" style="color:#515B6D;"></Icon>
    </Tooltip>
  </div>
</template>

<script>
export default {
  name: 'Fullscreen',
  computed: {
    showFullScreenBtn () {
      return window.navigator.userAgent.indexOf('MSIE') < 0
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleFullscreen () {
      let main = document.body
      if (this.value) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (main.requestFullscreen) {
          main.requestFullscreen()
        } else if (main.mozRequestFullScreen) {
          main.mozRequestFullScreen()
        } else if (main.webkitRequestFullScreen) {
          main.webkitRequestFullScreen()
        } else if (main.msRequestFullscreen) {
          main.msRequestFullscreen()
        }
      }
    },
    handleChange () {
      this.handleFullscreen()
    }
  },
  mounted () {
    let isFullscreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen
    isFullscreen = !!isFullscreen
    document.addEventListener('fullscreenchange', () => {
      this.$emit('input', !this.value)
      this.$emit('on-change', !this.value)
    })
    document.addEventListener('mozfullscreenchange', () => {
      this.$emit('input', !this.value)
      this.$emit('on-change', !this.value)
    })
    document.addEventListener('webkitfullscreenchange', () => {
      this.$emit('input', !this.value)
      this.$emit('on-change', !this.value)
    })
    document.addEventListener('msfullscreenchange', () => {
      this.$emit('input', !this.value)
      this.$emit('on-change', !this.value)
    })
    this.$emit('input', isFullscreen)
  }
}
</script>

<style lang="less" scoped>
.full-screen-btn-con {
  width: 40px;
  text-align: center;
  display: inline-block;
  vertical-align: top;
  .ivu-tooltip-rel{
    height: 50px;
    line-height: 50px;
    vertical-align: top;
    i{
      cursor: pointer;
    }
    .ivu-icon:hover{
      color: #2D8cF0;
    }
  }
}
</style>
