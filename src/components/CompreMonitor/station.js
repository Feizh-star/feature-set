export default [
  {
    "stationIdC": "58323",
    "stationName": "肥东",
    "stationType": 0,
    "lon": "117.5000",
    "lat": "31.9000",
    "value": "58323",
    "label": "肥东"
  },
  {
    "stationIdC": "58220",
    "stationName": "长丰",
    "stationType": 0,
    "lon": "117.2000",
    "lat": "32.4000",
    "value": "58220",
    "label": "长丰"
  },
  {
    "stationIdC": "58321",
    "stationName": "合肥",
    "stationType": 0,
    "lon": "117.1000",
    "lat": "32.0000",
    "value": "58321",
    "label": "合肥"
  },
  {
    "stationIdC": "58320",
    "stationName": "肥西",
    "stationType": 0,
    "lon": "117.0000",
    "lat": "31.6000",
    "value": "58320",
    "label": "肥西"
  },
  {
    "stationIdC": "58327",
    "stationName": "庐江",
    "stationType": 0,
    "lon": "117.3000",
    "lat": "31.3000",
    "value": "58327",
    "label": "庐江"
  },
  {
    "stationIdC": "58326",
    "stationName": "巢湖",
    "stationType": 0,
    "lon": "117.8000",
    "lat": "31.6000",
    "value": "58326",
    "label": "巢湖"
  }
]


const option = {
  series: [
    {
      type: 'gauge',
      startAngle: 90,
      endAngle: -270,
      min: 0,
      max: 24,
      splitNumber: 24,
      progress: {
        show: true,
      },
      axisLine: {
        lineStyle: {
          width: 18,
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        distance: 0,
        length: 7,
        lineStyle: {
          width: 2,
          color: '#999'
        }
      },
      axisLabel: {
        distance: -40,
        color: '#999',
        fontSize: 20,
        formatter: function (value) {
          if (value === 24 || value % 6 !== 0) {
            return '';
          }
          return value + '';
        }
      },
      pointer: {
        length: "92%"
      },
      anchor: {
        show: true,
        showAbove: true,
        size: 25,
        itemStyle: {
          borderWidth: 10
        }
      },
      title: {
        show: false
      },
      detail: {
        show: false,
        valueAnimation: true,
        fontSize: 80,
        offsetCenter: [0, '70%']
      },
      data: [
        {
          value: 9,
          itemStyle: {
            color: "red",
          }
        }
      ]
    }
  ]
};