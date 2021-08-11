<template>
  <div id="app">
    <p style="display: none;">Is it Idle? - {{ isIdle }}</p>
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
import {cefSharpclose} from "@/utils/cefSharp";
import { getToken} from "@/utils/auth";
export default {
  name: 'App',

  computed: {
    isIdle() {
      this.idleEvent()
      return this.$store.state.idleVue.isIdle;
    }
  },
  created(){
    if(!getToken()){
       this.$store.commit("user/SET_LOGININFO", '');
       this.$store.commit("user/showLoginWin", false);
    }  
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    // 空闲判断事件
    idleEvent() {
      let baseSet = localStorage.getItem("initSetBase") ? JSON.parse(localStorage.getItem("initSetBase")):'';
      let bool = this.$store.state.idleVue.isIdle
      // console.log('idle', bool, baseSet)

      if (baseSet.exit && bool) {
        cefSharpclose();
      }
    },
     reload () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  }

}
</script>
<style scoped>
/* .loading-fullen{
  height: 130%!important;
} */
</style>
