<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <!-- <div :class="{'fixed-header':fixedHeader}"> -->
        <navbar />
    <!-- </div> -->
    <div class="main-container">
      <!--开发导航-->
      <!-- <sidebar class="sidebar-container" /> -->
      <!--新的导航 Navbar.vue 这个文件中的hamburger也要注释掉-->
       <newleftsidebar ref="child"/>
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain,NewLeft } from './components'
import Newleftsidebar from './components/NewLeftSideBar.vue'

import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  provide () {
    return {
      change: this.change,
      changeB: this.changeB
    }
  },
  components: {
    Navbar,
    Sidebar,
    AppMain,
    Newleftsidebar
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        // mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    change() {
      this.$refs.child.changeA()
    },
    changeB() {
      this.$refs.child.changeB()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    // height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
