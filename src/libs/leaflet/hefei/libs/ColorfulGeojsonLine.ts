import * as L from 'leaflet'
import { merge, deepCopy } from './tools'

const styleKeys = [
  'color',
  'dashArray',
  'dashOffset',
  'fill',
  'fillColor',
  'fillOpacity',
  'fillRule',
  'lineCap',
  'opacity',
  'smoothFactor',
  'weight',
]

interface IHighlightFeature {
  target: any
  feature: GeoJSON.Feature | null
  oldStyle: { [p: string]: any }
}
interface IHighlightFeatureColloction {
  selectedId: string
  subFeatures: IHighlightFeature[]
}
export interface ISelectionFeature {
  target: any
  feature: GeoJSON.Feature | null
  defaultStyle: { [p: string]: any }
}
interface IColorsRange {
  r: Array<number>
  g: Array<number>
  b: Array<number>
  v: Array<number>
}
interface IOptions {
  pane: string
  colors: IColorsRange
  style: { [p: string]: any }
  defaultColor: string
  enableHighlight: boolean
  highlightStyle: { [p: string]: any } | null
  strictSelect: boolean // 是否必须选一个，即clickout不会取消选中
  idKey: string
  activeStyle: { [p: string]: any }
  setSelectStyle?: (featureInfo: ISelectionFeature) => void
  event: {
    click: (e: L.LeafletMouseEvent, feature: GeoJSON.Feature) => void
    clickout: (e: L.LeafletMouseEvent, featureTarget: any) => void
    mousemove: (e: L.LeafletMouseEvent, feature: GeoJSON.Feature) => void
    mouseout: (e: L.LeafletMouseEvent, feature: GeoJSON.Feature, featureTarget: IHighlightFeatureColloction) => void
  }
  // eslint-disable-next-line
  getValue: (feature: GeoJSON.Feature) => number;
  eachStyle: (feature: GeoJSON.Feature) => { [p: string]: any }
}
export type ColorfulGeojsonOptions = Partial<IOptions>
const genDefaultOptions: () => IOptions = () => ({
  pane: 'road-mesh',
  colors: {
    r: [230, 231, 234, 56, 71],
    g: [2, 179, 236, 165, 236],
    b: [3, 24, 26, 223, 24],
    v: [0, 50, 100, 200, 500],
  },
  style: { weight: 4 },
  defaultColor: '#FFFFFF',
  enableHighlight: false,
  highlightStyle: {},

  strictSelect: false,
  idKey: 'properties.__id',
  activeStyle: {}, // 点击的默认激活样式
  event: {
    /* eslint-disable */
    click: (e: L.LeafletMouseEvent, feature: GeoJSON.Feature) => {},
    clickout: (e: L.LeafletMouseEvent, featureTarget: any) => {},
    mousemove: (e: L.LeafletMouseEvent, feature: GeoJSON.Feature) => {},
    mouseout: (e: L.LeafletMouseEvent, feature: GeoJSON.Feature, featureTarget: IHighlightFeatureColloction) => {},
  },
  getValue: (feature: GeoJSON.Feature) => Math.floor(Math.random() * 500),
  eachStyle: (feature: GeoJSON.Feature) => ({}),
  /* eslint-enable */
})

class ColorfulGeojson {
  private leafletMap!: L.Map
  private options: IOptions
  private colorfulGeojsonLayerGroup: L.LayerGroup
  private clickOnceFlag = false
  private geojsonLayer: L.GeoJSON | null = null
  // 保存了所有feature的信息
  private selectMap: Map<string, { selected: boolean; featureInfo: ISelectionFeature[] }> = new Map()
  // feature为null，则说明当前没有选中
  private clickHighlightFeature: { selectedId: string; subFeatures: ISelectionFeature[] } = {
    selectedId: '',
    subFeatures: [],
  }
  // 记录鼠标进出的feature信息
  private mousemoveHighlightFeature: IHighlightFeatureColloction = {
    selectedId: '',
    subFeatures: [],
    // target: null,
    // feature: null,
    // oldStyle: {},
  }

  _clickout: (event: L.LeafletMouseEvent) => void
  _mouseout: (event: L.LeafletMouseEvent) => void
  _getFeatureId(feature?: GeoJSON.Feature) {
    if (!feature) return ''
    const idKeys = this.options.idKey.split('.')
    return idKeys.reduce((p: any, c: any) => p && p[c], feature)
  }

  constructor(map: L.Map, options?: ColorfulGeojsonOptions) {
    this.options = genDefaultOptions()
    this.handleOptionMerge(options)
    this.leafletMap = map
    this.colorfulGeojsonLayerGroup = new L.LayerGroup().addTo(map)
    this._clickout = this.clickoutFunction.bind(this)
    this._mouseout = this.mouseoutFunction.bind(this)
  }
  handleOptionMerge(options?: ColorfulGeojsonOptions) {
    if (!options) return
    merge(this.options, options)
  }
  setColors(colors: IColorsRange) {
    this.options.colors = colors
  }
  /***********************************************************************************************************************/
  /* 添加或移除geojson */
  /***********************************************************************************************************************/
  setColorfulGeojson(geojson: GeoJSON.FeatureCollection, options?: ColorfulGeojsonOptions) {
    this.handleOptionMerge(options)
    this.removeColorfulGeojson()
    this.geojsonLayer = L.geoJSON(geojson, {
      pane: this.options.pane,
      style: {
        ...this.options.style,
      },
      onEachFeature: (feature, layer) => {
        const value = this.options.getValue(feature)
        const style = this.options.eachStyle(feature)
        const color = getColorByValue(this.options.colors, value, this.options.defaultColor)
        ;(layer as any).setStyle({
          ...style,
          color: color,
        })

        const idKeys = this.options.idKey.split('.')
        let featureId = idKeys.reduce((p: any, c: any) => p && p[c], feature)
        // 如果给的id的key是空的，则给它生成一个
        if (!featureId) {
          const randomKey = Math.random().toString(36).slice(2, 12)
          if (!feature.properties) feature.properties = {}
          feature.properties.__id = randomKey
          featureId = randomKey
        }
        const defaultStyle = {} as { [p: string]: any }
        const layerOptions = (layer as any).options as { [p: string]: any }
        for (const styleKey of styleKeys) {
          defaultStyle[styleKey] = layerOptions[styleKey]
        }
        const selectionFeatureObj = this.selectMap.get(featureId)
        if (selectionFeatureObj) {
          selectionFeatureObj.featureInfo.push({
            target: layer,
            feature: deepCopy(feature),
            defaultStyle,
          })
        } else {
          this.selectMap.set(featureId, {
            selected: false,
            featureInfo: [
              {
                target: layer,
                feature: deepCopy(feature),
                defaultStyle,
              },
            ],
          })
        }
      },
    })
    this.handleClick(this.geojsonLayer)
    this.handleMouseover(this.geojsonLayer)
    this.geojsonLayer.addTo(this.colorfulGeojsonLayerGroup)
  }
  removeColorfulGeojson() {
    this.leafletMap.off('click', this._clickout)
    if (this.geojsonLayer) {
      this.geojsonLayer.off('mouseout', this._mouseout)
      this.colorfulGeojsonLayerGroup.removeLayer(this.geojsonLayer)
    }
    // 清除选中信息
    if (this.clickHighlightFeature.selectedId) {
      this.cancelSelectFeature(this.clickHighlightFeature.selectedId)
    }
    // 清除feature信息
    this.selectMap.clear()
  }
  /***********************************************************************************************************************/
  /* 点击事件 */
  /***********************************************************************************************************************/
  /**
   * 处理自定义的点击（选中）事件
   * @param geojsonLayer: L.GeoJSON
   */
  handleClick(geojsonLayer: L.GeoJSON) {
    geojsonLayer.on('click', e => {
      this.handleClickout(e)
      this.selectFeature(this._getFeatureId(e.sourceTarget.feature))
      if (this.options.event?.click) {
        this.options.event.click(e, e.sourceTarget.feature)
      }
      this.clickOnceFlag = true
    })
    this.leafletMap.on('click', this._clickout)
  }
  /**
   * 处理自定义的点击外部（取消选中）事件
   * @param e L.LeafletMouseEvent
   */
  handleClickout(e: L.LeafletMouseEvent) {
    if (this.options.event?.clickout && this.clickHighlightFeature.selectedId) {
      this.options.event.clickout(e, this.clickHighlightFeature)
    }
    if (this.clickHighlightFeature.selectedId) {
      this.cancelSelectFeature(this.clickHighlightFeature.selectedId)
    }
  }
  /**
   * 鼠标点击线路外部
   * @param e L.LeafletMouseEvent
   */
  clickoutFunction(e: L.LeafletMouseEvent) {
    if (this.clickOnceFlag) {
      this.clickOnceFlag = false
      return
    }
    !this.options.strictSelect && this.handleClickout(e)
  }
  /***********************************************************************************************************************/
  /* feature选择 */
  /***********************************************************************************************************************/
  selectFeature(id: string) {
    const clickSelectionFeature = this.selectMap.get(id)
    if (!clickSelectionFeature) return
    clickSelectionFeature.selected = true
    const subFeatures: ISelectionFeature[] = []
    let selelctedId = ''
    for (const everyFeatureInfo of clickSelectionFeature.featureInfo) {
      if (this.options.setSelectStyle) {
        this.options.setSelectStyle(everyFeatureInfo)
      } else {
        everyFeatureInfo.target.setStyle({ ...this.options.activeStyle })
      }
      subFeatures.push({
        target: everyFeatureInfo.target,
        feature: deepCopy(everyFeatureInfo.feature),
        defaultStyle: { ...everyFeatureInfo.defaultStyle },
      })
      selelctedId = this._getFeatureId(everyFeatureInfo.feature as GeoJSON.Feature)
    }
    this.clickHighlightFeature = {
      selectedId: selelctedId,
      subFeatures,
    }
  }
  cancelSelectFeature(id: string) {
    const clickSelectionFeature = this.selectMap.get(id)
    if (!clickSelectionFeature) return
    clickSelectionFeature.selected = false
    for (const everyFeatureInfo of clickSelectionFeature.featureInfo) {
      everyFeatureInfo.target.setStyle({ ...everyFeatureInfo.defaultStyle })
      this.clickHighlightFeature = {
        selectedId: '',
        subFeatures: [],
      }
    }
  }
  getSelectionId() {
    if (!this.clickHighlightFeature.selectedId) return ''
    return this.clickHighlightFeature.selectedId
  }
  /***********************************************************************************************************************/
  /* 鼠标移入移出 */
  /***********************************************************************************************************************/
  handleMouseover(geojsonLayer: L.GeoJSON) {
    geojsonLayer.on('mousemove', e => {
      if (this.options.enableHighlight) {
        this.inStyleHandler(e, this.mousemoveHighlightFeature)
      }
      if (this.options.event?.mousemove) {
        this.options.event.mousemove(e, e.sourceTarget.feature)
      }
    })
    geojsonLayer.on('mouseout', this._mouseout)
  }
  /**
   * 鼠标离开
   * @param e L.LeafletMouseEvent
   */
  mouseoutFunction(e: L.LeafletMouseEvent) {
    if (this.options.enableHighlight) {
      this.outStyleHandler(this.mousemoveHighlightFeature)
    }
    if (this.options.event?.mouseout) {
      this.options.event.mouseout(e, e.sourceTarget.feature, this.mousemoveHighlightFeature)
    }
  }
  /**
   * 保留mousemove的原始样式
   * @param currentFeature IHighlightFeature
   */
  inStyleHandler(e: L.LeafletMouseEvent, currentFeature: IHighlightFeatureColloction) {
    for (const subFeature of currentFeature.subFeatures) {
      if (subFeature.target) {
        ;(subFeature.target as any).setStyle({ ...subFeature.oldStyle })
      }
      subFeature.target = e.sourceTarget
      subFeature.feature = deepCopy(e.sourceTarget.feature)
      subFeature.oldStyle = {}
      for (const key in this.options.highlightStyle) {
        subFeature.oldStyle[key] = e.sourceTarget.options[key]
      }
      e.sourceTarget.setStyle({
        ...this.options.highlightStyle,
      })
    }
  }
  /**
   * highlight的高亮样式还原
   * @param currentFeature IHighlightFeatureColloction
   */
  outStyleHandler(currentFeature: IHighlightFeatureColloction) {
    for (const subFeature of currentFeature.subFeatures) {
      if (subFeature.target) {
        ;(subFeature.target as any).setStyle({ ...subFeature.oldStyle })
      }
      subFeature.feature = null
      subFeature.target = null
      subFeature.oldStyle = {}
    }
    currentFeature.selectedId = ''
    currentFeature.subFeatures = []
  }
}

function getColorByValue(colors: IColorsRange, value: number, defaultColor: string) {
  if (!value && value !== 0) return defaultColor
  const valueRange = colors.v
  const colorIndex = valueRange.findIndex((tick: number, index: number, rangeArr: number[]) =>
    rangeArr[index + 1] ? value > tick && value <= rangeArr[index + 1] : value > tick
  )
  return colorIndex > -1 ? `rgb(${colors.r[colorIndex]},${colors.g[colorIndex]},${colors.b[colorIndex]})` : defaultColor
}

export default ColorfulGeojson
