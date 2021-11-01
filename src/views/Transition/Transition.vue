<template>
  <!-- 过度页 -->
  <div id="transition">
    <div id="transition-text">
      {{ userName }}，欢迎您！<br />
      高睿云 云服务平台
    </div>
  </div>
</template>

<script>
export default {
  mounted () {
    this.toPage()
  },
  destroyed () {
    clearTimeout(this.timer)
  },
  data () {
    return {
      fadeIn: false
    }
  },
  computed: {
    userName () {
      return this.$store.state.user.user.userName
    }
  },
  methods: {
    toPage () {
      this.timer = setTimeout(_ => {
        this.$router.push({ name: 'Home', params: this.$route.params })
      }, 3000)
    }
  }
}
</script>

<style lang="scss" scoped>
#transition {
  width : 100vw;
  height : 100vh;
  color : #FFFFFF;
  opacity : 0;
  background-color : #4B5464;
  animation : fadeIn 3s infinite ease-in-out;
  #transition-text {
    position : absolute;
    top : 45%;
    width : 100%;
    font-size : 28px;
    text-align : center;
    line-height : 50px;
  }
}

@keyframes fadeIn {
  100% {
    opacity : 1;
  }
}

</style>
