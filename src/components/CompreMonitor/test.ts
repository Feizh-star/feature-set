
const path = ref("");
function getPath(param: number) {
  const speed = param + 2;
  let res = "M0, 100 L0,0 ";
  let currentHeight = 0;
  // 20米的小三角数量
  const n1 = parseInt(speed / 20 + "");
  for (let i = 0; i < n1; i++) {
    res += `L40,${currentHeight} `;
    currentHeight += 20;
    res += `L0,${currentHeight} `;
  }
  // 4米的长线
  const n2 = parseInt((speed % 20) / 4 + "");
  for (let i = 0; i < n2; i++) {
    res += `L40,${currentHeight} `;
    currentHeight += 10;
    res += `M0,${currentHeight} `;
  }
  // 2米的短线
  const n3 = parseInt(((speed % 20) % 4) / 2 + "");
  for (let i = 0; i < n3; i++) {
    res += `L20,${currentHeight} `;
    currentHeight += 10;
    res += `M0,${currentHeight} `;
  }
  path.value = res;
  return res;
}
console.log(getPath(7));