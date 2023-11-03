interface BindingOption {
  data: { [p: string]: any }
  key: string
  p?: number
  min?: number
  max?: number
  selector?: string
}
interface InputInfo {
  oldValue: string
  data: { [p: string]: any }
  key: string
  type: 'int' | 'float'
  p?: number
  min?: number
  max?: number
}
const limitElValueMap = new WeakMap<HTMLInputElement, InputInfo>()
const vLimitNumber = {
  mounted(el: HTMLElement, binding: { value: BindingOption }) {
    const bindingArgs = binding.value
    const inputEl = el.tagName === 'INPUT' ? el : el.querySelector(bindingArgs.selector || 'input')
    if (!inputEl) return
    init(inputEl as HTMLInputElement, bindingArgs)
  },
  updated(el: HTMLElement, binding: { value: BindingOption }) {
    const bindingArgs = binding.value
    const inputEl = el.tagName === 'INPUT' ? el : el.querySelector(bindingArgs.selector || 'input')
    if (!inputEl) return
    init(inputEl as HTMLInputElement, bindingArgs)
  },
  beforeUnmount(el: HTMLElement, binding: { value: BindingOption }) {
    const bindingArgs = binding.value
    const inputEl = el.tagName === 'INPUT' ? el : el.querySelector(bindingArgs.selector || 'input')
    if (!inputEl) return
    inputEl.removeEventListener('input', inputHandler)
    inputEl.removeEventListener('change', changeHandler)
  }
}
function init(inputEl: HTMLInputElement, bindingArgs: BindingOption) {
  const inputInfo = limitElValueMap.get(inputEl)
  if (inputInfo) {
    inputInfo.data = bindingArgs.data || {}
    inputInfo.key = bindingArgs.key || ''
    inputInfo.type = (bindingArgs.p && bindingArgs.p > 0) ? 'float' : 'int'
    inputInfo.p = bindingArgs.p
    inputInfo.min = bindingArgs.min
    inputInfo.max = bindingArgs.max
  } else {
    limitElValueMap.set(inputEl, {
      oldValue: '',
      data: bindingArgs.data || {},
      key: bindingArgs.key || '',
      type: (bindingArgs.p && bindingArgs.p > 0) ? 'float' : 'int',
      p: bindingArgs.p,
      min: bindingArgs.min,
      max: bindingArgs.max,
    })
    inputEl.addEventListener('input', inputHandler)
    inputEl.addEventListener('change', changeHandler)
  }
}
function inputHandler(e: Event) {
  const value = (e.target as HTMLInputElement).value
  const inputInfo = limitElValueMap.get(e.target as HTMLInputElement)
  if (!inputInfo) return
  const { data, key, type } = inputInfo
  let p = inputInfo.p
  p = p === undefined ? p : p < 1 ? 1 : p
  const floatReg = new RegExp(`^[+-]?\\d*(\\.\\d${p ? `{0,${p}}` : '*'})?$`)
  const intReg = new RegExp(`^[+-]?\\d*$`)
  const oldValue = inputInfo.oldValue || ''
  const reg = type === 'int' ? intReg : floatReg
  if (reg.test(value)) {
    data[key] = value
  } else {
    data[key] = oldValue
  }
  inputInfo.oldValue = data[key]
}
function changeHandler(e: Event) {
  const value = (e.target as HTMLInputElement).value
  const inputInfo = limitElValueMap.get(e.target as HTMLInputElement)
  if (!inputInfo) return
  const numberValue = parseFloat(value)
  const { data, key, min, max } = inputInfo
  if (isNaN(numberValue)) {
    data[key] = ''
  } else {
    if ((min || min === 0) && typeof min === 'number' && numberValue < min) {
      data[key] = min
    } else if ((max || max === 0) && typeof max === 'number' && numberValue > max) {
      data[key] = max
    } else {
      data[key] = numberValue
    }
  }
  inputInfo.oldValue = data[key]
}

export default vLimitNumber