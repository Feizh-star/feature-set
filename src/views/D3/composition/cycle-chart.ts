
import * as d3 from 'd3';
import { onMounted, ref  } from 'vue';

const test_data = [
  {
    "name": "0-19",
    "value": 200
  },
  {
    "name": "20-39",
    "value": 400
  },
  {
    "name": "40-59",
    "value": 100
  },
  {
    "name": "60-79",
    "value": 150
  },
  {
    "name": "80-100",
    "value": 150
  },
] 

export function useCycleChart() {
  const radianGradient = ref();
  onMounted(() => {
    if (radianGradient.value) {
      test(radianGradient.value, test_data);
    }
  })
  console.log(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), test_data.length).reverse())
  return {
    radianGradient
  }
}

function test(el: HTMLElement, data: Array<any>) {
  const width = el.offsetWidth;
  const height = el.offsetHeight;
  const radius = Math.min(width, height) / 2;

  // 创建一个圆弧
  const arc = d3.arc()
      .innerRadius(radius * 0.67)
      .outerRadius(radius - 1);

  // 创建1个饼图生成器，可以把数据映射到饼图
  const pie = d3.pie()
      .padAngle(1 / radius)
      .sort(null)
      .value(d => d.value);

  // 将离散的输入域映射到离散的输出域，就是将名称数组映射到颜色数组
  const color = d3.scaleOrdinal()
      .domain(data.map(d => d.name))
      // .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());
      .range(["rgb(66, 136, 181)", "rgb(169, 220, 162)", "rgb(251, 248, 176)", "rgb(252, 172, 99)", "rgb(209, 60, 75)"]);

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height]) // 这样原点坐标就是[0, 0]
      .attr("style", "max-width: 100%; height: auto;");

  svg.append("g")
    .selectAll()
    .data(pie(data))
    .join("path")
      .attr("fill", d => color(d.data.name))
      .attr("d", arc)
    .append("title")
      .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

  svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
    .selectAll()
    .data(pie(data))
    .join("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .call(text => text.append("tspan")
          .attr("y", "-0.4em")
          .attr("font-weight", "bold")
          .text(d => d.data.name))
      .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
          .attr("x", 0)
          .attr("y", "0.7em")
          .attr("fill-opacity", 0.7)
          .text(d => d.data.value.toLocaleString("en-US")));
  el.appendChild(svg.node())
}