
import FileSaver from "file-saver"
import * as XLSX from "xlsx"

export function exportTable(elTableRef, filename = 'sheet.xlsx') {
  const tableEl = getElTableToTable(elTableRef)
  let et = XLSX.utils.table_to_book(tableEl)
  let etout = XLSX.write(et, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'array'
  })
  try {
    FileSaver.saveAs(
      new Blob([etout], {
        type: 'application/octet-stream'
      }),
      filename
    )
  } catch (error) {
    console.error(error)
  }
}

function getElTableToTable(tRef) {
  const eltable = tRef?.$el
  const headerTableEl = eltable?.getElementsByClassName('el-table__header')[0]
  const headerTableElClone = headerTableEl.cloneNode(true)
  const bodyTableEl = eltable?.getElementsByClassName('el-table__body')[0]
  const tableBody = bodyTableEl?.getElementsByTagName('tbody')[0]
  const tableBodyClone = tableBody.cloneNode(true)
  headerTableElClone.appendChild(tableBodyClone)
  return headerTableElClone
}