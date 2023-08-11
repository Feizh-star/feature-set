import { Circle, Group, Polygon, Text, registerPainter } from "zrender";
import CanvasPainter from "zrender/lib/canvas/Painter";

registerPainter("canvas", CanvasPainter);
/**
 * 创建根节点
 * @param width 画布宽
 * @param height 画布高
 * @returns 原点在画布中心的集合
 */
export function createRoot(width: number, height: number) {
  return new Group({
    x: width / 2,
    y: height / 2,
  });
}

/**
 * 创建背景
 * @param r 最大半径
 * @returns 5个同心圆
 */
export function createBackgroud(r: number) {
  const group = new Group();
  for (let i = 0; i < 5; i++) {
    group.add(
      new Circle({
        silent: true,
        shape: {
          r: r * (i + 1) * 0.2,
        },
        style: {
          fill: "none",
          stroke: "#fff",
          lineWidth: 1,
          strokeOpacity: 0.3,
        },
      })
    );
  }
  return group;
}

/**
 * 计算数据相关坐标
 * @param data 数据
 * @param max 最大值
 * @param r 最大半径
 * @returns 数据点和标签的坐标
 */
export function getDataPosition(data: number[], max: number, r: number) {
  const dAngle = (Math.PI * 2) / data.length;
  const datas: [number, number][] = [];
  const labels: [number, number][] = [];
  const l = r + 20;
  data.forEach((e, i) => {
    const d = (e / max) * r;
    const a = dAngle * i;
    const x = Math.sin(a);
    const y = -Math.cos(a);
    datas.push([d * x, d * y]);
    labels.push([l * x, l * y]);
  });
  return {
    datas,
    labels,
  };
}

/**
 * 创建数据线
 * @param points 控制点坐标
 * @param colors 控制点颜色
 * @param onFocus 数据被鼠标触碰的回调函数
 * @param onFocus 鼠标离开数据的回调函数
 * @returns 数据线和原点
 */
export function createSeries(
  points: [number, number][],
  colors: string[],
  onFocus: (i: number) => void,
  onLost: () => void
) {
  const group = new Group();
  for (let i = 0; i < 1; i += 0.1) {
    const a = 1 - i;

    const polygon = new Polygon({
      silent: true,
      shape: {
        points: points.map(() => [0, 0]),
      },
      style: {
        lineWidth: 1,
        stroke: "#59E4FF",
        fill: "#5FD5EC",
        fillOpacity: 0.2,
      },
    });
    polygon
      .animate("shape", false)
      .when(300, {
        points: points.map(p => [a * p[0], a * p[1]]),
      })
      .start();

    group.add(polygon);
  }
  points.forEach((p, i) => {
    const g = new Group();
    g.animate("", false)
      .when(300, {
        x: p[0],
        y: p[1],
      })
      .start();
    g.add(
      new Circle({
        silent: true,
        shape: {
          r: 2,
        },
        style: {
          fill: colors[i],
        },
      })
    );
    const circle = new Circle({
      shape: {
        r: 5,
      },
      style: {
        fill: "none",
        stroke: "#fff",
        lineWidth: 1,
      },
    });
    circle.on("mouseover", () => {
      onFocus(i);
      circle.attr({
        style: {
          stroke: colors[i],
        },
      });
    });
    circle.on("mouseout", () => {
      onLost();
      circle.attr({
        style: {
          stroke: "#fff",
        },
      });
    });
    g.add(circle);
    group.add(g);
  });

  return group;
}

/**
 * 创建标签
 * @param points 标签坐标点
 * @param labels 标签文本
 * @returns 标签
 */
export function createLabel(points: [number, number][], labels: string[]) {
  const group = new Group();
  points.forEach((p, i) => {
    group.add(
      new Text({
        silent: true,
        x: p[0],
        y: p[1],
        style: {
          fill: "#FFFFFF",
          fontSize: 10,
          text: labels[i],
          align: "center",
          verticalAlign: "middle",
        },
      })
    );
  });
  return group;
}
