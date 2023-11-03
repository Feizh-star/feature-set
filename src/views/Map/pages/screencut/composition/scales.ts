const scales: any = {
  rain: {
    "r": 50,
    "g": 25,
    "b": 10,
    "a": 1
  },
  t: {
    "r": 10,
    "g": 10,
    "b": 10,
    "a": 1
  },
  speed: {
    "r": 10,
    "g": 10,
    "b": 10,
    "a": 1
  },
  rh: {
    "r": 10,
    "g": 10,
    "b": 10,
    "a": 1
  },
  lc_h: {
    "r": 1,
    "g": 1,
    "b": 1,
    "a": 1
  }
}
// 关于降水
scales['pre_1'] = scales['pre_3'] = scales['pre_6'] = scales['pre_12'] = scales['pre_24'] = scales['rain']
// 关于湿度
scales["soil_moisture"] = scales["rh"]
// 高空
scales['t_h'] = scales['speed_h'] = scales['rh_h'] = scales['t']


export default scales