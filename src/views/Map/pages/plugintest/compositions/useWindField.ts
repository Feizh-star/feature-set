import type { Ref } from 'vue'
import type TestMap from '../components/TestMap.vue'
import uvUrl from '../test/uv.png'

interface IUseWindProps {
  mapRef: Ref<InstanceType<typeof TestMap> | undefined>
}

export function useWindField({
  mapRef,
}: IUseWindProps) {
  // 初始化
  onMounted(() => {
    drawWindField()
  })
  function drawWindField() {
    if (!mapRef.value) return
    mapRef.value.drawWindField(uvUrl, {
      strokeColor: '#ffffff',
      vscale: 0.2,
    })
  }
}
