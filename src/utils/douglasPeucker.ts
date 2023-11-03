interface DOption {
  lngKey: string
  latKey: string
}
export function douglasPeucker<T extends object>(
  points: T[],
  tolerance: number,
  option: DOption = { lngKey: 'lng', latKey: 'lat' }
): T[] {
  if (points.length < 3) {
    return points
  }

  const start = 0
  const end = points.length - 1
  let maxDistance = 0
  let index = 0

  for (let i = start + 1; i < end; i++) {
    const distance = perpendicularDistance(points[i], points[start], points[end], option)
    if (distance > maxDistance) {
      maxDistance = distance
      index = i
    }
  }

  if (maxDistance > tolerance) {
    const results1 = douglasPeucker(points.slice(start, index + 1), tolerance, option)
    const results2 = douglasPeucker(points.slice(index, end + 1), tolerance, option)

    return results1.slice(0, -1).concat(results2)
  } else {
    return [points[start], points[end]]
  }
}

function perpendicularDistance<T extends object>(point: T, start: T, end: T, option: DOption) {
  const startX = getValue(start, option.lngKey)
  const startY = getValue(start, option.latKey)
  const endX = getValue(end, option.lngKey)
  const endY = getValue(end, option.latKey)
  const x = getValue(point, option.lngKey)
  const y = getValue(point, option.latKey)
  const A = x - startX
  const B = y - startY
  const C = endX - startX
  const D = endY - startY
  const dot = A * C + B * D // 点积，(start, point)在(start, end)上的投影长度 与 (start, end)的模的乘积
  const lenSquared = Math.sqrt(C * C + D * D) // (start, end)的模
  const toStart = A * A + B * B // (start, point)的模，start，point，垂线交点组成的直角三角形的斜边的平方
  let result = 0
  if (lenSquared !== 0) {
    const projectionLength = dot / lenSquared // (start, 垂线交点)的长度，一条直角边的长度
    result = Math.sqrt(toStart - projectionLength * projectionLength) // 勾股定理
  } else {
    result = Math.sqrt(toStart) // start和end在一起
  }
  return result
}

function getValue(obj: any, key: string) {
  const keyPath = key.split('.')
  return keyPath.reduce((p: any, c: any) => p && p[c], obj)
}