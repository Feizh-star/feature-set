import L from 'leaflet'
// 台风风圈
export function drawCircle(TF: any, typCirLayer: any, options: { pane: string }) {
  // 求出方位半径方向上弧形经纬度
  const getPoints = (center: any, cradius: any, startAngle: any) => {
    const radius = cradius / 100
    const pointNum = 90
    const endAngle = startAngle + 90
    const points = []
    let sin
    let cos
    let x
    let y
    let angle

    for (let i = 0; i <= pointNum; i++) {
      angle = startAngle + ((endAngle - startAngle) * i) / pointNum
      sin = Math.sin((angle * Math.PI) / 180)
      cos = Math.cos((angle * Math.PI) / 180)
      x = center[0] + radius * sin
      y = center[1] + radius * cos
      points.push([x, y])
    }
    return points
  }

  const r7Ne = getPoints([TF.lat, TF.lon], TF.NE_l7 == 999999 ? 0 : TF.NE_l7, 0)
  const r7Nw = getPoints([TF.lat, TF.lon], TF.NW_l7 == 999999 ? 0 : TF.NW_l7, 90)
  const r7Sw = getPoints([TF.lat, TF.lon], TF.SW_l7 == 999999 ? 0 : TF.SW_l7, 180)
  const r7Se = getPoints([TF.lat, TF.lon], TF.SE_l7 == 999999 ? 0 : TF.SE_l7, 270)
  // console.log(r7Ne)
  const polygon7 = L.polygon(
    [
      ...r7Ne, // 东北
      ...r7Nw, // 西北
      ...r7Sw, // 西南
      ...r7Se, // 东南
    ],
    {
      smoothFactor: 0.1,
      fillColor: 'rgb(0, 176, 15)',
      color: 'rgb(0, 176, 15)',
      weight: 1,
      pane: options.pane,
    }
  )
  const r10Ne = getPoints([TF.lat, TF.lon], TF.NE_l10 == 999999 ? 0 : TF.NE_l10, 0)
  const r10Nw = getPoints([TF.lat, TF.lon], TF.NW_l10 == 999999 ? 0 : TF.NW_l10, 90)
  const r10Sw = getPoints([TF.lat, TF.lon], TF.SW_l10 == 999999 ? 0 : TF.SW_l10, 180)
  const r10Se = getPoints([TF.lat, TF.lon], TF.SE_l10 == 999999 ? 0 : TF.SE_l10, 270)
  const polygon10 = L.polygon(
    [
      ...r10Ne, // 东北
      ...r10Nw, // 西北
      ...r10Sw, // 西南
      ...r10Se, // 东南
    ],
    {
      smoothFactor: 0.1,
      fillColor: 'rgb(248, 213, 0)',
      color: 'rgb(248, 213, 0)',
      weight: 1,
      pane: options.pane,
    }
  )
  typCirLayer && polygon10.addTo(typCirLayer)
  typCirLayer && polygon7.addTo(typCirLayer)
  return {
    polygon7,
    polygon10,
  }
}

// 根据台风等级不同渲染颜色
export function setTypColor(level: any) {
  let color
  switch (level) {
    case 'TD':
      color = '#eed139'
      break //6~7
    case 'TS':
      color = '#0000ff'
      break //8~9
    case 'STS':
      color = ' #0f8000'
      break //10~11
    case 'TY':
      color = ' #fe9c45'
      break //12~13
    case 'STY':
      color = ' #fe00fe'
      break //14~15
    case 'Super TY':
      color = ' #fe0000'
      break //16~
    case '超强台风(Super TY)':
      color = ' #fe0000'
      break //16~
    default:
      break
  }
  return color
}
