interface IShadowStyle {
  fillColor: string
  fillOpacity: number
}
type TBorderShapes = Array<{
  enable?: boolean
  offsetX?: number
  offsetY?: number
  z?: number
  style?: {
    [p: string]: any
  }
}>
export interface IShadowBorder {
  borderShapes: TBorderShapes
}
export interface ShadowMaskOption<C = IShadowStyle, S = IShadowBorder> {
  zIndex: number
  pane: string
  style: C
  shadowBorders: S
}
export type PartialShadowMaskOption = Partial<
  ShadowMaskOption<Partial<IShadowStyle>, Partial<IShadowBorder>>
>

const defaultPane = 'shadow-mask'
export const genDefaultOpt: () => ShadowMaskOption = () => ({
  zIndex: 1000,
  pane: defaultPane,
  style: {
    fillColor: '#000000',
    fillOpacity: 0.85,
  },
  shadowBorders: {
    borderShapes: [
      {
        enable: false,
        offsetX: 0,
        offsetY: 0,
        z: 30,
        style: {
          stroke: '#c800ff',
          fill: 'transparent',
          lineWidth: 2,
          shadowBlur: 30,
          shadowColor: '#c800ff',
        },
      },
      {
        enable: false,
        offsetX: 6,
        offsetY: 6,
        z: 20,
        style: {
          stroke: 'transparent',
          fill: '#bcc6db',
          lineWidth: 0,
        },
      },
      {
        enable: false,
        offsetX: 10,
        offsetY: 10,
        z: 10,
        style: {
          stroke: 'transparent',
          fill: '#a1b7e5',
          lineWidth: 0,
        },
      },
    ],
  },
})
