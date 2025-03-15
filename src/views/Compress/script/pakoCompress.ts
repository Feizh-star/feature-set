import pako from 'pako'

// 第一步：舍入到1位小数
function roundTo1Decimal(arr) {
  return arr.map(num => Math.round(num * 10) / 10);
}

// 第二步：缩放和转换为整数
function scaleAndConvertToInt(arr, p = 1) {
  return arr.map(num => Math.round(num * Math.pow(10, p)));
}

// 第三步：差分编码
function deltaEncode(arr) {
  let deltas = [];
  for (let i = 0; i < arr.length; i++) {
      if (i === 0) {
          deltas.push(arr[i]);
      } else {
          deltas.push(arr[i] - arr[i - 1]);
      }
  }
  console.log(deltas)
  return deltas;
}

// 第四步：压缩数据
function compressData(arr) {
  let buffer = new Uint8Array(new Int32Array(arr).buffer);
  return pako.gzip(buffer);
}

// 第五步：转换为base64字符串
function toBase64String(buffer) {
  console.log(buffer)
  return btoa(String.fromCharCode.apply(null, buffer));
}

// 综合步骤
export function compressNumbers(arr, p = 1) {
  let rounded = roundTo1Decimal(arr);
  let integers = scaleAndConvertToInt(rounded, p);
  let deltas = deltaEncode(integers);
  let compressedBuffer = compressData(deltas);
  return toBase64String(compressedBuffer);
}

/* *************************************************************************************** */
// 从base64字符串转换为Uint8Array
function fromBase64String(base64) {
  let binaryString = atob(base64);
  let len = binaryString.length;
  let bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// 解压数据
function decompressData(compressedBuffer) {
  return new Int32Array(pako.ungzip(compressedBuffer).buffer);
}

// 差分解码
function deltaDecode(arr) {
  let original = [];
  for (let i = 0; i < arr.length; i++) {
      if (i === 0) {
          original.push(arr[i]);
      } else {
          original.push(arr[i] + original[i - 1]);
      }
  }
  return original;
}

// 缩放和转换为浮点数
function convertToFloat(arr, p = 1) {
  return arr.map(num => num / Math.pow(10, p));
}

// 综合步骤
export function decompressNumbers(base64String, p = 1) {
  let compressedBuffer = fromBase64String(base64String);
  let decompressedIntegers = decompressData(compressedBuffer);
  let originalIntegers = deltaDecode(decompressedIntegers);
  return convertToFloat(originalIntegers, p);
}