import dataUrl from '@/assets/winddata/uv.png'

function getData(url: string) {
  const img = new Image()
  img.onload = function () {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.drawImage(img, 0, 0, img.width, img.height)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data; // 包含所有像素数据的一维数组
    console.log(pixels)
  }
  img.src = url
}

getData(dataUrl)