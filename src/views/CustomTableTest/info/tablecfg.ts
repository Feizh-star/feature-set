import type { h } from 'vue'
import type { IColumn } from '../../../components/CustomTable'
import { countyList } from '../../../utils/area'

const counties = [...countyList].slice(1)

export const temAve: IColumn[] = [
  {
    props: {
      label: '时间/站点',
      prop: 'time',
      minWidth: 180
    }
  },
  ...JSON.parse(JSON.stringify(counties)).map(
    (item: any) =>
      ({
        props: {
          label: item.name,
          prop: item.code,
          minWidth: 180
        }
      } as IColumn)
  )
]

export const temMax: IColumn[] = [
  {
    props: {
      label: '时间/站点',
      prop: 'time',
      minWidth: 180
    }
  },
  ...JSON.parse(JSON.stringify(counties)).map(
    (item: any) =>
      ({
        props: {
          label: item.name
        },
        children: [
          {
            props: {
              label: '最高气温',
              minWidth: 180
            },
            formatter(createVnode: typeof h, cfg: any, scope: any) {
              return createVnode('span', scope.row[item.code]?.tmax)
            }
          },
          {
            props: {
              label: '出现时间',
              minWidth: 180
            },
            formatter(createVnode: typeof h, cfg: any, scope: any) {
              return createVnode('span', scope.row[item.code]?.time)
            }
          }
        ]
      } as IColumn)
  )
]

export const temMin: IColumn[] = [
  {
    props: {
      label: '时间/站点',
      prop: 'time',
      minWidth: 180
    }
  },
  ...JSON.parse(JSON.stringify(counties)).map(
    (item: any) =>
      ({
        props: {
          label: item.name
        },
        children: [
          {
            props: {
              label: '最低气温',
              minWidth: 180
            },
            formatter(createVnode: typeof h, cfg: any, scope: any) {
              return createVnode('span', scope.row[item.code]?.tmin)
            }
          },
          {
            props: {
              label: '出现时间',
              minWidth: 180
            },
            formatter(createVnode: typeof h, cfg: any, scope: any) {
              return createVnode('span', scope.row[item.code]?.time)
            }
          }
        ]
      } as IColumn)
  )
]

export const temDiff: IColumn[] = [
  {
    props: {
      label: '时间/站点',
      prop: 'time',
      minWidth: 180
    }
  },
  ...JSON.parse(JSON.stringify(counties)).map(
    (item: any) =>
      ({
        props: {
          label: item.name,
          prop: item.code,
          minWidth: 180
        }
      } as IColumn)
  )
]

export const rainTotal: IColumn[] = [
  {
    props: {
      label: '时间/站点',
      prop: 'time',
      minWidth: 180
    }
  },
  ...JSON.parse(JSON.stringify(counties)).map(
    (item: any) =>
      ({
        props: {
          label: item.name,
          prop: item.code,
          minWidth: 180
        }
      } as IColumn)
  )
]

export const rainMax: IColumn[] = [
  {
    props: {
      label: '时间/站点',
      prop: 'time',
      minWidth: 180
    }
  },
  ...JSON.parse(JSON.stringify(counties)).map(
    (item: any) =>
      ({
        props: {
          label: item.name,
          prop: item.code,
          minWidth: 180
        }
      } as IColumn)
  )
]

export const rainDay: IColumn[] = [
  {
    props: {
      label: '时间/站点',
      prop: 'time',
      minWidth: 180
    }
  },
  ...JSON.parse(JSON.stringify(counties)).map(
    (item: any) =>
      ({
        props: {
          label: item.name,
          prop: item.code,
          minWidth: 180
        }
      } as IColumn)
  )
]

export const rainNight: IColumn[] = [
  {
    props: {
      label: '时间/站点',
      prop: 'time',
      minWidth: 180
    }
  },
  ...JSON.parse(JSON.stringify(counties)).map(
    (item: any) =>
      ({
        props: {
          label: item.name,
          prop: item.code,
          minWidth: 180
        }
      } as IColumn)
  )
]

export const prsAve: IColumn[] = [
  {
    props: {
      label: '时间/站点',
      prop: 'time',
      minWidth: 180
    }
  },
  ...JSON.parse(JSON.stringify(counties)).map(
    (item: any) =>
      ({
        props: {
          label: item.name,
          prop: item.code,
          minWidth: 180
        }
      } as IColumn)
  )
]

export const prsMax: IColumn[] = [
  {
    props: {
      label: '时间/站点',
      prop: 'time',
      minWidth: 180
    }
  },
  ...JSON.parse(JSON.stringify(counties)).map(
    (item: any) =>
      ({
        props: {
          label: item.name,
          prop: item.code,
          minWidth: 180
        }
      } as IColumn)
  )
]

export const prsMin: IColumn[] = [
  {
    props: {
      label: '时间/站点',
      prop: 'time',
      minWidth: 180
    }
  },
  ...JSON.parse(JSON.stringify(counties)).map(
    (item: any) =>
      ({
        props: {
          label: item.name,
          prop: item.code,
          minWidth: 180
        }
      } as IColumn)
  )
]

export const prsSea: IColumn[] = [
  {
    props: {
      label: '时间/站点',
      prop: 'time',
      minWidth: 180
    }
  },
  ...JSON.parse(JSON.stringify(counties)).map(
    (item: any) =>
      ({
        props: {
          label: item.name,
          prop: item.code,
          minWidth: 180
        }
      } as IColumn)
  )
]

export const humAve: IColumn[] = [
  {
    props: {
      label: '时间/站点',
      prop: 'time',
      minWidth: 180
    }
  },
  ...JSON.parse(JSON.stringify(counties)).map(
    (item: any) =>
      ({
        props: {
          label: item.name,
          prop: item.code,
          minWidth: 180
        }
      } as IColumn)
  )
]

export const humMin: IColumn[] = [
  {
    props: {
      label: '时间/站点',
      prop: 'time',
      minWidth: 180
    }
  },

  ...JSON.parse(JSON.stringify(counties)).map(
    (item: any) =>
      ({
        props: {
          label: item.name
        },
        children: [
          {
            props: {
              label: '最小相对湿度',
              minWidth: 180
            },
            formatter(createVnode: typeof h, cfg: any, scope: any) {
              return createVnode('span', scope.row[item.code]?.hmin)
            }
          },
          {
            props: {
              label: '出现时间',
              minWidth: 180
            },
            formatter(createVnode: typeof h, cfg: any, scope: any) {
              return createVnode('span', scope.row[item.code]?.time)
            }
          }
        ]
      } as IColumn)
  )
]

export const humMax: IColumn[] = [
  {
    props: {
      label: '时间/站点',
      prop: 'time',
      minWidth: 180
    }
  },

  ...JSON.parse(JSON.stringify(counties)).map(
    (item: any) =>
      ({
        props: {
          label: item.name
        },
        children: [
          {
            props: {
              label: '最大相对湿度',
              minWidth: 180
            },
            formatter(createVnode: typeof h, cfg: any, scope: any) {
              return createVnode('span', scope.row[item.code]?.hmax)
            }
          },
          {
            props: {
              label: '出现时间',
              minWidth: 180
            },
            formatter(createVnode: typeof h, cfg: any, scope: any) {
              return createVnode('span', scope.row[item.code]?.time)
            }
          }
        ]
      } as IColumn)
  )
]

export const windAve: IColumn[] = [
  {
    props: {
      label: '时间/站点',
      prop: 'time',
      minWidth: 180
    }
  },

  ...JSON.parse(JSON.stringify(counties)).map(
    (item: any) =>
      ({
        props: {
          label: item.name
        },
        children: [
          {
            props: {
              label: '风速',
              minWidth: 180
            },
            formatter(createVnode: typeof h, cfg: any, scope: any) {
              return createVnode('span', scope.row[item.code]?.speed)
            }
          },
          {
            props: {
              label: '风向',
              minWidth: 180
            },
            formatter(createVnode: typeof h, cfg: any, scope: any) {
              return createVnode('span', scope.row[item.code]?.dir)
            }
          }
        ]
      } as IColumn)
  )
]

export const windMax: IColumn[] = [
  {
    props: {
      label: '时间/站点',
      prop: 'time',
      minWidth: 180
    }
  },

  ...JSON.parse(JSON.stringify(counties)).map(
    (item: any) =>
      ({
        props: {
          label: item.name
        },
        children: [
          {
            props: {
              label: '最大风速',
              minWidth: 180
            },
            formatter(createVnode: typeof h, cfg: any, scope: any) {
              return createVnode('span', scope.row[item.code]?.speedmax)
            }
          },
          {
            props: {
              label: '风向',
              minWidth: 180
            },
            formatter(createVnode: typeof h, cfg: any, scope: any) {
              return createVnode('span', scope.row[item.code]?.dir)
            }
          },
          {
            props: {
              label: '出现时间',
              minWidth: 180
            },
            formatter(createVnode: typeof h, cfg: any, scope: any) {
              return createVnode('span', scope.row[item.code]?.time)
            }
          }
        ]
      } as IColumn)
  )
]

export const windHigh: IColumn[] = [
  {
    props: {
      label: '时间/站点',
      prop: 'time',
      minWidth: 180
    }
  },

  ...JSON.parse(JSON.stringify(counties)).map(
    (item: any) =>
      ({
        props: {
          label: item.name
        },
        children: [
          {
            props: {
              label: '极大风速',
              minWidth: 180
            },
            formatter(createVnode: typeof h, cfg: any, scope: any) {
              return createVnode('span', scope.row[item.code]?.speedhigh)
            }
          },
          {
            props: {
              label: '风向',
              minWidth: 180
            },
            formatter(createVnode: typeof h, cfg: any, scope: any) {
              return createVnode('span', scope.row[item.code]?.dir)
            }
          },
          {
            props: {
              label: '出现时间',
              minWidth: 180
            },
            formatter(createVnode: typeof h, cfg: any, scope: any) {
              return createVnode('span', scope.row[item.code]?.time)
            }
          }
        ]
      } as IColumn)
  )
]

export const windHour: IColumn[] = [
  {
    props: {
      label: '时间/站点',
      prop: 'time',
      minWidth: 180
    }
  },

  ...JSON.parse(JSON.stringify(counties)).map(
    (item: any) =>
      ({
        props: {
          label: item.name
        },
        children: [
          {
            props: {
              label: '风速',
              minWidth: 180
            },
            formatter(createVnode: typeof h, cfg: any, scope: any) {
              return createVnode('span', scope.row[item.code]?.speed)
            }
          },
          {
            props: {
              label: '风向',
              minWidth: 180
            },
            formatter(createVnode: typeof h, cfg: any, scope: any) {
              return createVnode('span', scope.row[item.code]?.dir)
            }
          }
        ]
      } as IColumn)
  )
]

export const sunHour: IColumn[] = [
  {
    props: {
      label: '时间/站点',
      prop: 'time',
      minWidth: 180
    }
  },
  ...JSON.parse(JSON.stringify(counties)).map(
    (item: any) =>
      ({
        props: {
          label: item.name,
          prop: item.code,
          minWidth: 180
        }
      } as IColumn)
  )
]

export const sunPert: IColumn[] = [
  {
    props: {
      label: '时间/站点',
      prop: 'time',
      minWidth: 180
    }
  },
  ...JSON.parse(JSON.stringify(counties)).map(
    (item: any) =>
      ({
        props: {
          label: item.name,
          prop: item.code,
          minWidth: 180
        }
      } as IColumn)
  )
]

export const genWeaTableCfg = (allList: { label: string; value: string }[], selList: string[]) => {
  const selSet = new Set(selList)
  const selOptions = allList.filter(item => selSet.has(item.value))
  return selOptions.map(item => ({
    props: {
      label: item.label,
      props: item.value,
      minWidth: 180
    }
  }))
}
