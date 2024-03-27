import L from 'leaflet'
import { drawCircle, setTypColor } from './tools'
import typhoonGif from './assets/tf1.gif'
import type { Map, LatLngTuple, Marker } from 'leaflet'

export interface ITyphoonOption {
  zIndex?: number
  panePrefix?: string
  pointClick?: (pointData: any, pointOpt: any, pointInfo: any) => void
}
type IPaneNameMap = {
  [K in (typeof defaultPane)[number]['name']]: string
}

const defaultPane = Object.freeze([
  { name: 'typhoon-pathline' as const, zIndex: 0 },
  { name: 'typhoon-circle' as const, zIndex: 1 },
  { name: 'typhoon-gif' as const, zIndex: 2 },
  { name: 'typhoon-point' as const, zIndex: 3 },
])

export class Typhoon {
  static rotaryIcon = L.icon({ iconUrl: typhoonGif, iconAnchor: [20, 20] })
  static defaultZIndex = 1100

  map: Map
  options: ITyphoonOption
  typhoonData: any
  // 台风图层组：所有点、线、旋转gif
  typhoonLayerGroup: L.LayerGroup<any>
  // 风圈图层组
  typhoonCircleLayerGroup: L.LayerGroup<any>
  // 台风路径上的点线
  typhoonItemList: Array<any> = []
  // 是否已有风圈
  typhoonCircleInfo: any = null
  rotaryMarker: Marker<any> | null = null
  drawingTimer: any = null
  // pane名称
  paneName: IPaneNameMap = {} as IPaneNameMap
  // typhCirList: IAnyObject

  constructor(map: Map, data: any, options: ITyphoonOption) {
    if (!data) throw new Error('typhoon data is null')
    this.map = map
    this.options = options
    this.typhoonData = data
    this.typhoonLayerGroup = this.initTyphoonLayerGroup()
    this.typhoonCircleLayerGroup = this.initTyphoonCircleLayerGroup()
    this.initPane(options)
    // this.typhCirList = {}
    this.draw()
  }
  //
  initTyphoonLayerGroup() {
    return new L.LayerGroup().addTo(this.map)
  }
  //
  initTyphoonCircleLayerGroup() {
    return new L.LayerGroup().addTo(this.map)
  }
  initPane(opt: ITyphoonOption) {
    const zIndex = parseInt(opt.zIndex as any) ?? Typhoon.defaultZIndex
    if (!this.map) return
    defaultPane.forEach((paneInfo) => {
      const paneName = opt.panePrefix ? `${opt.panePrefix}_${paneInfo.name}` : paneInfo.name
      this.paneName[paneInfo.name] = paneName
      this.map!.createPane(paneName)
      const createdPane = this.map!.getPane(paneName)
      if (createdPane) {
        createdPane.style.zIndex = `${zIndex + paneInfo.zIndex}`
      }
    })
  }
  clear() {
    this.drawingTimer && clearTimeout(this.drawingTimer)
    this.typhoonLayerGroup && this.typhoonLayerGroup.clearLayers()
    this.typhoonCircleLayerGroup && this.typhoonCircleLayerGroup.clearLayers()
    this.typhoonItemList.forEach((item) => {
      if (item.type !== 'point' && item.type !== 'pre-point') return
      item.feature.off('click')
    })
    this.typhoonItemList = []
    this.typhoonCircleInfo = null
    this.rotaryMarker = null
    this.drawingTimer = null
    this.typhoonData = null
  }
  update(data: any) {
    if (!data) throw new Error('typhoon data is null')
    this.clear()
    this.typhoonData = data
    this.draw()
  }
  draw() {
    this.genBaseFeature()
    this.addFeatureToMap(this.typhoonItemList[0], 0, 10)
  }
  genBaseFeature() {
    if (!this.typhoonData) return
    // 台风路径信息
    const { typh_skdata } = this.typhoonData
    // 生成点、线、和旋转gif
    typh_skdata.forEach((point: any, index: number, array: Array<any>) => {
      const color = setTypColor(point.typhGrade)
      const latlng: LatLngTuple = [point.lat, point.lon]
      // 生成路径上的圆点
      this.genCircleMarker(point, { color, latlng, type: 'point' })
      if (index < array.length - 1) {
        // 生成路径上的线段
        this.genLine(point, array[index + 1], { color, latlng })
      } else {
        // 最后一个旋转的Marker
        this.genRotaryMarker(point, { latlng })
      }
    })
  }
  addFeatureToMap(element: any, index: number, interval?: number) {
    this.drawingTimer = setTimeout(() => {
      element.feature.addTo(this.typhoonLayerGroup)
      // 绘制过程中的临时旋转图标和风圈
      if (element.type === 'point') {
        if (this.rotaryMarker) this.typhoonLayerGroup.removeLayer(this.rotaryMarker)
        this.rotaryMarker = L.marker(element.point, {
          icon: Typhoon.rotaryIcon,
          pane: this.paneName['typhoon-gif'],
        }).addTo(this.typhoonLayerGroup)
        this.drawTyphoonCircle(element.data) // 风圈
      }
      //
      if (index < this.typhoonItemList.length - 1) {
        this.addFeatureToMap(this.typhoonItemList[index], ++index)
      } else {
        // 当index是最后一个的时候，开始绘制预测线
        this.drawingTimer = null
        this.prediction()
      }
    }, interval || 10)
  }
  // 画风圈
  drawTyphoonCircle(circleData: any) {
    if (this.typhoonCircleInfo) {
      this.typhoonCircleLayerGroup.clearLayers()
    }
    this.typhoonCircleInfo = {
      NE_l7: circleData.radiuBear1WingA7,
      NE_l10: circleData.radiuBear1WingA10,
      NW_l7: circleData.radiuBear2WingA7,
      NW_l10: circleData.radiuBear2WingA10,
      SE_l7: circleData.radiuBear3WingA7,
      SE_l10: circleData.radiuBear3WingA10,
      SW_l7: circleData.radiuBear4WingA7,
      SW_l10: circleData.radiuBear4WingA10,
      lat: circleData.lat,
      lon: circleData.lon,
    }
    drawCircle(this.typhoonCircleInfo, this.typhoonCircleLayerGroup, {
      pane: this.paneName['typhoon-circle'],
    })
  }
  prediction() {
    if (!this.typhoonData) return
    const {
      typh_skdata, // 台风路径信息
      typh_fcstdata, //
    } = this.typhoonData
    if (typh_fcstdata.length < 1) return

    const preLinePoints = [...typh_fcstdata]
    let prePoint = typh_skdata[typh_skdata.length - 1]
    for (const [index, point] of preLinePoints.entries()) {
      const color = setTypColor(point.typhGrade)
      const latlng: LatLngTuple = [point.lat, point.lon]
      this.genDashLine(prePoint, point, { color })
      this.genCircleMarker(point, { color, latlng, type: 'pre-point' })
      prePoint = point
    }
    this.typhoonItemList
      .filter((item) => item?.type?.startsWith('pre'))
      .forEach((p) => {
        p.feature.addTo(this.typhoonLayerGroup)
      })
  }
  genCircleMarker(data: any, opt: any) {
    const cPoint = L.circleMarker([...(opt.latlng as LatLngTuple)], {
      stroke: true,
      // color: opt.color,
      color: '#333',
      opacity: 1,
      weight: 1,
      fillColor: opt.color,
      fillOpacity: 1,
      radius: 5,
      pane: this.paneName['typhoon-point'],
    }).on('click', () => {
      this.drawTyphoonCircle(data)
      this.showTips(data, opt, cPoint)
    })
    this.typhoonItemList.push({
      type: opt.type,
      feature: cPoint,
      point: [...opt.latlng],
      data: data,
    })
    return cPoint
  }
  genLine(start: any, end: any, opt: any) {
    const nextLonlat: LatLngTuple = [end.lat, end.lon]
    const p = [[...opt.latlng], [...nextLonlat]]
    const shortLine = L.polygon(p, {
      color: opt.color,
      weight: 2,
      pane: this.paneName['typhoon-pathline'],
    })
    this.typhoonItemList.push({ type: 'line', feature: shortLine })
    return shortLine
  }
  genRotaryMarker(data: any, opt: any) {
    const windIcon = L.marker([...(opt.latlng as LatLngTuple)], {
      icon: Typhoon.rotaryIcon,
      pane: this.paneName['typhoon-gif'],
    })
    this.typhoonItemList.push({
      type: 'windIcon',
      feature: windIcon,
    })
    return windIcon
  }
  genDashLine(start: any, end: any, opt: any) {
    const linePoints = [
      [start.lat, start.lon],
      [end.lat, end.lon],
    ]
    const line = L.polyline(linePoints, {
      color: opt.color,
      weight: 2,
      dashArray: '20',
      pane: this.paneName['typhoon-pathline'],
    })
    this.typhoonItemList.push({ type: 'pre-line', feature: line })
  }
  showTips(pointData: any, pointOpt: any, pointInfo: any) {
    this.options.pointClick?.call(this.map, pointData, pointOpt, pointInfo)
  }
}
