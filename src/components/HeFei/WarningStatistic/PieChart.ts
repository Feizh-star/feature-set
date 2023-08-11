import {
  OrthographicCamera,
  Scene,
  WebGLRenderer,
  Mesh,
  ShaderMaterial,
  BufferGeometry,
  BufferAttribute,
  Color,
  Raycaster,
} from "three";
// import { MapControls } from 'three/examples/jsm/controls/OrbitControls';

export interface dataOption {
  color: string;
  value: number;
}

export interface PieChartOption {
  r1: number;
  r2: number;
  data: dataOption[];
  onMouseIn?: (i: number) => void;
  onMouseOut?: () => void;
}
const vertexShader = /* glsl */ `
varying vec2 v_uv;
void main() { 
  v_uv =uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;
const fragmentShader = /* glsl */ `
varying vec2 v_uv;
uniform vec3 u_color;

void main() { 
  if(v_uv.x>0.5){
    gl_FragColor=vec4(u_color,v_uv.y);
  }else{
    float a=v_uv.y-0.6-max(0.5-v_uv.x,0.0)*2.0;
    gl_FragColor=vec4(u_color,a);
  }

 
}
`;

function createRing(r1: number, r2: number, start: number, end: number, color: string) {
  const step = 0.1;
  const geometry = new BufferGeometry();
  const position = [];
  const index = [];
  const uv = [];

  let angle = start;
  let cos = Math.cos(angle);
  let sin = Math.sin(angle);
  let z = 0;
  let opacity = 0;
  const opacityStep = 1 / ((end - start) / step);
  const r3 = (r1 + r2) / 2;
  position.push(r1 * cos, r1 * sin, z, r2 * cos, r2 * sin, z, r3 * cos, r3 * sin, z);
  uv.push(0, opacity, 0, opacity, 1, opacity);
  angle += step;
  z += step;
  opacity += opacityStep;
  let i = 0;

  while (angle < end) {
    cos = Math.cos(angle);
    sin = Math.sin(angle);
    position.push(r1 * cos, r1 * sin, z, r2 * cos, r2 * sin, z, r3 * cos, r3 * sin, z);
    uv.push(0, opacity, 0, opacity, 1, opacity);
    index.push(i, i + 5, i + 3, i, i + 2, i + 5, i + 2, i + 4, i + 5, i + 2, i + 1, i + 4);
    opacity += opacityStep;
    angle += step;
    z += step;
    i += 3;
  }

  cos = Math.cos(end);
  sin = Math.sin(end);
  position.push(r1 * cos, r1 * sin, z, r2 * cos, r2 * sin, z, r3 * cos, r3 * sin, z);
  uv.push(0, 1, 0, 1, 1, 1);
  index.push(i, i + 5, i + 3, i, i + 2, i + 5, i + 2, i + 4, i + 5, i + 2, i + 1, i + 4);

  i += 3;

  const center = [position[(i + 2) * 3], position[(i + 2) * 3 + 1]];
  const begin = [position[i * 3], position[i * 3 + 1]];
  let offset = Math.atan2(begin[1] - center[1], begin[0] - center[0]);
  const astep = Math.PI / 8;
  const r = (r2 - r1) / 2;
  let before = i;
  for (let l = 1; l <= 8; l++, z += step) {
    offset -= astep;
    position.push(center[0] + r * Math.cos(offset), center[1] + r * Math.sin(offset), z);
    uv.push(0, 1);
    index.push(before, i + 2, i + l + 2);
    before = i + l + 2;
  }

  geometry.attributes.position = new BufferAttribute(new Float32Array(position), 3);
  geometry.attributes.uv = new BufferAttribute(new Float32Array(uv), 2);
  geometry.index = new BufferAttribute(new Uint16Array(index), 1);
  const material = new ShaderMaterial({
    uniforms: {
      u_color: {
        value: new Color(color),
      },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const mesh = new Mesh(geometry, material);
  return mesh;
}

export class PieChart {
  private _scene = new Scene();
  private _camera: OrthographicCamera;
  private _renderer = new WebGLRenderer({
    alpha: true,
    antialias: true,
  });

  private _option: PieChartOption = {
    r1: 0.3,
    r2: 0.6,
    data: [],
  };
  private _i = -1;
  constructor(dom: HTMLDivElement, option: Partial<PieChartOption> = {}) {
    Object.assign(this._option, option);
    this._camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    this._camera.position.set(0, 0, 10);
    const size = Math.min(dom.offsetWidth, dom.offsetHeight);
    this._renderer.setSize(size, size);
    this._renderer.setClearColor(0x000000, 0.0);
    dom.appendChild(this._renderer.domElement);
    const raycaster = new Raycaster();
    const mouse = {
      x: 0,
      y: 0,
    };
    // const mesh = createRing(this._option.r1, this._option.r2, 0, 1, '#ff0000')
    this._renderer.domElement.addEventListener("mousemove", e => {
      mouse.x = (e.offsetX / size) * 2 - 1;
      mouse.y = (-e.offsetY / size) * 2 + 1;
      raycaster.setFromCamera(mouse, this._camera);
      const intersects = raycaster.intersectObjects(this._scene.children);
      if (intersects.length > 0) {
        this._i = intersects[0].object.userData.i;
        if (this._option.onMouseIn) {
          this._option.onMouseIn(this._i);
        }
      } else {
        if (this._i >= 0 && this._option.onMouseOut) {
          this._option.onMouseOut();
          this._i = -1;
        }
      }
    });
    this._update();
    // const control = new MapControls(this._camera, this._renderer.domElement)
    // control.addEventListener('change', () => {
    //   this._render()
    // })
  }
  set data(val: dataOption[]) {
    if (this._option.data != val) {
      this._option.data = val;
      this._scene.clear();
      this._update();
    }
  }
  private _render() {
    this._renderer.render(this._scene, this._camera);
  }
  private _update() {
    // this._scene.clear()
    let sum = 0;
    this._option.data.forEach(e => {
      sum += e.value;
    });
    if (sum > 0) {
      let offset = 0;
      this._option.data.forEach((e, i) => {
        const angle = (e.value / sum) * Math.PI * 2;
        const mesh = createRing(this._option.r1, this._option.r2, offset, offset + angle, e.color);
        mesh.userData = {
          i,
        };
        this._scene.add(mesh);
        offset += angle;
      });
    }
    this._render();
  }
}
