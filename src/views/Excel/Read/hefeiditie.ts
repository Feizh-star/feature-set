
const keyMap: any = {
  "A": "name",
  "B": "lng",
  "C": "lat",
  "D": "line",
}

export function parseSubway(sheetNames: any, sheets: any) {
  console.log(sheetNames, sheets)
  const sheet2 = sheets[sheetNames[0]]
  console.log(sheet2)
  const res = []

  let rowIndex = 1
  while (sheet2[`A${rowIndex}`]) {
    let colIndex = 'A'
    const rowObj = {} as { [prop: string]: any }
    rowObj['id'] = `s${rowIndex}`
    while (colIndex.charCodeAt(0) <= 'D'.charCodeAt(0)) {
      const key = keyMap[colIndex]
      rowObj[key] = sheet2[`${colIndex}${rowIndex}`]?.v || ''

      colIndex = String.fromCharCode(colIndex.charCodeAt(0) + 1)
    }
    res.push(rowObj)
    rowIndex++
  }
  res.forEach(item => {
    item.lat = parseFloat(item.lat)
    item.lng = parseFloat(item.lng)
  })
  const lineObj = {}
  for (const item of res) {
    const line = item.line
    if (!lineObj[line]) {
      lineObj[line] = []
    }
    lineObj[line].push(item)
  }
  console.log(JSON.stringify(lineObj, undefined, 2))
}