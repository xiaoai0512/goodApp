<template>
  <!-- 首页 -->
  <div class="index-body">
  </div>
</template>
<script>
export default {
  components: {
  },
  data() {
    return {
    }
  },
  mounted() {
    this.logout()
  },
  methods: {
    logout(){
      this.$http('/service/logout', {},'GET').then(res => {
        if (res.rscode == '000000') {
          window.sessionStorage.removeItem('TOKEN_KEY')
          window.sessionStorage.clear()
          this.$router.push({path: '/auth', query: {}})
        } 
      })
    }
  }
}
</script>