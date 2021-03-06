<template>
  <!-- 图形验证码 -->
  <canvas
    ref="canvas"
    :width="contentWidth"
    :height="contentHeight"
  ></canvas>
</template>
<script>
export default {
  props: {
    // 是否刷新
    isRefresh: {
      type: Boolean,
      default: false
    },
    // 绑定的值
    value: {
      type: String,
      default: ''
    },
    // 字体最小值
    fontSizeMin: {
      type: Number,
      default: 25
    },
    // 字体最大值
    fontSizeMax: {
      type: Number,
      default: 35
    },
    // 验证码图片背景色最小值
    backgroundColorMin: {
      type: Number,
      default: 200
    },
    // 验证码图片背景色最大值
    backgroundColorMax: {
      type: Number,
      default: 220
    },
    // 背景干扰点最小值
    dotColorMin: {
      type: Number,
      default: 60
    },
    // 背景干扰点最大值
    dotColorMax: {
      type: Number,
      default: 120
    },
    // 容器宽度
    contentWidth: {
      type: Number,
      default: 120
    },
    // 容器高度
    contentHeight: {
      type: Number,
      default: 40
    }
  },
  created () {
    // 创建实例后初始调用生成验证码
    this.refreshCode()
  },
  computed: {
    // 生成一个随机数
    randomNum () {
      return (min, max) => Math.floor(Math.random() * (max - min) + min)
    },
    // 生成一个随机的颜色
    randomColor () {
      return (min, max) => {
        const r = this.randomNum(min, max)
        const g = this.randomNum(min, max)
        const b = this.randomNum(min, max)
        return 'rgb(' + r + ',' + g + ',' + b + ')'
      }
    },
    // [a-z]
    lowerCase () {
      const arr = []
      const a = 'a'.charCodeAt()
      const z = a + 25
      for (let i = a; i <= z; i++) {
        arr.push(String.fromCharCode(i))
      }
      return arr
    },
    // [A-Z]
    upperCase () {
      const arr = []
      const A = 'A'.charCodeAt()
      const Z = A + 25
      for (let i = A; i <= Z; i++) {
        arr.push(String.fromCharCode(i))
      }
      return arr
    },
    // [0-9]
    numbers () {
      const arr = []
      for (let i = 0; i <= 9; i++) {
        arr.push(i)
      }
      return arr
    }
  },
  methods: {
    // 更新验证码
    refreshCode () {
      let str = ''
      const arr = [].concat(this.lowerCase, this.upperCase, this.numbers)
      for (let i = 0; i < 4; i++) {
        const randIndex = this.randomNum(0, arr.length)
        str += arr[randIndex]
      }
      this.identifyCode = str
    },
    drawPic () {
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext('2d')
      ctx.textBaseline = 'bottom'
      // 绘制背景
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, this.contentWidth, this.contentHeight)
      // 绘制文字
      for (let i = 0; i < this.identifyCode.length; i++) {
        this.drawText(ctx, this.identifyCode[i], i)
      }
      this.drawLine(ctx)
      this.drawDot(ctx)
    },
    drawText (ctx, txt, i) {
      // 随机生成字体颜色
      ctx.fillStyle = this.randomColor(50, 160)
      // 随机生成字体大小
      ctx.font = this.randomNum(this.fontSizeMin, this.fontSizeMax) + 'px SimHei'
      const x = (i + 1) * (this.contentWidth / (this.identifyCode.length + 1))
      const y = this.randomNum(this.fontSizeMax, this.contentHeight - 5)
      var deg = this.randomNum(-30, 30)
      // 修改坐标原点和旋转角度
      ctx.translate(x, y)
      ctx.rotate(deg * Math.PI / 180)
      ctx.fillText(txt, 0, 0)
      // 恢复坐标原点和旋转角度
      ctx.rotate(-deg * Math.PI / 180)
      ctx.translate(-x, -y)
    },
    drawLine (ctx) {
      // 绘制干扰线
      for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = this.randomColor(100, 200)
        ctx.beginPath()
        ctx.moveTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
        ctx.lineTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
        ctx.stroke()
      }
    },
    drawDot (ctx) {
      // 绘制干扰点
      for (let i = 0; i < 30; i++) {
        ctx.fillStyle = this.randomColor(0, 256)
        ctx.beginPath()
        ctx.arc(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight), 1, 0, 2 * Math.PI)
        ctx.fill()
      }
    }
  },
  watch: {
    value (newValue, oldValue) {
      const isRight = newValue.toLocaleLowerCase() === this.identifyCode.toLocaleLowerCase()
      // 将布尔值返回给父组件
      this.$emit('on-result', isRight, this.identifyCode)
    },
    isRefresh (newValue, oldValue) {
      // 更新
      this.refreshCode()
      this.$emit('update:isRefresh', false)
    },
    identifyCode (newValue, oldValue) {
      // 渲染验证码
      this.drawPic()
      this.$emit('getCode', newValue)
    }
  },
  data () {
    return {
      identifyCode: ''
    }
  }
}
</script>

<style lang="scss" scoped>
canvas {
  cursor: pointer;
  user-select: none;
}
</style>
