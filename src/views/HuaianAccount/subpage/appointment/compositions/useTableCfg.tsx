import type { IColumn } from '../../../components/CustomTable'
import { ElButton } from 'element-plus'
import type { h } from 'vue'

type TCreateVnode = typeof h

export function useTableCfg() {
  const deps = reactive({
    appointType: [
      { label: '个人', value: '1' },
      { label: '团体', value: '2' }
    ]
  })
  const config = shallowRef([
    {
      props: {
        label: '姓名',
        prop: 'name',
        minWidth: 100
      }
    },
    {
      props: {
        label: '身份证',
        prop: 'identityCode',
        minWidth: 140
      }
    },
    {
      props: {
        label: '手机号',
        prop: 'phoneNumber',
        minWidth: 140
      }
    },
    {
      props: {
        label: '预约类别',
        prop: 'appointType',
        minWidth: 80
      },
      formatter(h: TCreateVnode, cfg: IColumn & { deps: typeof deps }, scope: { row: any }) {
        const content =
          cfg.deps.appointType.find((item: any) => item.value === scope.row.appointType)?.label ||
          ''
        return <span>{content}</span>
      }
    },
    {
      props: {
        label: '人数',
        prop: 'count',
        minWidth: 80
      }
    },
    {
      props: {
        label: '状态',
        prop: 'status',
        minWidth: 80
      }
    },
    {
      props: {
        label: '预约时间',
        prop: 'appointTime',
        minWidth: 120
      }
    },
    {
      props: {
        label: '提交时间',
        prop: 'submitTime',
        minWidth: 120
      }
    },
    {
      props: {
        label: '操作',
        minWidth: 120
      },
      formatter(h: typeof h, cfg: IColumn & { deps: typeof deps }, scope: { row: any }) {
        return (
          <div>
            <ElButton type="primary" bg={false} link={true} onClick={() => handleReach(scope)}>
              已到场
            </ElButton>
            <ElButton type="primary" bg={false} link={true} onClick={() => handleDelete(scope)}>
              删除
            </ElButton>
          </div>
        )
      }
    }
  ] as IColumn[])
  return {
    deps,
    config
  }
}
