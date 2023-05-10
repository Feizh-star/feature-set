import * as zrender from 'zrender'

import type { ZRender, ZCircle } from '@/types/zrender'
export interface IZIns {
  zr: ZRender
}
export interface ICircleShape {
  circleShape: ZCircle
}
export type TzInstance = ReturnType<typeof reactive<IZIns>>

export function useCircleAnimate({ zInstance }: { zInstance: TzInstance }) {
  const crRadius = 30
  const cShape = shallowReactive<ICircleShape>({
    circleShape: {} as ZCircle
  })
  
  onMounted(() => {
    cShape.circleShape = drawShape(zInstance, crRadius)
  })

  function startAnimate() {
    const w = zInstance.zr.getWidth()
    cubicInOut(cShape.circleShape as ZCircle, w, crRadius)
  }
  function stopAnimate() {
    cShape.circleShape.stopAnimation(undefined, true)
  }
  return {
    startAnimate,
    stopAnimate,
  }
}

function drawShape(zIns: TzInstance, r = 30) {
  const h = zIns.zr.getHeight()
  const circle = new zrender.Circle({
    shape: {
      cx: r,
      cy: h / 2,
      r: r
    },
    style: {
      fill: 'none',
      stroke: '#F00'
    },
    silent: true
  });
  
  zIns.zr.add(circle);
  return circle
}
function cubicInOut(cr: ZCircle, w: number, r: number, d = true) {
  cr.animateTo({
    shape: {
      cx: d ? w - r : r
    }
  }, {
    duration: 5000,
    easing: 'cubicInOut',
    done() {
      cubicInOut(cr, w, r, !d)
    }
  })
}