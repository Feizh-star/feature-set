interface DOption {
  lngKey: string
  latKey: string
}

export function createGrid<T extends object>(
  points: T[],
  gridSize: number,
  option: DOption = { lngKey: 'lng', latKey: 'lat' }
): T[] {
  const grid = new Map()
  for (const point of points) {
    const lng = getValue(point, option.lngKey)
    const lat = getValue(point, option.latKey)
    const x = Math.floor(lng / gridSize) * gridSize
    const y = Math.floor(lat / gridSize) * gridSize
    const d = pointDistance([x + gridSize / 2, y + gridSize / 2], [lng, lat])
    const gridKey = `${x.toFixed(10)}-${y.toFixed(10)}`
    if (!grid.has(gridKey)) {
      grid.set(gridKey, { p: point, d })
    } else {
      const gridPoint = grid.get(gridKey)
      if (d < gridPoint.d) grid.set(gridKey, { p: point, d })
    }
  }
  return Array.from(grid.values()).map(item => item.p)
}

function getValue(obj: any, key: string) {
  const keyPath = key.split('.')
  return keyPath.reduce((p: any, c: any) => p && p[c], obj)
}

function pointDistance(p1: [number, number], p2: [number, number]) {
  const dx = p1[0] - p2[0]
  const dy = p1[1] - p2[1]
  return Math.sqrt(dx * dx + dy * dy)
}