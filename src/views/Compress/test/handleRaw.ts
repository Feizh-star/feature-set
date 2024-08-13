import testData from './8天的数据.json'

let dataList = testData.data.current.map(item => typeof item.power === 'number' && !isNaN(item.power) ? item.power : 0).slice(0, 480)
console.log(dataList)
dataList = dataList.map(item => Math.round(item * 40))
console.log(Math.max(...dataList), dataList.join(',').length)
dataList = dataList.map(item => decimalToBase64(item))
console.log(dataList)
const dataString = dataList.join('')
const valueMap = new Map()
for (const val of dataString) {
  let count = valueMap.get(val) || 0
  count++
  valueMap.set(val, count)
}
const freq = [...valueMap]
console.log(dataList, valueMap, dataString, dataString.length, freq)

function decimalToBase64(num) {
  const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  // 处理数字超过两位Base64字符的情况
  num = num % (64 * 64); // 限制为最多两位Base64字符

  // 计算低位字符
  const lowChar = base64Chars[num % 64];
  
  // 计算高位字符
  const highChar = num >= 64 ? base64Chars[Math.floor(num / 64)] : '0';

  return highChar + lowChar;
}
// 构建霍夫曼树的节点类
class Node {
  constructor(value, frequency) {
      this.value = value;
      this.frequency = frequency;
      this.left = null;
      this.right = null;
  }
}

// 构建霍夫曼树
function buildHuffmanTree(frequencies) {
  const nodes = frequencies.map(([value, frequency]) => new Node(value, frequency));
  
  while (nodes.length > 1) {
      nodes.sort((a, b) => a.frequency - b.frequency);
      const left = nodes.shift();
      const right = nodes.shift();
      
      const newNode = new Node(null, left.frequency + right.frequency);
      newNode.left = left;
      newNode.right = right;
      
      nodes.push(newNode);
  }
  
  return nodes[0];
}

// 生成霍夫曼编码
function generateHuffmanCodes(node, code = '', codes = {}) {
  if (!node) return;
  
  if (node.value !== null) {
      codes[node.value] = code;
  }
  
  generateHuffmanCodes(node.left, code + '0', codes);
  generateHuffmanCodes(node.right, code + '1', codes);
  
  return codes;
}

// 压缩数字序列
function compress(numbers, codes) {
  return numbers.map(number => codes[number]).join('');
}

// 示例使用
export function test(ds: string, fq: number[][]) {
  const numbers = ds.split('');
  const frequencies = fq;  // 假设预先计算好了频率

  const huffmanTree = buildHuffmanTree(frequencies);
  const huffmanCodes = generateHuffmanCodes(huffmanTree);

  console.log('霍夫曼编码:', huffmanCodes);

  const compressed = compress(numbers, huffmanCodes);
  console.log('压缩后的序列:', compressed, compressed.length);
  return compressed

  const compressedNumber: number[] = []
  for (let i = 0; i < Math.ceil(compressed.length / 8); i++) {
    const bits = compressed.substring(i * 8, 8 * (i + 1))
    compressedNumber.push(bits)
  }
  const last = compressedNumber.pop()
  if (last.length < 8) {
    const newStr = new Array(8 - last.length).fill(last[0] === '1' ? '0' : '1').join('')
    compressedNumber.push(newStr + last)
  }

  const numList = compressedNumber.map(item => Number(`0b${item}`))
  const base64 = btoa(String.fromCharCode.apply(null, new Uint8Array(frequencies.map(item => item[1]).concat(numList))))
  const result = frequencies.map(item => item[0]).join('') + base64
  console.log(result, result.length)
  return result
}

export function statisticsFreq(str: string) {
  const valueMap = new Map()
  for (const val of str) {
    let count = valueMap.get(val) || 0
    count++
    valueMap.set(val, count)
  }
  const freq = [...valueMap]
  return freq
}

// const prev = test(dataString, freq)


