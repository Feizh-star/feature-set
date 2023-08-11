<script setup lang="ts">
onMounted(() => {
  drawPoint()
})

function drawPoint() {
  //顶点着色器源码
  var vertexShaderSource = `
    // attribute声明vec4类型变量apos
    attribute vec4 apos;
    void main() {
      //顶点坐标apos赋值给内置变量gl_Position
      //逐顶点处理数据
      gl_Position = apos;
    }
  `
  //片元着色器源码
  var fragShaderSource = `
    void main() {
      // 逐片元处理数据，所有片元(像素)设置为红色
      gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    }
  `

  //通过getElementById()方法获取canvas画布
  var canvas = document.getElementById('webgl') as HTMLCanvasElement
  //通过方法getContext()获取WebGL上下文
  var gl = canvas.getContext('webgl') as WebGLRenderingContext

  //初始化着色器
  var program = initShader(gl, vertexShaderSource, fragShaderSource)
  //获取顶点着色器的位置变量apos，即aposLocation指向apos变量。
  var aposLocation = gl.getAttribLocation(program, 'apos')

  //类型数组构造函数Float32Array创建顶点数组
  var data = new Float32Array([0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5])

  //创建缓冲区对象
  var buffer = gl.createBuffer()
  //绑定缓冲区对象,激活buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  //顶点数组data数据传入缓冲区
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
  //缓冲区中的数据按照一定的规律传递给位置变量apos
  gl.vertexAttribPointer(aposLocation, 2, gl.FLOAT, false, 0, 0)
  //允许数据传递
  gl.enableVertexAttribArray(aposLocation)

  //开始绘制图形
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)

  //声明初始化着色器函数
  function initShader(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string) {
    var vertexShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader
    gl.shaderSource(vertexShader, vertexShaderSource)
    gl.shaderSource(fragmentShader, fragmentShaderSource)
    gl.compileShader(vertexShader)
    gl.compileShader(fragmentShader)
    var program = gl.createProgram() as WebGLProgram
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.useProgram(program)
    return program
  }
}
</script>

<template>
  <div class="webgl-test">
    <canvas
      id="webgl"
      width="500"
      height="500"
      style="background-color: rgb(213, 213, 225)"
    ></canvas>
  </div>
</template>

<style scoped lang="less">
.webgl-test {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
</style>
