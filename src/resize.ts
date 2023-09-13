// 多分辨率适配
const resize = () => {
  const designWidth = 1920
  const designHeight = 955
  const { width: docWidth, height: docHeight } = document.documentElement.getBoundingClientRect()
  const widthRatio = docWidth / designWidth
  const heightRatio = docHeight / designHeight
  const appStyle = (document.getElementById('app') as HTMLDivElement).style
  appStyle.width = `${designWidth}px`
  appStyle.height = `${designHeight}px`
  appStyle.transform = `scale(${widthRatio},${heightRatio})`
  appStyle.transformOrigin = 'left top'
}
resize()
window.onresize = () => {
  resize()
}

// 阻止子元素相同事件冒泡
document.getElementById('app')?.addEventListener('wheel', function (event) {
  event.stopPropagation()
})
// 禁用双指放大
document.documentElement.addEventListener(
  'touchstart',
  function (event) {
    if (event.touches.length > 1) {
      event.preventDefault()
    }
  },
  {
    passive: false,
  }
)
