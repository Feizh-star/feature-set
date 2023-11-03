import * as L from 'leaflet'
import * as zrender from 'zrender'
import type { LMap } from "./map"
import type { ZRender, ZGroup } from './types/zrender'
import type Area from './Area'
import { merge } from './utils/tools'

type ChartType = Area

export const MaskPaneName = 'zrender-mask'

export interface ZRenderLayerOption {
  zIndex: number
  pane: string
  mask: boolean
  dpi: number
}

const defaultOption = {
  zIndex: 1000,
  pane: 'zrender-pane',
  mask: true,
  dpi: window.devicePixelRatio,
}

class ZRenderLayer {
  private options: ZRenderLayerOption = defaultOption
  private zr!: ZRender
  private root: ZGroup = new zrender.Group()
  private chartSet: Set<ChartType> = new Set()
  private lmap: LMap
  private canvasElement!: HTMLCanvasElement
  public maskLayerZr: ZRender | null = null

  constructor(lmap: LMap, map: L.Map, opts: Partial<ZRenderLayerOption> = {}) {
    merge(this.options, opts)
    this.lmap = lmap
    this.addZrToMap(map)
  }

  private addZrToMap(map: L.Map) {
    let pane = map.getPane(this.options.pane);
    if (!pane) {
      pane = map.createPane(this.options.pane)
      pane.style.zIndex = `${this.options.zIndex}`
    } else {
      pane.style.zIndex = this.options.zIndex ? `${this.options.zIndex}` : pane.style.zIndex
    }
    
    const myRenderer = L.canvas({ padding: 0, pane: this.options.pane })
    myRenderer.addTo(map)
    // @ts-ignore
    const { _container: container } = myRenderer
    this.canvasElement = container
    this.zr = zrender.init(container, {
      devicePixelRatio: this.options.dpi,
    })
    this.zr.add(this.root)
    myRenderer.on('update', () => {
      this.update()
    })
    this.zr.on('click', (e) => {
      if (!e.target) {
        this.zrClickout()
      }
    })
  }

  public add(chart: ChartType) {
    if (this.chartSet.has(chart)) return
    if (chart.layer && chart.layer !== this) {
      throw new Error('图表已经被添加到其他图层！')
    }
    this.chartSet.add(chart)
    chart.layer = this
    this.root.add(chart.getRoot())
  }
  /**
   * 清除所有图层，todo：待完善
   */
  public clearLayers() {
    this.chartSet.clear()
    this.root.removeAll()
  }
  /**
   * 更新所有图层
   */
  public update() {
    for (const c of this.chartSet) {
      if (c.update) {
        c.update()
      } else {
        console.error({ message: '当前图层缺失update方法', chart: c })
      }
    }
  }
  /**
   * 通知所有图层触发了点击外部事件
   */
  private zrClickout() {
    for (const c of this.chartSet) {
      if (c.clickout) {
        c.clickout()
      } else {
        console.error({ message: '当前图层缺失clickout方法', chart: c })
      }
    }
  }
  /**
   * 获取地图实例
   * @returns 
   */
  public getMap() {
    return this.lmap
  }
  /**
   * 获取canvas
   */
  public getCanvas() {
    return this.canvasElement
  }
  /**
   * 刷新实例
   */
  public refresh() {
    this.zr.refresh()
  }
}

export default ZRenderLayer