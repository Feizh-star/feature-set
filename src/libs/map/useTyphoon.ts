import type { ShallowRef } from 'vue'
import { Typhoon, type ITyphoonOption } from './lib/typhoon'

export function useTyphoon({ mapIns }: { mapIns: ShallowRef<L.Map | null> }) {
  const typhoonIns = shallowRef<Typhoon | null>(null)
  // const typhoonData = shallowRef<any>()

  // watchEffect(() => {
  //   renderTyphoon()
  // })

  // function renderTyphoon() {
  //   if (!mapIns.value) return
  //   const typhData = typhoonData.value
  //   if (!typhData) return
  //   try {
  //     if (typhoonIns.value instanceof Typhoon) {
  //       typhoonIns.value.update(typhData)
  //     } else {
  //       typhoonIns.value = new Typhoon(mapIns.value, typhData, { zIndex: 1060 })
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }
  const drawTyphoon = (data: any, options: ITyphoonOption) =>
    drawTyphoonFunc(mapIns, typhoonIns, data, options)
  const updateTyphoon = (data: any) => updateTyphoonFunc(typhoonIns, data)
  const clearTyphoon = (thorough = false) => clearTyphoonFunc(typhoonIns, thorough)

  return {
    drawTyphoon,
    updateTyphoon,
    clearTyphoon,
  }
}

function drawTyphoonFunc(
  mapIns: ShallowRef<L.Map | null>,
  typhIns: ShallowRef<Typhoon | null>,
  data: any,
  options: ITyphoonOption
) {
  if (!mapIns.value) return
  clearTyphoonFunc(typhIns)
  typhIns.value = new Typhoon(mapIns.value, data, options)
  return typhIns.value
}

function updateTyphoonFunc(typhIns: ShallowRef<Typhoon | null>, data: any) {
  if (typhIns.value instanceof Typhoon) {
    typhIns.value.update(data)
  }
}

function clearTyphoonFunc(typhIns: ShallowRef<Typhoon | null>, thorough = false) {
  if (typhIns.value instanceof Typhoon) {
    typhIns.value.clear()
  }
  if (thorough) typhIns.value = null
}
