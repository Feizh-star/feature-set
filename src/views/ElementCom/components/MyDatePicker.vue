<script lang="ts">
import moment from "moment";
type TenStartNums = 1 | 11 | 21;
type QuarterStartNums = 1 | 4 | 7 | 10;
export type TypeString = "date" | "datetime" | "week" | "month" | "year" | "ten" | "quarter";
export type TShortcuts = IShortcutsItem[];
interface IShortcutsItem {
  text: string;
  onClick: () => Date | Date[];
}
interface Props {
  modelValue: string[];
  type: TypeString;
  range?: boolean;
  format?: string;
  shortcuts?: TShortcuts;
  appendToBody?: any; // 仅仅用于取消本参数透传效果
  popupClass?: any; // 仅仅用于取消本参数透传效果
  disabledDate?: any; // 仅仅用于取消本参数透传效果
  disabledTime?: any; // 仅仅用于取消本参数透传效果
  scrollDuration?: any; // 仅仅用于取消本参数透传效果
  commonFormat?: string; // 仅用于没有format时的date和datetime
  disableStart?: Date;
  defaultTime?: string; // type是date时的默认时分，会在本组件modelValue输出时添上，输入时去掉
}

/**
 * 判断闰年
 */
export function isLeap(year: number) {
  if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
    return true;
  }
  return false;
}
/**
 * 获取根据月份获取天数
 */
export function getDaysByMonth(fullYear: number, month: number) {
  let days = 30;
  switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      days = 31;
      break;
    case 2:
      days = isLeap(fullYear) ? 29 : 28;
      break;
    default:
      days = 30;
  }
  return days;
}
export function dateToString(d: Date, formatter = "YYYY-MM-DD HH:mm") {
  return moment(d).format(formatter);
}
export function addHours(d: string, hours: number, formatter = "YYYY-MM-DD HH:mm") {
  return moment(d, formatter).add(hours, "h").format(formatter);
}
export function subHours(d: string, hours: number, formatter = "YYYY-MM-DD HH:mm") {
  return moment(d, formatter).subtract(hours, "h").format(formatter);
}
</script>

<script setup lang="ts">
import { ref, useAttrs, computed, watch, nextTick } from "vue";
import VueDatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";
import "vue-datepicker-next/locale/zh-cn.es";

const defaultValueType = "YYYY-MM-DD HH:mm";
const attrs = useAttrs();
const getValueType = () => {
  let { "value-type": valueType } = attrs;
  return (valueType || defaultValueType) as string;
};
const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ["", ""],
  range: false,
  type: "datetime",
  commonFormat: "YYYY-MM-DD HH:mm",
});
const emits = defineEmits<{
  (e: "update:modelValue", date: string[]): void;
  (e: "open"): void;
  (e: "pick", date: Date): void;
  (e: "calendar-change", date: Date[]): void;
}>();

// 处理value
const innerValue = computed({
  get() {
    let result: string[] | string;
    if (innerRange.value) {
      // 范围选择有个特殊情况：逐旬 逐季时需要对进来的日期进行范围格式化
      result = isTenQuarter.value ? parseInnerValueToRightFormat(props.modelValue[0], props.type) : props.modelValue;
    } else {
      if (props.type === "date" && props.defaultTime) {
        // 如果date类型，设置了默认时分，则输入的时候去掉
        result = dateToString(new Date(props.modelValue[0]), `YYYY-MM-DD 00:00:00`);
      } else {
        result = props.modelValue[0];
      }
    }
    return result;
  },
  set(value) {
    let result: string[] | string = "";
    if (Array.isArray(value)) {
      // value是一个数组，说明此时range或multiple是true，原封不动
      result = value;
    } else {
      // value是单个值，需要包装成数组
      result = packageStringDate(value, props.type);
    }
    emits("update:modelValue", result);
  },
});
// 在datepicker的type变化时，用当前（起始）时间触发innerValue的setter，使新的时间（区间）取值符合type
watch(
  () => props.type,
  newVal => {
    const currentDateString = Array.isArray(innerValue.value) ? innerValue.value[0] : innerValue.value;
    innerValue.value = parseInnerValueToRightFormat(currentDateString, newVal);
  }
);
function parseInnerValueToRightFormat(currentDateString: string, type: TypeString) {
  const valueType = getValueType();
  let result;
  switch (type) {
    case "ten":
      // 将时间转换为 当前旬时间段
      result = getTenRangeByDate(new Date(currentDateString)).map(d => dateToString(d, valueType));
      break;
    case "quarter":
      // 将时间转换为 当前季度时间段
      result = getQuarterRangeByDate(new Date(currentDateString)).map(d => dateToString(d, valueType));
      break;
    case "week":
    case "month":
    case "year":
    case "date":
    case "datetime":
      // 单日期，不变，其实把处理过程交给了 给innerValue赋值之后的setter
      result = currentDateString;
      break;
    default:
      result = currentDateString;
  }
  return result;
}
function packageStringDate(pickerValue: string, type: TypeString = props.type) {
  let result: string[] = [];
  const valueType = getValueType();
  switch (type) {
    case "date":
      if (props.defaultTime) {
        // 如果date类型，设置了默认时分，则输出的时候添加上
        result = [dateToString(new Date(pickerValue), `YYYY-MM-DD ${props.defaultTime}`)];
      } else {
        result = [pickerValue];
      }
      break;
    case "datetime":
      result = [pickerValue];
      break;
    case "week":
      // pickerValue是本周被点击的日期
      result = getWeekRange(pickerValue, valueType);
      break;
    case "month":
      result = getMonthRange(pickerValue, valueType);
      break;
    case "year":
      result = getYearRange(pickerValue, valueType);
      break;
    default:
      result = [pickerValue];
  }
  return result;
}
function getWeekRange(pickerValue: string, parseFormat: string) {
  const dateInWeek = new Date(new Date(pickerValue).setHours(0, 0, 0, 0));
  const dateInWeekString = dateToString(dateInWeek, parseFormat);
  const dayInWeek = dateInWeek.getDay() ? dateInWeek.getDay() : 7;
  const weekStart = subHours(dateInWeekString, (dayInWeek - 1) * 24, parseFormat);
  let weekEnd = dateToString(
    new Date(new Date(addHours(weekStart, 6 * 24, parseFormat)).setHours(23, 59, 59, 999)),
    parseFormat
  );
  const { disableStart } = props;
  if (disableStart) {
    weekEnd =
      new Date(weekEnd).getTime() - disableStart.getTime() > 0 ? dateToString(disableStart, parseFormat) : weekEnd;
  }
  return [weekStart, weekEnd];
}
function getMonthRange(pickerValue: string, parseFormat: string) {
  const monthStartDate = new Date(new Date(new Date(pickerValue).setDate(1)).setHours(0, 0, 0, 0));
  const monthStartDateString = dateToString(monthStartDate, parseFormat);
  const monthDays = getDaysByMonth(monthStartDate.getFullYear(), monthStartDate.getMonth() + 1);
  let monthEnd = dateToString(
    new Date(new Date(addHours(monthStartDateString, (monthDays - 1) * 24, parseFormat)).setHours(23, 59, 59, 999)),
    parseFormat
  );
  const { disableStart } = props;
  if (disableStart) {
    monthEnd =
      new Date(monthEnd).getTime() - disableStart.getTime() > 0 ? dateToString(disableStart, parseFormat) : monthEnd;
  }
  return [monthStartDateString, monthEnd];
}
function getYearRange(pickerValue: string, parseFormat: string) {
  const yearStartDate = new Date(new Date(new Date(pickerValue).setMonth(0, 1)).setHours(0, 0, 0, 0));
  const yearStartDateString = dateToString(yearStartDate, parseFormat);
  const yearDays = isLeap(yearStartDate.getFullYear()) ? 366 : 365;
  let yearEnd = dateToString(
    new Date(new Date(addHours(yearStartDateString, (yearDays - 1) * 24, parseFormat)).setHours(23, 59, 59, 999)),
    parseFormat
  );
  const { disableStart } = props;
  if (disableStart) {
    yearEnd =
      new Date(yearEnd).getTime() - disableStart.getTime() > 0 ? dateToString(disableStart, parseFormat) : yearEnd;
  }
  return [yearStartDateString, yearEnd];
}

const isTenQuarter = computed(() => props.type === "ten" || props.type === "quarter");
// 处理range，当type是ten或quarter时，忽略外部range参数，固定为true
const innerRange = computed(() => isTenQuarter.value || props.range);
// 处理type，当type是ten时，实际使用的type是date;当type是quarter时，实际使用的type是month
const innerType = computed(() => {
  if (props.type === "ten") return "date";
  if (props.type === "quarter") return "month";
  return props.type;
});

// 记录当前面板年月起始时间
const currentCalendarDate = ref();
watch(
  innerValue,
  newVal => {
    const paramStart = Array.isArray(newVal) ? newVal[0] : newVal;
    const paramStartDate = new Date(paramStart);
    currentCalendarDate.value = isNaN(paramStartDate.getTime()) ? new Date() : paramStartDate;
  },
  { immediate: true }
);
//切换年月事件
function calendarChange(date: Date[]) {
  openDate();
  currentCalendarDate.value = date[0];
  emits("calendar-change", date);
}
// pick事件
function pickDate(e: Date) {
  emits("pick", e);
}

// 处理format
const innerFormat = computed(() => {
  if (props.format) return props.format;
  const tenDayFormatValue = tenDayFormat.value;
  const quarterFormatValue = quarterFormat.value;
  let result = "";
  switch (props.type) {
    case "date":
      result = props.commonFormat ? props.commonFormat : "YYYY-MM-DD";
      break;
    case "datetime":
      result = props.commonFormat ? props.commonFormat : "YYYY-MM-DD HH:mm";
      break;
    case "week":
      result = "YYYY年第w周";
      break;
    case "ten":
      result = tenDayFormatValue;
      break;
    case "month":
      result = "YYYY年MM月";
      break;
    case "quarter":
      result = quarterFormatValue;
      break;
    case "year":
      result = "YYYY年";
      break;
    default:
      result = props.commonFormat;
  }
  return result;
});
const tenDayFormat = computed(() => {
  const date = new Date(innerValue.value[0]);
  const month = date.getDate();
  let num = "";
  if (month >= 1 && month <= 10) {
    num = "上旬";
  } else if (month >= 11 && month <= 20) {
    num = "中旬";
  } else if (month >= 21) {
    num = "下旬";
  }
  return `YYYY年MM月${num}`;
});
const quarterFormat = computed(() => {
  const date = new Date(innerValue.value[0]);
  const month = date.getMonth() + 1;
  let num = "";
  if (month >= 1 && month <= 3) {
    num = "一";
  } else if (month >= 4 && month <= 6) {
    num = "二";
  } else if (month >= 7 && month <= 9) {
    num = "三";
  } else if (month >= 10 && month <= 12) {
    num = "四";
  }
  return `YYYY年第${num}季度`;
});

/**
 * 禁止disableStart指定日期之后的时间选择-日期
 * @param date Date
 */
function disableDate(date: Date) {
  return props.disableStart ? date > props.disableStart : false;
}
/**
 * 禁止disableStart指定日期之后的时间选择-时间
 * @param date Date
 */
function disableTime(date: Date) {
  return props.disableStart ? date > props.disableStart : false;
}
/**
 * 将范围选择的“~”后面的内容去掉
 * @param inputSlotData input插槽的参数
 */
function inputSlotDataFormatter(inputSlotData: any) {
  return inputSlotData.value.split("~")[0] || inputSlotData.value;
}

/**
 * 实现旬和季选择
 */
/**
 * 根据日期获取上中下旬时间范围
 * @param currentDate 当前日期
 * @param startDay 指定当前天：1代表上旬，11代表中旬，21代表下旬
 */
function getTenRangeByDate(currentDate: Date, startDay?: TenStartNums) {
  const fullYear = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const dateInMonth = startDay || currentDate.getDate();
  const date = dateInMonth < 11 ? 1 : dateInMonth < 21 ? 11 : 21;
  const dateEnd = dateInMonth < 11 ? 10 : dateInMonth < 21 ? 20 : getDaysByMonth(fullYear, month);
  const newDate = new Date(`${fullYear}-${month < 10 ? `0${month}` : month}-${date} 00:00`);
  let newDateEnd = new Date(`${fullYear}-${month < 10 ? `0${month}` : month}-${dateEnd} 23:59`);
  const { disableStart } = props;
  if (disableStart) {
    newDateEnd = new Date(newDateEnd).getTime() - disableStart.getTime() > 0 ? disableStart : newDateEnd;
  }
  return [newDate, newDateEnd];
}
/**
 * 根据日期获取季度范围
 * @param currentDate 当前日期
 * @param startMonth 指定当前月：1代表第一季度，4代表第二季度，7代表第三季度，10代表第四季度，
 */
function getQuarterRangeByDate(currentDate: Date, startMonth?: QuarterStartNums) {
  const fullYear = currentDate.getFullYear();
  const month = startMonth || currentDate.getMonth() + 1;
  const monthStart = month < 4 ? 1 : month < 7 ? 4 : month < 10 ? 7 : 10;
  const monthEnd = month < 4 ? 3 : month < 7 ? 6 : month < 10 ? 9 : 12;
  const monthEndDate = getDaysByMonth(fullYear, monthEnd);

  const newDate = new Date(`${fullYear}-${monthStart < 10 ? `0${monthStart}` : monthStart}-01 00:00`);
  let newDateEnd = new Date(`${fullYear}-${monthEnd < 10 ? `0${monthEnd}` : monthEnd}-${monthEndDate} 23:59`);
  const { disableStart } = props;
  if (disableStart) {
    newDateEnd = new Date(newDateEnd).getTime() - disableStart.getTime() > 0 ? disableStart : newDateEnd;
  }
  return [newDate, newDateEnd];
}

/**
 * 快捷选项
 */
const tenShortcuts = [
  { text: "上旬", date: 1 },
  { text: "中旬", date: 11 },
  { text: "下旬", date: 21 },
] as const;
const quarterShortcuts = [
  { text: "第一季度", month: 1 },
  { text: "第二季度", month: 4 },
  { text: "第三季度", month: 7 },
  { text: "第四季度", month: 10 },
] as const;
const innerShortcuts = computed(() => {
  if (props.type === "ten") {
    return tenShortcuts.map(item => ({
      text: item.text,
      onClick: () => shortcutsClick<TenStartNums>(getTenRangeByDate, item.date),
    }));
  } else if (props.type === "quarter") {
    return quarterShortcuts.map(item => ({
      text: item.text,
      onClick: () => shortcutsClick<QuarterStartNums>(getQuarterRangeByDate, item.month),
    }));
  } else {
    return props.shortcuts;
  }
});
function shortcutsClick<nType = TenStartNums>(genTool: (d: Date, n: nType) => Date[], num: nType) {
  const currentDate = new Date(currentCalendarDate.value);
  return genTool(currentDate, num);
}

/**
 * 实现点击cell选中当前旬 和 季
 */
const datepicker = ref();
function openDate() {
  const cells = datepicker.value?.getElementsByClassName("cell");
  if (!cells) return;
  nextTick(() => {
    const cellArray = [...cells];
    const { type } = props;
    cellArray.forEach(c => {
      const div = c.children[0];
      // 如果是逐旬 逐季，拦截点击事件，且只拦截 天（逐旬）或 月（逐季）
      const needStop =
        (type === "ten" && c.getAttribute("data-index")) || (type === "quarter" && c.getAttribute("data-month"));
      if (needStop) {
        c.style.pointerEvents = "none";
        div.removeEventListener("click", cellClick);
        div.addEventListener("click", cellClick);
      } else {
        c.style.pointerEvents = "all";
        div.removeEventListener("click", cellClick);
      }
    });
    handleShortcutsDisable();
    emits("open");
  });
}
/**
 * 如果是逐旬 逐季，拦截点击事件
 * @param e Event
 */
function cellClick(e: Event) {
  e.stopPropagation();
  const td = (e.target as HTMLDivElement)?.parentNode;
  // 对于td是disabled，不做任何事
  if ((td as any).className?.includes("disabled")) return false;
  if (isTenQuarter.value) {
    const { type } = props;
    let cellValue = parseInt((e.target as HTMLDivElement).innerText || "1");
    cellValue = parseInt(cellValue < 10 ? `0${cellValue}` : `${cellValue}`);
    let currentDateString = "";
    if (type === "ten") {
      const currentDate = new Date((td as HTMLDivElement).title);
      const fullYear = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      currentDateString = `${fullYear}-${month < 10 ? `0${month}` : month}-${cellValue} 00:00`;
      emits("pick", new Date(new Date(currentDateString).setMonth(month - 1, cellValue)));
    } else if (type === "quarter") {
      const fullYear = getYearByCellElement(td as HTMLElement);
      currentDateString = `${fullYear}-${cellValue}-01 00:00`;
      emits("pick", new Date(new Date(currentDateString).setMonth(cellValue, 1)));
    }
    // 手动触发setter
    const result = parseInnerValueToRightFormat(currentDateString, props.type);
    innerValue.value = result;
  }
}

/**
 * 处理shortcuts禁选
 */
watch(currentCalendarDate, newVal => {
  handleShortcutsDisable();
});
function handleShortcutsDisable() {
  const { type, disableStart } = props;
  if (!disableStart || !currentCalendarDate.value) return;
  const calYear = currentCalendarDate.value.getFullYear();
  const calMonth = currentCalendarDate.value.getMonth() + 1;
  const shortcutsEls = datepicker.value?.getElementsByClassName("mx-btn-shortcut");
  const btns = [...shortcutsEls];
  for (const [index, btn] of btns.entries()) {
    setDisable(btn, false);
    if (type === "ten") {
      const calMonthStart = new Date(`${calYear}-${calMonth}-01 00:00:00`);
      if (calMonthStart.getTime() - disableStart.getTime() > 0) {
        // 当前面板月份大于禁选日期，全部禁选
        setDisable(btn, true);
        continue;
      }
      const indexToTen = [1, 11, 21] as const;
      const calIndexTen = getTenRangeByDate(calMonthStart, indexToTen[index]);
      if (calIndexTen[0].getTime() - disableStart.getTime() > 0) {
        setDisable(btn, true);
        continue;
      }
    }
    if (type === "quarter") {
      const calYearStart = new Date(`${calYear}-01-01 00:00:00`);
      if (calYearStart.getTime() - disableStart.getTime() > 0) {
        // 当前面板年份大于禁选日期，全部禁选
        setDisable(btn, true);
        continue;
      }
      const indexToTen = [1, 4, 7, 10] as const;
      const calIndexTen = getQuarterRangeByDate(calYearStart, indexToTen[index]);
      if (calIndexTen[0].getTime() - disableStart.getTime() > 0) {
        setDisable(btn, true);
        continue;
      }
    }
  }
}
function setDisable(b: HTMLButtonElement, disable: boolean) {
  b.disabled = disable;
  b.classList[disable ? "add" : "remove"]("disabled");
}
function getYearByCellElement(el: HTMLElement) {
  const targetClassName = "mx-calendar-panel-month";
  let targetNode = el;
  while (!targetNode.className.includes(targetClassName) && targetNode.tagName !== "BODY") {
    targetNode = targetNode.parentNode as HTMLElement;
  }
  if (!targetNode.className.includes(targetClassName)) return -1;
  const yearEl = targetNode.getElementsByClassName("mx-btn-current-year")[0] as HTMLElement;
  if (!yearEl) return -1;
  const year = parseInt(yearEl.innerText) || -1;
  return year;
}
</script>

<template>
  <VueDatePicker
    ref="datepicker"
    v-model:value="innerValue"
    :type="innerType"
    :range="innerRange"
    :format="innerFormat"
    :shortcuts="innerShortcuts"
    :disabled-date="disableDate"
    :disabled-time="disableTime"
    :popup-class="isTenQuarter ? 'popup-hideone' : ''"
    :class="{ 'input-hideone': isTenQuarter }"
    :append-to-body="false"
    :scroll-duration="0"
    @calendar-change="calendarChange"
    @pick="pickDate"
    @open="openDate"
  >
    <template #input="param" v-if="isTenQuarter">
      <div class="custom-input">{{ inputSlotDataFormatter(param) }}</div>
    </template>
  </VueDatePicker>
</template>

<style lang="less" scoped>
.input-hideone {
  width: 210px;
}
.custom-input {
  display: inline-block;
  box-sizing: border-box;
  width: 100%;
  height: 34px;
  padding: 6px 30px;
  padding-left: 10px;
  font-size: 14px;
  line-height: 1.4;
  color: #555;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  &:hover,
  &:focus {
    border-color: #409aff;
  }
}
</style>
<style lang="less">
.popup-hideone {
  .mx-calendar-range {
    .mx-calendar:nth-child(2) {
      display: none;
    }
    .mx-date-row,
    .mx-table-month {
      .cell {
        &.active:not(.not-current-month) {
          color: #73879c;
          background-color: #dbedfb;
        }
        > div {
          cursor: pointer;
          pointer-events: all;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        &.disabled > div {
          cursor: not-allowed;
        }
      }
    }
  }
  .mx-btn-shortcut.disabled {
    color: #a2b4c7;
    cursor: not-allowed;
  }
}
</style>
