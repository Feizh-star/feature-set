
/**
 * 加入ZrenderLayer类的图层类必须实现的属性和方法
 */
export interface IBaseChart {
  update: (...arg: any[]) => any
  clickout: (...arg: any[]) => any
}