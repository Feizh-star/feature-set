<script setup lang="ts">

onMounted(() => {
  drawPoint()
})

function drawPoint() {
  //通过getElementById()方法获取canvas画布
  var canvas = document.getElementById('webgl') as HTMLCanvasElement
  //通过方法getContext()获取WebGL上下文
  var gl = canvas.getContext('webgl') as WebGLRenderingContext

  //顶点着色器源码
  var vertexShaderSource = `
    void main(){
      //给内置变量gl_PointSize赋值像素大小
      gl_PointSize=20.0;
      //顶点位置，位于坐标原点
      gl_Position =vec4(0.0,0.0,0.0,1.0);
    }
  `
  //片元着色器源码
  var fragShaderSource = `
    void main(){
      gl_FragColor = vec4(232.0,235.0,200.0,1.0);
    }
  `

  //初始化着色器
  var program = initShader(gl, vertexShaderSource, fragShaderSource)
  //开始绘制，显示器显示结果
  gl!.drawArrays(gl!.POINTS, 0, 1)

  //声明初始化着色器函数
  function initShader(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string) {
    //创建顶点着色器对象
    var vertexShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader
    //创建片元着色器对象
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader
    //引入顶点、片元着色器源代码
    gl.shaderSource(vertexShader, vertexShaderSource)
    gl.shaderSource(fragmentShader, fragmentShaderSource)
    //编译顶点、片元着色器
    gl.compileShader(vertexShader)
    gl.compileShader(fragmentShader)

    //创建程序对象program
    var program = gl.createProgram() as WebGLProgram
    //附着顶点着色器和片元着色器到program
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    //链接program
    gl.linkProgram(program)
    //使用program
    gl.useProgram(program)
    //返回程序program对象
    return program
  }
}
</script>

<template>
  <div class="webgl-first">
    <canvas id="webgl" width="500" height="500" style="background-color: rgb(213, 213, 225)"></canvas>
  </div>
</template>

<style scoped lang="less">
.webgl-first {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
</style>
