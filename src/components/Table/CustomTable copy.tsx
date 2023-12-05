import { ElTable, ElTableColumn, ElLoadingDirective } from 'element-plus'
import { h, computed, defineComponent, useAttrs, withDirectives, resolveDirective } from 'vue'
export default defineComponent({
  props: {
    cols: {
      type: Array,
      default: () => []
    },
    loading: Boolean,
    commonProps: {
      type: Object,
      default: () => ({
        align: 'center',
        headerAlign: 'center',
        showOverflowTooltip: true
      })
    },
    childDepData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  directives: {
    loading: ElLoadingDirective
  },
  emits: ['update:loading'],
  setup(props, ctx) {
    const attrs = useAttrs()
    const tableKey = computed(() => (props.cols, Math.random().toString(36).slice(2, 10)))
    const showLoading = computed({
      get() {
        return props.loading
      },
      set(value) {
        ctx.emit('update:loading', value)
      }
    })
    const getElColumn = (columns: any[]) => {
      return columns.map((column) => {
        const type = column.props.type
        const formatter = column.formatter
        const headerFormatter = column.headerFormatter
        // ElTableColumn的default插槽：包含嵌套的ElTableColumn 或 具体内容
        const tableColumnDefaultSlot = (scope: { row: { [x: string]: any } }) => {
          if (column.children?.length > 0) {
            return getElColumn(column.children || [])
          } else if (Object.prototype.toString.call(formatter) === '[object Function]') {
            return formatter(h, { ...column, childDepData: props.childDepData }, scope)
          } else {
            return <span>{scope.row[column.props?.prop || ''] ?? ''}</span>
          }
        }
        // ElTableColumn的header插槽：包含嵌套的ElTableColumn 或 具体内容
        const tableColumnHeaderSlot = (scope: any) => {
          if (Object.prototype.toString.call(headerFormatter) === '[object Function]') {
            return headerFormatter(h, { ...column, childDepData: props.childDepData }, scope)
          } else {
            return <div>{column.props?.label || ''}</div>
          }
        }
        const scopedSlots: {
          header: (scope: any) => any
          default: ((scope: { row: { [x: string]: any } }) => any) | undefined
        } = {
          header: tableColumnHeaderSlot,
          default: undefined
        }
        if ((type !== 'index' && type !== 'selection') || formatter) {
          scopedSlots.default = tableColumnDefaultSlot
        }
        return h(
          ElTableColumn,
          {
            ...props.commonProps,
            ...column.props
          },
          scopedSlots
        )
      })
    }
    const tableProps = {
      rowStyle: { height: '36px' },
      cellStyle: { padding: 0 },
      ...attrs
    }
    return () =>
      withDirectives(
        h(ElTable, { ...tableProps, key: tableKey.value }, () => getElColumn(props.cols)),
        [
          [resolveDirective('loading'), showLoading.value] // loading指令
        ]
      )
  }
})
