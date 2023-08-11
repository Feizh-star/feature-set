<template>
  <div
      class="moniAlertMap"
      :class="this.$store.state.style.theme == 'dark' ? 'dark' : 'light'"
  >
    <div id="map"></div>

    <div v-show="setMapClickPop" class="mapClickPop1" ref="mapClickPop1">
      <div class="mapClickPopTitle">
        <div>
          <i class="iconfont icon-weizhi"></i>
          <span>{{ moniName }}</span>
          <div @click="openInnerElDia()">设置监控</div>
        </div>
        <i class="iconfont icon-guanbi" @click="closePop1"></i>
      </div>
      <div class="tianqi">
        <div>
          <img
              :src="
              targetObj.weather == '999999'
                ? require('@/assets/images/moniAlert/nodata.png')
                : tianqiImg
            "
              alt=""
              srcset=""
          />
          {{ targetObj.weather == "999999" ? "暂无数据" : targetObj.weather }}
        </div>
        <div>
          <div>{{ targetObj.tem == 999999 ? "" : targetObj.tem }}℃</div>
          <div style="fontsize: 14px" v-if="(targetObj.windDirection == null || targetObj.windDirection == 999999) && (targetObj.windSpeed == null || targetObj.windSpeed == 999999)">--</div>
          <div style="fontsize: 14px" v-else>
            {{ targetObj.windDirection == null || targetObj.windDirection == 999999 ? "" : targetObj.windDirection }}
            {{ targetObj.windSpeed == null || targetObj.windSpeed == 999999 ? "" : targetObj.windSpeed }}
          </div>
        </div>
      </div>
      <div :id="chartId"></div>
      <div class="jinggao">
        <div class="leftIcon"><i class="iconfont icon-tishi"></i></div>
        <div class="rightDiv">
          {{ targetObj.preDesc }}
        </div>
      </div>
      <div class="tianqiyujing">
        <div v-if="targetObj.warningInfo && targetObj.warningInfo.length">
          <div
              class="data"
              v-for="(warn, index) in targetObj.warningInfo"
              :key="index"
          >
            <div class="tqyjTitle">
              <div
                  class="leftIcon"
                  :class="true ? iconColor(warn.warningType) : ''"
              >
                <img
                    :src="
                    require('@/assets/images/moniAlert/' +
                      warn.warningType +
                      '.png')
                  "
                    alt=""
                    srcset=""
                />{{ warn.warningType }}
              </div>
              <div class="rightTime">
                {{
                  transTime(
                      warn.publishTime,
                      "YYYYMMDDHHmmss",
                      "YYYY-MM-DD HH:mm:ss"
                  )
                }}
              </div>
            </div>
            <div class="tqyjBody">
              {{ warn.warningContent.substring(24) }}
            </div>
          </div>
        </div>
        <div v-else class="nodata">
          <img
              src="../../../assets/images/moniAlert/nodata.png"
              alt=""
              srcset=""
          />
          该监控目标暂无预警
        </div>
      </div>
    </div>
    <div v-if="pitchShow.length" class="pitchShowView">
      <span>[{{pitchShow[0][0]}},{{pitchShow[0][1]}}]</span>
      至
      <span v-if="pitchShow[1]">[{{pitchShow[1][0]}},{{pitchShow[1][1]}}]</span>
      <span class="clearLink" @click="clearPlane">清除</span>
    </div>
    <el-dialog
        :close-on-click-modal="false"
        :append-to-body="true"
        class="moniAlertMapDig"
        :class="this.$store.state.style.theme == 'dark' ? 'dark' : 'light'"
        title="设置监控预警"
        :visible.sync="setMoniDialog"
        @open="openInnerElDia()"
        @close="closeDialog"
    >
      <div class="tipItem">
        监控预警将根据配置信息不间断实时监控，如果短临预报与配置信息相符时，系统将自动发送预警信息至相关联系人
      </div>
      <div class="moniDigContent">
        <div class="contentTitle">监控名称</div>
        <div class="jiaInput">{{ moniName }}</div>
        <div class="contentTitle">监控规则</div>
        <el-form
            :key="concatRuleKey+1"
            :model="ruleFormData"
            ref="ruleFormDataRef"
            :rules="ruleFormDataRule"
            class="rulediv"
        >
          <el-form-item
              v-for="(item, index) in ruleFormData.ruleFormData"
              :key="index"
          >
            <div class="xrulediv">
              <!-- <el-switch v-model="item.kaiguan"></el-switch> -->
              <!-- <div class="firstDiv"></div> -->
              <el-form-item>
                <el-select v-model="item.warningCategory">
                  <el-option
                      v-for="item in warningCategoryArray"
                      :label="item"
                      :key="item"
                      :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                  :prop="`ruleFormData.${index}.warningType`"
                  :rules="[
                  {
                    required: true,
                    message: '请选择内容',
                    trigger: ['change'],
                  },
                ]"
              >
                <el-select v-model="item.warningType">
                  <el-option
                      v-for="item in warningTypeArray"
                      :key="item"
                      :label="item"
                      :value="item"
                      :disabled="filterWaTypeArr.indexOf(item) != -1"
                  ></el-option>
                </el-select>
              </el-form-item>
              <div class="small" v-if="item.warningType == '暴雨预警'">
                <div class="ruleSet">
                  条件设定
                  <div></div>
                </div>
                <el-form-item
                    :prop="`ruleFormData.${index}.warningCondition`"
                    :rules="[
                    {
                      required: true,
                      message: '请选择内容',
                      trigger: ['change'],
                    },
                  ]"
                >
                  <el-select v-model="item.warningCondition">
                    <el-option
                        v-for="item in warningConditionArray"
                        :label="item"
                        :key="item"
                        :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                    :prop="`ruleFormData.${index}.relationSymbol`"
                    :rules="[
                    {
                      required: true,
                      message: '请选择内容',
                      trigger: ['change'],
                    },
                  ]"
                >
                  <el-select v-model="item.relationSymbol">
                    <el-option
                        v-for="item in relationSymbolArray"
                        :key="item"
                        :label="item"
                        :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                    :prop="`ruleFormData.${index}.warningValue`"
                    :rules="[
                    {
                      required: true,
                      message: '请选择内容',
                      trigger: ['change'],
                    },
                  ]"
                >
                  <el-select v-model="item.warningValue">
                    <el-option
                        v-for="item in warningValueArray"
                        :key="item"
                        :label="item"
                        :value="item"
                        :disabled="filterWarnArr.indexOf(item) != -1"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="small" v-if="item.warningType == '暴雪预警'">
                <div class="ruleSet">
                  条件设定
                  <div></div>
                </div>
                <el-form-item
                    :prop="`ruleFormData.${index}.warningCondition`"
                    :rules="[
                    {
                      required: true,
                      message: '请选择内容',
                      trigger: ['change'],
                    },
                  ]"
                >
                  <el-select v-model="item.warningCondition">
                    <el-option
                        v-for="item in warningConditionArray2"
                        :label="item"
                        :key="item"
                        :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                    :prop="`ruleFormData.${index}.relationSymbol`"
                    :rules="[
                    {
                      required: true,
                      message: '请选择内容',
                      trigger: ['change'],
                    },
                  ]"
                >
                  <el-select v-model="item.relationSymbol">
                    <el-option
                        v-for="item in relationSymbolArray"
                        :key="item"
                        :label="item"
                        :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                    :prop="`ruleFormData.${index}.warningValue`"
                    :rules="[
                    {
                      required: true,
                      message: '请选择内容',
                      trigger: ['change'],
                    },
                  ]"
                >
                  <el-select v-model="item.warningValue">
                    <el-option
                        v-for="item in warningValueArray2"
                        :key="item"
                        :label="item"
                        :value="item"
                        :disabled="filterWarnArr.indexOf(item) != -1"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </el-form-item>
        </el-form>
        <div class="addRule">
          <el-button
              :type="ruleFormData.ruleFormData.length < 5 ? 'primary' : 'info'"
              :disabled="ruleFormData.ruleFormData.length > 4"
              @click="addNewRule"
          >+添加新规则
          </el-button
          >
          <el-button
              :type="ruleFormData.ruleFormData.length > 1 ? 'primary' : 'info'"
              :disabled="ruleFormData.ruleFormData.length <= 1"
              @click="delectNewRule"
              style="margin-right: 32px"
          >-删除规则
          </el-button
          >
          <el-radio v-model="allCondition" label="1">满足所有条件时</el-radio>
          <el-radio v-model="allCondition" label="0">满足任一条件时</el-radio>
        </div>
        <div class="contentTitle">监控频率</div>
        <el-form
            :key="concatRuleKey+2"
            :model="frequencyFormData"
            ref="frequencyFormRef"
            :rules="frequencyFormRule"
            class="frequencyDiv"
        >
          <el-form-item>
            <div class="flexDiv">
              <div class="leftdiv">检查频率</div>
              <el-form-item prop="checkFrequency">
                <el-select v-model="frequencyFormData.checkFrequency">
                  <el-option
                      v-for="item in checkFrequencyArray"
                      :key="item"
                      :label="item"
                      :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="flexDiv">
              <div class="leftdiv">监控周期</div>
              <el-form-item prop="moniPeriodF">
                <el-date-picker
                    v-model="frequencyFormData.moniPeriodF"
                    type="date"
                    placeholder="选择日期"
                    :picker-options="pickerOptions0"
                >
                </el-date-picker>
              </el-form-item>
              &#12288;至&#12288;
              <el-form-item prop="moniPeriodE">
                <el-date-picker
                    v-model="frequencyFormData.moniPeriodE"
                    type="date"
                    placeholder="选择日期"
                    :picker-options="pickerOptions0"
                >
                </el-date-picker>
              </el-form-item>
              <el-checkbox
                  style="margin-left: 32px"
                  label="周末除外"
                  v-model="frequencyFormData.weekend"
              ></el-checkbox>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="flexDiv">
              <div class="leftdiv">预警接收人</div>
              <div class="rightBigDiv">
                <div
                    v-for="(item, index) in frequencyFormData.linkman"
                    :key="index"
                >
                  <el-form-item
                      :prop="`linkman.${index}.contactsGroupName`"
                      :rules="[
                      {
                        required: true,
                        message: '请选择内容',
                        trigger: ['change'],
                      },
                    ]"
                      style="margin-right: 20px"
                  >
                    <el-select v-model="item.contactsGroupName">
                      <el-option
                          v-for="(peopel, indexp) in linkmanList"
                          :key="indexp"
                          :label="peopel"
                          :value="peopel"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-checkbox-group v-model="item.checkboxGroup">
                    <el-checkbox-button
                        v-for="func in cGroup1"
                        :label="func"
                        :key="func"
                        :disabled="true"
                    ></el-checkbox-button>
                  </el-checkbox-group>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="addRule">
              <!-- <div class="leftdiv"></div> -->
              <el-button
                  type="primary"
                  @click="addReceivePeople"
                  id="addRecvPerson_guidance"
              >+添加接收人
              </el-button
              >
              <el-button
                  :type="
                  frequencyFormData.linkman.length > 1 ? 'primary' : 'info'
                "
                  :disabled="frequencyFormData.linkman.length <= 1"
                  @click="delectReceivePeople"
              >-删除接收人
              </el-button
              >
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- :disabled="isSubmit()" -->
        <el-tooltip
            v-if="username !== 'Xiningshi123'"
            class="item"
            effect="dark"
            content="当前为试用版,暂不能提供短信提醒"
            placement="top"
        >
          <el-button
              type="primary"
              class="dialogBtn confirmBtn"
              @click="saveSubmit('ruleFormDataRef', 'frequencyFormRef')"
          >保 存</el-button>
        </el-tooltip>
        <el-button
            v-else
            type="primary"
            class="dialogBtn confirmBtn"
            @click="saveSubmit('ruleFormDataRef', 'frequencyFormRef')"
        >保 存</el-button>
        <el-button class="dialogBtn" @click="closeDialog"> 取 消 </el-button>
      </span>
    </el-dialog>
    <el-dialog 
      :visible.sync="monitorVisible"
      :close-on-click-modal="false"
      append-to-body
      class="moniAlertMapDig video"
      :class="this.$store.state.style.theme == 'dark' ? 'dark' : 'light'"
      title="监控视频"
      v-draggable="{ 
        target: '.el-dialog', 
        drag: '.el-dialog__header', 
        draggable: true, 
        visible: monitorVisible, 
        closeBack: true 
      }"
    >
      <div class="monitor-video">
        <video :src="monitorVideoSrc" controls autoplay loop></video>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Highcharts from "highcharts/highstock";
import loadExporting from "highcharts/modules/exporting";
import exportExcel from "highcharts/modules/export-data.src";
import {init_fenghuotai} from "@/utils/mapTools_new/maps";
import { debounce } from '@/utils/utils.js'
import moment from "moment";
import draggable from '@/directives/draggable.js'
import monitorPoint from './monitor-point.json'
import {
  getMoniBigClass,
  getMoniWarnClass,
  getAppointWarnCondition,
  getMoniFrequency,
  getLoginUser,
  saveMoniConfigInfo,
  getOneMonitorTargetAlarmDetails,
  getWarningMonitorConfigInfo,
  getRiskPointFuture2hPreData,
  getRiskPointLast24hPreData,
} from "@/api/moniAlert.js";
import {getContactsGroupByUserName} from "@/api/contacts";
import damageInfo from "@/assets/damageInfo/damage";
import damageInfoXn from "@/assets/damageInfo/damage_xn.json";
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import "leaflet.markercluster"
import $ from 'jquery'
import {driveRoutePlan} from "@/api/test";
window.jquery = $

loadExporting(Highcharts);
exportExcel(Highcharts);

function addTestPoint(map, data) {
  console.log(map, data)
  
  const circleShadow = () => {
    return L.divIcon({
      className: "damagePoints",
      iconAnchor: [42, 42],
      html: `<div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${'#ff0000'}"></div>`,
    });
  }
  for (const p of data) {
    const point = [p.lat, p.lng]
    L.marker(point, {
      icon: circleShadow(),
    }).bindPopup(`
      <div style="width: 180px; padding: 18px; background-color: #333;">
        <div style="padding-bottom: 10px;">名称：${p.name}</div>
        <div style="padding-bottom: 10px;">经度：${p.lng}</div>
        <div style="padding-bottom: 10px;">纬度：${p.lat}</div>
      </div>
    `).addTo(map)
  }
}
export default {
  name: "moniAlertMap",
  props: ['selPrefecture', 'hasDangerAreaUser', 'layersOptions'],
  data() {
    return {
      pitchShow: [],
      stepsLine: null,
      layerChangerShow: false,
      concatRuleKey: 1121,
      username: localStorage.getItem('username'),
      moniDialogData: {},
      frequencyFormRule: {
        checkFrequency: [
          {
            required: true,
            message: "请选择频率",
            trigger: ["blur", "change"],
          },
        ],
        moniPeriodF: [
          {
            required: true,
            message: "请选择时间",
            trigger: ["blur", "change"],
          },
        ],
        moniPeriodE: [
          {
            required: true,
            message: "请选择时间",
            trigger: ["blur", "change"],
          },
        ],
        receive: {
          contactsGroupName: {
            required: true,
            message: "请选择接收人",
            trigger: ["blur", "change"],
          },
        },
      },
      ruleFormDataRule: {
        warningCondition: [
          {
            required: true,
            message: "请选择内容",
            trigger: ["change"],
          },
        ],
        relationSymbol: [
          {
            required: true,
            message: "请选择内容",
            trigger: ["change"],
          },
        ],
        warningValue: [
          {
            required: true,
            message: "请选择内容",
            trigger: ["change"],
          },
        ],
      },
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      frequencyFormData: {
        checkFrequency: "",
        moniPeriodF: "",
        moniPeriodE: "",
        linkman: [{contactsGroupName: "", checkboxGroup: ["短信"]}],
        weekend: 0,
      },
      targetObj: {},
      groupName: "",
      moniName: "",
      tianqiImg: "",
      xTime: [],
      yValue: [],
      // yLevel: [],
      time1: "",
      time2: "",
      chartId: "jiangshuiliang",
      setMoniDialog: false,
      setMapClickPop: false,
      popupWarn: "",
      moniDialogForm: {
        name: "四川师范大学天气预警",
        addrule: "all",
      },
      checkFrequencyArray: ["实时"],
      receiverArray: [],
      ruleArray: [],
      linkmanList: [],
      cGroup1: ["微信", "电话", "短信", "邮件", "钉钉"],
      warningCategoryArray: ["天气预警"],
      warningTypeArray: ["暴雨预警"],
      warningConditionArray: ["降雨等级"],
      warningConditionArray2: ["降雪等级"],
      relationSymbolArray: ["大于等于"],
      warningValueArray: ["中雨", "大雨", "暴雨", "大暴雨", "特大暴雨"],
      warningValueArray2: ["小雪", "中雪", "大雪", "暴雪"],
      ruleFormData: {
        ruleFormData: [
          {
            warningCategory: "天气预警", //预警大类
            warningType: "", //预警种类
            warningCondition: "", //预警条件
            relationSymbol: "", //关系符号
            warningValue: "", //预警阈值
          },
        ],
      },
      optionGroup1: [],
      optionGroup2: [],
      optionGroup3: [],
      optionGroup4: [],
      moniDialogRule: {},
      warnContent: "",
      targetLayer: null,
      allCondition: "0",
      imgLayer: null,
      getLayerAlarmsRequest: null,
      filterWarnArr: [],
      filterWaTypeArr: [],
      dialogKey: "1",
      damagePointsPopup: null,
      alertLayer: null,
      monitorVisible: false,
      monitorVideoSrc: '/video/test.mp4'
    };
  },
  directives: {
    draggable,
  },
  methods: {
    init_fenghuotai,
    initLayer() {
      this.minLayer = new L.LayerGroup().addTo(this.map);
      this.map.createPane("min");
      this.map.getPane("min").style.zIndex = 1001; //地图是1000
      this.iconshadowLayer = new L.LayerGroup().addTo(this.map);
      this.map.createPane("iconshadow");
      this.map.getPane("iconshadow").style.zIndex = 1009;
      this.iconLayer = new L.LayerGroup().addTo(this.map);
      this.map.createPane("icon");
      this.map.getPane("icon").style.zIndex = 1020;
      this.popupLayer = new L.LayerGroup().addTo(this.map);
      this.map.createPane("popup");
      this.map.getPane("popup").style.zIndex = 1100;
      this.map.createPane("currentTargetMarkerBox");
      this.map.createPane("iconName");
      this.map.getPane("iconName").style.zIndex = 2000;
      this.targetLayer = new L.LayerGroup().addTo(this.map);
      this.imgLayer = new L.LayerGroup().addTo(this.map);
      this.stormLayer = new L.LayerGroup().addTo(this.map);
      this.map.on("click", (e) => {
        this.$emit("mapClick", e.latlng.lat, e.latlng.lng);
        this.$emit("addMarker", [e.latlng.lat, e.latlng.lng], this.map);
        this.pitchPoint([e.latlng.lat, e.latlng.lng])
      });
      this.map.on("movestart mousedown", () => {
        // this.setMapClickPop = false;
      });
      this.alertLayer = new L.LayerGroup().addTo(this.map);
      this.map.createPane("alertPane");
      this.map.getPane("alertPane").style.zIndex = 5000;
    },
    setConPeople() {
      this.linkmanList = [];
      getLoginUser({userName: localStorage.getItem("username")}).then(
          (res) => {
            this.linkmanList = res.data;
          }
      );
    },
    circleShadow() {
      return L.divIcon({
        className: "circleshadow",
        iconAnchor: [42, 42],
        html: `<div class="cirShadow">
                  <div class = "cirOneInner">
                    <div class = "cirTwoInner"></div>
                  </div>
                </div>`,
      });
    },
    clickPop() {
      let latlng = [30.6, 102.64];
      let circleshadow = L.marker(latlng, {
        icon: this.circleShadow(),
        pane: "iconshadow",
      }).addTo(this.iconshadowLayer);
      var circle = L.circleMarker(latlng, {
        radius: 2,
        pane: "icon",
        color: "#0071F8",
        weight: 10,
        fillColor: "#fff",
        fillOpacity: 1,
      }).addTo(this.iconLayer);
      circle.on("click", (e) => {
      });
      circle.on("mouseout", () => {
        this.setMapClickPop = false;
      });
    },
    targetMarkerListener(e, item, groupInfo) {
      this.groupName = groupInfo.groupName;
      this.moniName = item.targetName;
      getOneMonitorTargetAlarmDetails({targetId: item.targetId}, (c) => {
        if (this.getLayerAlarmsRequest) {
          this.getLayerAlarmsRequest();
        }
        this.getLayerAlarmsRequest = c;
      }).then((res) => {
        this.targetObj = res.data;
        this.tianqiImg =
            this.targetObj.weather == "999999"
                ? ""
                : require(`@/assets/images/firstPage/${this.targetObj.weather}.png`);
        const x = [],
            y = [];
        this.targetObj.future2hPreFcst.forEach((item1) => {
          x.push(moment(item1.dataTime, "YYYYMMDDHHmm").format("HH:mm"));
          y.push(item1.preValue);
          // this.yLevel.push(item1.preLevel);
        });
        this.popupWarn = this.targetName;
        this.$nextTick(() => {
          this.makeChart(x, y);
        });
        // getContactsGroupByUserName({ userName: this.moniName }).then(
        //   (res) => {
        //     this.linkmanList = res.data;
        //   }
        // );
        getWarningMonitorConfigInfo({targetId: item.targetId}).then((res) => {
          let flag = res.data.ifHaveData;
          if (flag) {
            let flagdata = res.data;
            this.processData(flagdata);
          } else {
            console.log(this.ruleFormData, this.frequencyFormData)
            this.concatRuleKey = new Date().getTime()
            // this.ruleFormData.ruleFormData = [
            //   {
            //     warningCategory: "天气预警", //预警大类
            //     warningType: "", //预警种类
            //     warningCondition: "", //预警条件
            //     relationSymbol: "", //关系符号
            //     warningValue: "", //预警阈值
            //   },
            // ];
            // this.frequencyFormData.linkman = [
            //   { contactsGroupName: "", checkboxGroup: ["短信"] },
            // ];
            // this.frequencyFormData.checkFrequency = "";
            // this.frequencyFormData.moniPeriodF = "";
            // this.frequencyFormData.moniPeriodE = "";
            // this.frequencyFormData.weekend = 0;
            // this.allCondition = "1";
          }
        });
      });
      L.DomEvent.stopPropagation(e);
      // this.$refs.mapClickPop1.style.left = e.containerPoint.x + 100 + "px";
      // this.$refs.mapClickPop1.style.top = e.containerPoint.y + "px";
      // this.$refs.mapClickPop1.addEventListener("mouseover", () => {
      //   this.setMapClickPop = true;
      // });
      // this.$refs.mapClickPop1.addEventListener("mouseout", () => {
      //   this.setMapClickPop = false;
      // });
      this.openElDia();
    },
    processData(data) {
      this.ruleFormData.ruleFormData = [];
      this.frequencyFormData.linkman = [];
      data.ruleArray.forEach((item, index) => {
        let newArr = {};
        newArr.warningCategory =
            item.warningCategory == "999999" ? "" : item.warningCategory;
        newArr.warningCondition =
            item.warningCondition == "999999" ? "" : item.warningCondition;
        newArr.warningType =
            item.warningType == "999999" ? "" : item.warningType;
        newArr.warningValue =
            item.warningValue == "999999" ? "" : item.warningValue;
        newArr.relationSymbol =
            item.relationSymbol == "999999" ? "" : item.relationSymbol;
        this.ruleFormData.ruleFormData.push(newArr);
      });
      data.receiverArray.forEach((item1, index) => {
        let newL = {contactsGroupName: "", checkboxGroup: []};
        newL.contactsGroupName = item1.contactsGroupName;
        if (item1.dingding == 1) {
          newL.checkboxGroup.push("钉钉");
        }
        if (item1.mail == 1) {
          newL.checkboxGroup.push("邮件");
        }
        if (item1.phone == 1) {
          newL.checkboxGroup.push("电话");
        }
        if (item1.shortMessage == 1) {
          newL.checkboxGroup.push("短信");
        }
        if (item1.wechat == 1) {
          newL.checkboxGroup.push("微信");
        }
        this.frequencyFormData.linkman.push(newL);
      });
      this.frequencyFormData.checkFrequency = data.monitorFrequency;
      this.frequencyFormData.moniPeriodF = moment(
          data.monitorBegintime,
          "YYYYMMDDHHmmss"
      ).format("YYYY-MM-DD");
      this.frequencyFormData.moniPeriodE = moment(
          data.monitorEndtime,
          "YYYYMMDDHHmmss"
      ).format("YYYY-MM-DD");
      this.frequencyFormData.weekend = data.weekend;
      this.allCondition = String(data.allCondition);
    },
    closePop1() {
      this.moniName = "";
      this.setMapClickPop = false;
    },
    closeDialog() {
      this.setMoniDialog = false;
      this.ruleFormData.ruleFormData = [
        {
          warningCategory: "天气预警", //预警大类
          warningType: "", //预警种类
          warningCondition: "", //预警条件
          relationSymbol: "", //关系符号
          warningValue: "", //预警阈值
        },
      ];
      this.frequencyFormData.linkman = [
        {contactsGroupName: "", checkboxGroup: ["短信"]},
      ];
      this.frequencyFormData.checkFrequency = "";
      this.frequencyFormData.moniPeriodF = "";
      this.frequencyFormData.moniPeriodE = "";
      this.frequencyFormData.weekend = 0;
      this.allCondition = "1";
    },
    openElDia() {
      this.xTime.splice(0);
      this.yValue.splice(0);

      this.$nextTick(() => {
        // this.makeChart();
        this.getPopData();
      });
      this.setMapClickPop = true;
    },
    openInnerElDia() {
      this.setMapClickPop = false;
      this.setMoniDialog = true;
      this.setConPeople();
      this.filterWarn();
      this.filterWaType();
    },
    filterWarn() {
      this.filterWarnArr = [];
      this.ruleFormData.ruleFormData.forEach((item, index) => {
        this.filterWarnArr.push(item.warningValue);
      });

      this.filterWarnArr = [...new Set(this.filterWarnArr)];
    },
    filterWaType() {
      this.filterWaTypeArr = [];
      this.ruleFormData.ruleFormData.forEach((item, index) => {
        this.filterWaTypeArr.push(item.warningType);
      });
      this.filterWaTypeArr = [...new Set(this.filterWaTypeArr)];
    },
    makeChart(xTime, yValue) {
      var chart = Highcharts.chart(this.chartId, {
        credits: {
          enabled: false,
        },
        chart: {
          type: "areaspline",
          backgroundColor:
              this.$store.state.style.theme == "dark" ? "#1F212C" : "#fff",
        },
        title: {
          text: null,
        },
        legend: {
          layout: "vertical",
          align: "left",
          verticalAlign: "top",
          x: 150,
          y: 100,
          floating: true,
          borderWidth: 1,
          backgroundColor:
              (Highcharts.theme && Highcharts.theme.legendBackgroundColor) ||
              "#FFFFFF",
        },
        xAxis: {
          min: 0,
          maxPadding: 0,
          categories: xTime,
          plotBands: [],
          labels: {
            formatter: function () {
              //坐标轴格式化回调函数
              return this.value;
            },
          },
          tickWidth: 1,
          tickmarkPlacement: "on",
          tickInterval: 6,
        },
        yAxis: {
          title: null,
          tickPositions: [0, 3.9, 9.7, 17.7, 37.2],
          minorGridLineWidth: 0,
          gridLineWidth: 0,
          alternateGridColor: null,
          plotBands: [
            {
              // Light air
              from: 3.9,
              to: 9.6,
              color: "rgba(68, 170, 213, 0.1)",
              label: {
                text: "中雨",
                style: {
                  color: "#606060",
                },
              },
            },
            {
              // Light breeze
              from: 9.7,
              to: 17.6,
              color: "rgba(0, 0, 0, 0)",
              label: {
                text: "大雨",
                style: {
                  color: "#606060",
                },
              },
            },
            {
              // Gentle breeze
              from: 17.7,
              to: 37.2,
              color: "rgba(68, 170, 213, 0.1)",
              label: {
                text: "暴雨",
                style: {
                  color: "#606060",
                },
              },
            },
          ],
          lineWidth: 0, //去掉x轴线
          tickWidth: 0, //去掉刻度
          labels: {
            enabled: false,
            formatter: function (p) {
              let level = "";
              if (this.value >= 63.3) {
                level = "特大暴雨";
              } else if (this.value >= 37.3) {
                level = "大暴雨";
              } else if (this.value >= 17.7) {
                level = "暴雨";
              } else if (this.value >= 9.7) {
                level = "大雨";
              } else if (this.value >= 3.9) {
                level = "中雨";
              } else if (this.value >= 0.1) {
                level = "小雨";
              } else if (this.value > 0) {
                level = "零星小雨";
              } else {
                level = "无降雨";
              }
              return level;
            },
          },
        },
        tooltip: {
          shared: true,
          headerFormat: '<span style="font-size: 16px">{point.key}</span><br>',
          className: "rainChartToolTip",
          valueSuffix: "mm", //单位
        },
        plotOptions: {
          series: {
            color: "#3399FF", //上边线颜色
            marker: {
              enabled: false,
              // radius: 4,
              // fillColor: "#fff",
              // lineColor: "#5086FF",
              // lineWidth: 1,
            },
            fillColor: {
              // 注意！！！如果是柱状图请使用color，如果是面积图请使用fillColor
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1,
              },
              stops: [
                [0, "#3399FFdd"],
                [1, "#25324799"],
              ],
            },
          },
        },
        series: [
          {
            name: "降雨量",
            data: yValue,
          },
        ],
        legend: {
          //禁用水印
          enabled: false,
        },
        exporting: {
          //禁用导出按钮
          enabled: false,
        },
      });
    },
    iconColor(e) {
      if (e == "暴雨预警") {
        return "colorBaoyu";
      } else if (e == "冰雹预警") {
        return "colorBingbao";
      } else if (e == "雷暴预警") {
        return "colorLeibao";
      } else if (e == "雷暴大风预警") {
        return "colorLeibaodafeng";
      }
    },
    saveSubmit(refName1, refName2) {
      this.setGroupDialog = false;
      this.ruleArray = [];
      this.receiverArray = [];
      this.frequencyFormData.linkman.forEach((item, index) => {
        let swap = {
          contactsGroupName: "",
          wechat: "",
          phone: "",
          shortMessage: "",
          mail: "",
          dingding: "",
        };
        swap.contactsGroupName = item.contactsGroupName;
        swap.wechat = item.checkboxGroup.indexOf("微信") > -1 ? 1 : 0;
        swap.phone = item.checkboxGroup.indexOf("电话") > -1 ? 1 : 0;
        swap.shortMessage = item.checkboxGroup.indexOf("短信") > -1 ? 1 : 0;
        swap.mail = item.checkboxGroup.indexOf("邮件") > -1 ? 1 : 0;
        swap.dingding = item.checkboxGroup.indexOf("钉钉") > -1 ? 1 : 0;
        this.receiverArray.push(swap);
      });
      this.ruleFormData.ruleFormData.forEach((item, index) => {
        let a = {};
        a.warningCategory = item.warningCategory;
        a.warningType = item.warningType;
        a.warningCondition =
            item.warningCondition == "" ? 999999 : item.warningCondition;
        a.relationSymbol =
            item.relationSymbol == "" ? 999999 : item.relationSymbol;
        a.warningValue = item.warningValue == "" ? 999999 : item.warningValue;
        this.ruleArray.push(a);
      });
      Promise.all([
        this.$refs[refName1].validate((valid) => {
          if (valid) {
          } else {
            reject();
          }
        }),
        this.$refs[refName2].validate((valid) => {
          if (valid) {
          } else {
            reject();
          }
        }),
      ]).then(() => {
        // this.$message({
        //   message: "当前为试用版,暂不能提供短信提醒",
        //   type: "warning",
        // });
        var param = {
          userName: localStorage.getItem("username"),
          groupName: this.groupName,
          targetName: this.moniName,
          allCondition: this.allCondition == "1" ? 1 : 0, //满足所有条件，包括：1-代表选中、0-代表未选中
          oneCondition: this.allCondition == "1" ? 0 : 1, //满足任一条件，包括：1-代表选中、0-代表未选中
          monitorFrequency: this.frequencyFormData.checkFrequency, //监控频率，包括：实时、每30分钟、每小时、每6小时、每日
          monitorBegintime: moment(this.frequencyFormData.moniPeriodF).format(
              "YYYYMMDDHHmmss"
          ), //监控开始时间，北京时间，形式如：20220530134900
          monitorEndtime: moment(this.frequencyFormData.moniPeriodE).format(
              "YYYYMMDDHHmmss"
          ), //监控结束时间，北京时间，形式如：20220530134900
          weekend: this.frequencyFormData.weekend ? 1 : 0, //周末除外，包括：1-代表周末不监控、0-代表周末要监控
          warningContent: 999999,
          ruleArray: this.ruleArray,
          receiverArray: this.receiverArray,
        };
        saveMoniConfigInfo(param).then((res) => {
          this.$message({
            message: res.msg,
            type: res.code == 200 ? "success" : "error",
          });
          this.setMoniDialog = false;
        });
      });
    },
    getPopData() {
      getMoniBigClass().then((res) => {
        // this.warningCategoryArray = res.data;
      });
      getMoniWarnClass().then((res) => {
        this.warningTypeArray = res.data;
      });
      getMoniFrequency().then((res) => {
        this.checkFrequencyArray = res.data;
      });
    },
    addNewRule() {
      let newRule = {
        // kaiguan: true,
        warningCategory: "天气预警", //预警大类
        warningType: "", //预警种类
        warningCondition: "", //预警条件
        relationSymbol: "", //关系符号
        warningValue: "", //预警阈值
      };
      this.ruleFormData.ruleFormData.push(newRule);
      this.filterWarn();
      this.filterWaType();
    },
    delectNewRule() {
      if (this.ruleFormData.ruleFormData.length <= 1) {
        return;
      }
      this.ruleFormData.ruleFormData.pop();
      this.filterWarn();
      this.filterWaType();
    },
    addReceivePeople() {
      let newPeople = {
        contactsGroupName: "",
        checkboxGroup: ["短信"],
      };
      this.frequencyFormData.linkman.push(newPeople);
    },
    delectReceivePeople() {
      if (this.frequencyFormData.linkman.length <= 1) {
        return;
      }
      this.frequencyFormData.linkman.pop();
    },
    transTime(time, oldGeshi, newGeshi) {
      return moment(time, oldGeshi).format(newGeshi);
    },
    specialCreateLayerPoints(layer, color, innerColor, text) {
      const circleShadow = () => {
        return L.divIcon({
          className: "damagePoints",
          iconAnchor: [42, 42],
          html: `<div class="cirShadow" style="background: ${innerColor}; opacity: 1;box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.16);">
                  <div class = "cirOneInner" style="background: ${innerColor}; opacity: 1;box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, .16);">
                    <div class = "cirTwoInner" style="background: ${color}"></div>
                  </div>
                </div>`,
        });
      }
      // 点
      let keyWords = '';
      if (text === '险工险段风险点位') {
        keyWords = '险工险段'
      } else if(text === '积水风险点位') {
        keyWords = '积水'
      }
      const markers = new L.MarkerClusterGroup({
        showCoverageOnHover: false,

        iconCreateFunction: function(cluster) {
          return L.divIcon({ html: `<div style="background: ${innerColor};" class="clusterGroupShow"><div style="background: ${innerColor};box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, .16);"><b>${cluster.getChildCount()}</b></div></div>` });
        }
      });

      function closeMyPopup() {
        console.log(this)
        damagePointsPopup.closePopup()
      }

      damageInfoXn.forEach(p => {
        if (this.selPrefecture && p.prefecture !== this.selPrefecture) return
        if (p.disaster_type.indexOf(keyWords) !== -1) {
          const point = [p.latitude, p.longitude]
          let image = ""
          try {
            image = require(`../../../assets/damageInfo/images/${p.id}.png`)
          }catch (e) {

          }
          const that = this
          const damagePointsPopup = L.marker(point, {
            icon: circleShadow(),
          }).bindPopup(`
            <div class="damagePointsContent__c">
            <div class="damagePointsContent__title">
              <span>${text}</span>
              <img class="damagePointsPopupClose" src="${require('../../../assets/images/monitoring/closeBtn.png')}" alt="">
            </div>
            <div class="damagePointInfo xining-disaster">
                <img src="${require('../../../assets/images/monitoring/position.png')}" class="icon-img" alt="">
                <span>${p.address}</span>
            </div>
            ${
              p.disaster_name && p.disaster_name !== '无' ?
                `<div class="damagePointInfo xining-disaster">
                  <img src="${require('../../../assets/images/monitoring/warning.png')}" class="icon-img" alt="">
                  <span>${p.disaster_name}</span>
                </div>` :
                ''
            }
            ${
              p.brief && p.brief !== '无' ?
                `<div class="damagePointInfo xining-disaster">
                  <img src="${require('../../../assets/images/monitoring/warninginfo.png')}" class="icon-img" alt="">
                  <span>${p.brief}</span>
                </div>` :
                ''
            }
            ${
              p.camera && p.camera !== '无' ?
                `<div class="damagePointInfo xining-disaster xining-camera-icon">
                  <img src="${require('../../../assets/images/monitoring/camera.png')}" class="icon-img" alt="">
                  <span>${p.camera}</span>
                </div>` :
                ''
            }
            <div class="damagePointInfo xining-disaster damagePointInfo__position">
                <img src="${require('../../../assets/images/monitoring/latlon.png')}" class="icon-img" alt="">
                <span>${point[0]}° N   ${point[1]}°E</span>
            </div>
            
            <div class="xn-warning2h">
              <div class="warning2h-icon"><i class="iconfont icon-tishi"></i></div>
              <div class="warning2h-info"></div>
            </div>
            <div class="popup-chart-line" style="height: 160px;"></div>
            <div class="historypre24">过去24小时降雨量</div>
            <div class="popup-chart-bar" style="height: 160px;"></div>
      </div>
          `, {
            className: 'damagePointsContent',
            closeButton: false,
          }).on('click', function () {
            const allMarkers = markers.getLayers()
            for (let i = 0; i < allMarkers.length; i++) {
              allMarkers[i].closePopup()
            }
            this.openPopup()
            let closes = document.getElementsByClassName('damagePointsPopupClose')
            for (let i = 0; i < closes.length; i++) {
              closes[i].addEventListener('click', () => {
                this.closePopup()
              })
            }
          }).on('popupopen', debounce(function () {
            // 防抖，避免onclick导致的触发两次
            that.setMapClickPop = false
            that.$emit('map-popupopen')
            that.loadPopupData(this)
            that.registerCameraClick('xining-camera-icon', p)
          }, 200))
          markers.addLayer(damagePointsPopup)
        }
      })
      layer.addLayer(markers)
    },
    loadPopupData(pointInfo) {
      const chartsClass = ['popup-chart-line', 'popup-chart-bar']
      const charts = chartsClass.map(c => this.initDamageLineChart(c))
      const reqs = [this.getRiskPointFuture2h(pointInfo), this.getRiskPointFuture24h(pointInfo)]
      Promise.allSettled(reqs).then(results => {
        for (const [index, res] of results.entries()) {
          this.updateChart(charts[index], res.status === 'fulfilled' ? res.value : {})
        }
      })
    },
    getRiskPointFuture2h(pointInfo) {
      if (!pointInfo) return
      const { _latlng: { lat: lat, lng: lon } } = pointInfo
      const userName = this.username
      const params = { userName, lat, lon }
      return getRiskPointFuture2hPreData(params).then(res => {
        if (res.code != 200) throw new Error('getRiskPointFuture2hPreData')
        const dataList = res.data?.future2hPreFcst || []
        const xAxisLabels = dataList.map(item => item.ftime).map(t => moment(t, 'YYYYMMDDHHmm').format('HH:mm'))
        const valueList = dataList.map(item => item.preValue)
        return {
          xAxisLabels,
          valueList,
          className: 'warning2h-info',
          msg: res.data?.preDesc || ''
        }
      }).catch(error => {
        console.error(error)
      })
    },
    getRiskPointFuture24h(pointInfo) {
      if (!pointInfo) return
      const { _latlng: { lat: lat, lng: lon } } = pointInfo
      const params = { lat, lon }
      return getRiskPointLast24hPreData(params).then(res => {
        if (res.code != 200) throw new Error('getRiskPointLast24hPreData')
        const dataList = res.data?.last24hPreData || []
        const xAxisLabels = dataList.map(item => item.dataTime).map(t => moment(t, 'YYYYMMDDHHmm').format('HH:mm'))
        const valueList = dataList.map(item => item.preValue)
        const total24 = valueList.reduce((prev, cur) => prev + cur)
        return {
          xAxisLabels,
          valueList,
          className: 'historypre24',
          msg: `过去24小时降雨量${total24 || total24 === 0 ? `<span style="color: #5086FF;"> ${total24 && total24.toFixed(1)} </span>mm` : ''}`
        }
      }).catch(error => {
        console.error(error)
      })
    },
    updateChart(chart, data) {
      if (!chart || !data) return
      const xAxis = chart.xAxis[0]
      const series1 = chart.series[0]
      xAxis.setCategories(data.xAxisLabels)
      series1.setData(data.valueList)
      const msgEl = document.getElementsByClassName(data.className)[0]
      if (msgEl) msgEl.innerHTML = data.msg || ''
    },
    initDamageLineChart(className) {
      const charts = document.getElementsByClassName(className)
      const chartEl = charts[charts.length - 1]
      const chart = Highcharts.chart(chartEl, {
        chart: {
            type: 'areaspline'
        },
        title: {
            text: undefined
        },
        xAxis: {
          categories: [],
          tickInterval: 6,
        },
        legend: {
          enabled: undefined
        },
        yAxis: {
          title: null,
          tickPositions: [0, 3.9, 9.7, 17.7, 37.2],
          minorGridLineWidth: 0,
          gridLineWidth: 0,
          alternateGridColor: null,
          lineWidth: 0, //去掉x轴线
          tickWidth: 0, //去掉刻度
          labels: {
            enabled: false
          },
          plotBands: [
            {
              from: 3.9,
              to: 9.6,
              color: "rgba(68, 170, 213, 0.1)",
              label: {
                text: "中雨",
                style: {
                  color: "#606060",
                },
              },
            },
            {
              from: 9.7,
              to: 17.6,
              color: "rgba(0, 0, 0, 0)",
              label: {
                text: "大雨",
                style: {
                  color: "#606060",
                },
              },
            },
            {
              from: 17.7,
              to: 37.2,
              color: "rgba(68, 170, 213, 0.1)",
              label: {
                text: "暴雨",
                style: {
                  color: "#606060",
                },
              },
            }
          ]
        },
        tooltip: {
          shared: true,
          headerFormat: '<span style="font-size: 16px">{point.key}</span><br>',
          className: "rainChartToolTip",
          valueSuffix: "mm", //单位
        },
        plotOptions: {
            areaspline: {
                lineWidth: 2,
                states: {
                    hover: {
                        lineWidth: 3
                    }
                },
                marker: {
                    enabled: false
                },
                color: "#3399FF", //上边线颜色
                fillColor: {
                  // 注意！！！如果是柱状图请使用color，如果是面积图请使用fillColor
                  linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1,
                  },
                  stops: [
                    [0, "#3399FFdd"],
                    [1, "#25324799"],
                  ],
                },
            }
        },
        series: [{
            name: '降雨量',
            data: []
        }]
      });
      return chart
    },
    registerCameraClick(className, pointInfo) {
      const cameraEl = document.querySelector(`.${className}`)
      if (!cameraEl) return
      cameraEl.style.cursor = 'pointer'
      cameraEl.addEventListener('click', (e) => {
        this.cameraClickHandler(e, pointInfo)
      })
    },
    cameraClickHandler(event, pointInfo) {
      // console.log(pointInfo)
      this.monitorVisible = true
    },
    createLayerPoints(layer, color, innerColor, text) {
      const circleShadow = () => {
        return L.divIcon({
          className: "damagePoints",
          iconAnchor: [42, 42],
          html: `<div class="cirShadow" style="background: ${innerColor}; opacity: 1;box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.16);">
                  <div class = "cirOneInner" style="background: ${innerColor}; opacity: 1;box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, .16);">
                    <div class = "cirTwoInner" style="background: ${color}"></div>
                  </div>
                </div>`,
        });
      }
      // 点
      let keyWords = '';
      if (text === '泥石流风险点位') {
        keyWords = '泥石流'
      } else if(text === '滑坡风险点位') {
        keyWords = '滑坡'
      } else if(text === '积水风险点位') {
        keyWords = '积水风险'
      }
      const markers = new L.MarkerClusterGroup({
        showCoverageOnHover: false,

        iconCreateFunction: function(cluster) {
          return L.divIcon({ html: `<div style="background: ${innerColor};" class="clusterGroupShow"><div style="background: ${innerColor};box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, .16);"><b>${cluster.getChildCount()}</b></div></div>` });
        }
      });

      function closeMyPopup() {
        console.log(this)
        damagePointsPopup.closePopup()
      }

      damageInfo.forEach(p => {
        if (p.disaster_type.indexOf(keyWords) !== -1) {
          const point = [p.latitude, p.longitude]
          let image = ""
          try {
            image = require(`../../../assets/damageInfo/images/${p.id}.png`)
          }catch (e) {

          }
          const damagePointsPopup = L.marker(point, {
            icon: circleShadow(),
          }).bindPopup(`
            <div class="damagePointsContent__c">
            <div class="damagePointsContent__title">
              <span>${text}</span>
              <img class="damagePointsPopupClose" src="${require('../../../assets/images/monitoring/closeBtn.png')}" alt="">
            </div>
            <div class="damagePointInfo">
                <img src="${require('../../../assets/images/monitoring/position.png')}" alt="">
                <span>${p.address}</span>
            </div>
            <div class="damagePointInfo damagePointInfo__position">
                <img src="${require('../../../assets/images/monitoring/latlon.png')}" alt="">
                <span>${point[0]}° N   ${point[1]}°E</span>
            </div>
            ${ p.disaster_type === '积水风险' ? ``: `<div class="damagePointsContent__content">
               <span>历史灾情</span>
               <div>
                  <img src="${require('../../../assets/images/monitoring/alarmInfo1.png')}" alt="">
                  <span>${p.disaster_name}</span>
                  <div class="alarmType">${p.disaster_type}</div>
               </div>
               <div>
                  <img src="${require('../../../assets/images/monitoring/alarmInfo2.png')}" alt="">
                  <span>${moment(p.disaster_time, 'YYYY年MM月DD日').format('YYYY/MM/DD')}</span>
                </div>
               <div>
                  <img src="${require('../../../assets/images/monitoring/alarmInfo3.png')}" alt="">
                  <span>${p.disaster_area} m²</span>
               </div>
               <span>图片</span>
               <div class="mapImage" onclick="
                 // js
                 var e_dom = '<div><img/></div>';
                 var e$ = jquery(e_dom);
                 jquery(body).append(e$);
                 e$.addClass('mapImageView');

                 e$.children()[0].src = '${image}';
                 e$.on('click', function() {
                   jquery(this).remove();
                 })
               " >
                    <img src="${image}" alt="">
               </div>
            </div>` }
            <div class="damagePointsContent__share">
                <div>
                    <div>
                        <img src="${require('../../../assets/images/monitoring/share1.png')}" alt="">
                    </div>
                    <span>路线规划</span>
                </div>
                <div>
                   <div>
                        <img src="${require('../../../assets/images/monitoring/share2.png')}" alt="">
                   </div>
                   <span>地点分享</span>
                </div>
            </div>
      </div>
          `, {
            className: 'damagePointsContent',
            closeButton: false,
          }).on('click', function () {
            const allMarkers = markers.getLayers()
            for (let i = 0; i < allMarkers.length; i++) {
              allMarkers[i].closePopup()
            }
            this.openPopup()
            let closes = document.getElementsByClassName('damagePointsPopupClose')
            for (let i = 0; i < closes.length; i++) {
              closes[i].addEventListener('click', () => {
                this.closePopup()
              })
            }
          })
          markers.addLayer(damagePointsPopup)
        }
      })
      layer.addLayer(markers)
    },
    layersChange(item, value) {
      if (this.hasDangerAreaUser) {
        this.specialLayersChange(item, value)
      } else {
        this.normalLayersChange(item, value)
      }
    },
    specialLayersChange(item, value) {
      if (value) {
        if (!item.layer) {
          // 生成
          item.layer = new L.layerGroup().addTo(this.map)
          this.specialCreateLayerPoints(item.layer, item.iconColor, item.innerColor, item.text)
        } else {
          item.layer.addTo(this.map)
        }
      } else {
        // 隐藏
        item.layer.remove()
      }
    },
    normalLayersChange(item, value) {
      if (value) {
        if (!item.layer) {
          // 生成
          item.layer = new L.layerGroup().addTo(this.map)
          this.createLayerPoints(item.layer, item.iconColor, item.innerColor, item.text)
        } else {
          item.layer.addTo(this.map)
        }
      } else {
        // 隐藏
        item.layer.remove()
      }
    },
    test() {
      driveRoutePlan({
        groupProvince: '四川省',
        originLonLat: this.pitchShow[0].join(','),
        destinationLonLat: this.pitchShow[1].join(','),
        strategy: 10,
        waypoints: ''
      }).then(res => {
        const {data: {paths}} = res
        let lines = []
        paths[0].steps.forEach(l => {
          l.polyline.split(';').forEach(r => {
            const arr = []
            const points =  r.split(',')
            for (let i = points.length - 1;i>=0;i--) {
              arr.push(parseFloat(points[i]))
            }
            lines.push(arr)
          })
        })
       this.stepsLine =  L.polyline(lines, {
          color: '#5086ff',
          weight: '4',
        }).addTo(this.map)
      })
    },
    clearPlane() {
      this.pitchShow.splice(0)
      this.stepsLine?.remove()
    },
    pitchPoint(latlon) {
      if (!(localStorage.getItem('username') && localStorage.getItem('username') === 'Fangzaikeji')) return
      let point = latlon.map(r => r.toFixed(3))
      point = point.reverse()
      if(this.pitchShow.length === 0) {
        this.pitchShow.push(point)
      }else if(this.pitchShow.length === 1) {
        this.pitchShow.push(point)
        this.test()
      }else if(this.pitchShow.length === 2) {
        this.pitchShow.splice(0)
        this.stepsLine?.remove()
        this.pitchShow.push(point)
      }
    }
  },
  mounted() {
    this.init_fenghuotai("map", [30.6, 102.64], 7);
    this.initLayer();
    // this.clickPop();
    addTestPoint(this.map, monitorPoint)
  },
  activated() {
    this.map?.invalidateSize();
    this.$emit("resetColorImage");
  },
  watch: {
    allCondition() {
    },
    setMoniDialog() {
      this.dialogKey = new Date().getTime();
    },
    selPrefecture: {
      handler() {
        if (!this.hasDangerAreaUser) return
        const layersOptions = this.layersOptions || []
        for (const item of layersOptions) {
          if (item.isSelect) {
            item.layer && item.layer.remove()
            item.layer = null
            this.specialLayersChange(item, item.isSelect)
          }
        }
      }
    }
  },
};
</script>
<style lang="less" scoped>
@import "@/assets/style/common.less";

/deep/ .highcharts-plot-band-label {
  font-family: "PingFang SC";
}

/deep/ .highcharts-container text {
  font-family: "PingFang SC";
}

/deep/ .colorBaoyu {
  color: #0071f8;
}

/deep/ .colorLeibao {
  color: #ff9f00;
}

/deep/ .colorBingbao {
  color: #00e5ef;
}

/deep/ .colorLeibaodafeng {
  color: #00d151;
}

.moniAlertMap {
  width: 100%;
  height: 100%;

  .pitchShowView {
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    padding: 20px;
    min-width: 200px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    z-index: 9999;
    box-shadow: 0 0 10px rgba(0,0,0,.2);
    border-radius: 8px;

    .clearLink {
      margin-left: 20px;
      cursor: pointer;
      text-decoration: underline;
      transition: color .25s ease-in;
      user-select: none;
    }
    .clearLink:hover {
      color: orangered;
    }
  }

  .mapClickPop1 {
    position: fixed;
    z-index: 9999;
    right: 200px;
    top: 70px;
    width: 328px;
    min-height: 533px;
    background: #ffffff;
    box-shadow: 0px 2px 3px 1px rgba(132, 132, 132, 0.16);
    border-radius: 6px 6px 6px 6px;
    opacity: 1;
    padding: 16px;

    /deep/ .rainChartToolTip {
      font-family: "PingFang SC";
    }

    .mapClickPopTitle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: nowrap;
      font-size: 18px;
      font-family: PingFang SC-Bold, PingFang SC;
      font-weight: bold;
      color: #666666;

      & > i {
        cursor: pointer;
      }

      & > div {
        display: flex;
        align-items: center;

        i {
          color: #666666;
          font-size: 20px;
          margin-right: 8px;
        }

        & > div {
          font-size: 14px;
          font-family: PingFang SC-Bold, PingFang SC;
          font-weight: bold;
          color: #3399ff;
          margin-left: 10px;
          cursor: pointer;
        }
      }
    }

    .tianqi {
      display: flex;
      justify-content: center;
      text-align: center;
      margin-top: 20px;

      & > div {
        display: flex;
        flex-direction: column;
        font-family: PingFang SC-Bold, PingFang SC;
        font-size: 14px;
        color: #666666;
      }

      & > div:first-child {
        margin-right: 9px;

        & > img {
          width: 47px;
        }
      }

      & > div:last-child {
        font-weight: 400;

        & > div:first-child {
          font-size: 32px;
          // font-weight: bold;
        }
      }
    }

    #jiangshuiliang {
      margin-top: 15px;
      height: 180px;
      width: 100%;

      .el-table .el-table__cell {
        padding-top: 10px;
        padding-bottom: 8px;
      }
    }

    .jinggao {
      display: flex;
      align-items: center;
      background: #f0f5ff;
      opacity: 1;
      border: 1px solid #6a91ff;
      padding: 6px 10px;
      font-size: 12px;
      font-family: DengXian-Bold, DengXian;
      font-weight: bold;
      color: #7c7f97;
      line-height: 20px;

      .leftIcon {
        width: 24px;
        height: 24px;
        color: #5086ff;
        border-radius: 50%;
        display: block;
        margin-right: 8px;
        text-align: center;
        line-height: 24px;

        i {
          font-size: 18px;
          font-weight: 900;
        }
      }

      .rightDiv {
        flex: 1;
      }
    }

    .tianqiyujing {
      max-height: 259px;
      overflow: auto;
      border-top: 1px #c8c8c8 solid;

      .nodata {
        margin-top: 45px;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #999;
        font-weight: normal;

        img {
          width: 80px;
        }

        font-size: 14px;
        font-weight: normal;
      }

      .data {
        margin-top: 10px;

        .tqyjTitle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0;

          .leftIcon {
            font-size: 14px;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            display: flex;
            align-items: center;

            img {
              width: 18px;
              margin-right: 7px;
            }
          }

          .rightTime {
            font-size: 12px;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
            letter-spacing: 2px;
          }
        }

        .tqyjBody {
          background: #eff7ff;
          padding: 10px 8px;
          font-size: 12px;
        }
      }
    }

    .tianqiyujing::-webkit-scrollbar {
      // display: none;
      width: 2px;
      height: 4px;
      border-radius: 2px;
    }
  }

  #map {
    width: 100%;
    height: 100%;

    @keyframes damagePointsAnimate {
      0% {
        transform: scale(0)
      }
      100% {
        transform: scale(1)
      }
    }

    /deep/ .clusterGroupShow {
      background-clip: padding-box;
      border-radius: 25px;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      & > div {
        width: 30px;
        height: 30px;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #000;
        font-size: 15px;
      }
    }

    /deep/ .damagePoints .cirShadow {
      transform: scale(0);
      animation: damagePointsAnimate .3s ease-in forwards;
    }

    /deep/ .leaflet-popup-pane {
      z-index: 99999;
    }

    /deep/ .damagePointsContent {
      margin-bottom: -147px;
      margin-left: 260px;

      .leaflet-popup-content {
        margin: 0;
      }

      .leaflet-popup-tip-container {
        display: none;
      }

      .leaflet-popup-content-wrapper {
        box-shadow: 0px 2px 3px 1px rgba(132, 132, 132, 0.16);
        border-radius: 6px 6px 6px 6px;
        width: 328px !important;
      }

      .damagePointsContent__c {
        padding: 16px 16px 20px;
        width: 328px;

        .damagePointsContent__title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 20px;
          font-weight: bold;
          color: #666666;
          margin-bottom: 16px;

          & > img {
            width: 16px;
            cursor: pointer;
            user-select: none;
            filter: invert(0);
          }
        }

        & .damagePointInfo:nth-child(2) {
          margin-bottom: 15px;
        }

        .damagePointInfo {
          font-size: 14px;
          font-weight: 400;
          color: #333333;
          display: flex;
          align-items: center;

          & > img {
            width: 18px;
            margin-right: 11px;
          }
        }
        .xining-disaster {
          margin-bottom: 15px;
          > .icon-img {
            position: relative;
            bottom: 1px;
          }
          &:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
          }
        }
        .xn-warning2h {
          display: flex;
          align-items: center;
          background: #1c2746;
          border: 1px solid rgba(80, 134, 255, 0.4);
          color: #afb1b6 !important;
          opacity: 1;
          padding: 6px 10px;
          font-size: 12px;
          font-family: DengXian-Bold, DengXian;
          font-weight: bold;
          line-height: 20px;
          .warning2h-icon {
            width: 24px;
            height: 24px;
            color: #5086ff;
            border-radius: 50%;
            display: block;
            margin-right: 8px;
            text-align: center;
            line-height: 24px;

            i {
              font-size: 18px;
              font-weight: 900;
            }
          }
          .warning2h-info {
            flex: 1;
          }
        }
        .historypre24 {
          line-height: 32px; 
          text-align: center; 
          background-color: #1c2746; 
          color: #afb1b6!important;
          border: 1px solid rgba(80, 134, 255, 0.4);
        }

        .damagePointInfo__position {
          padding-bottom: 21px;
          border-bottom: 1px solid #C8C8C8;
        }

        .damagePointsContent__share {
          padding-top: 20px;
        }

        .damagePointsContent__content {
          border-bottom: 1px solid #C8C8C8;
          width: 100%;
          padding: 12px 0 20px;
          font-size: 14px;
          font-weight: 400;
          color: #333333;
          display: flex;
          flex-direction: column;

          .alarmType {
            padding: 3px 9px;
            font-size: 14px;
            font-weight: 400;
            color: #FFFFFF;
            background: #5086FF;
            border-radius: 4px 4px 4px 4px;
          }

          & > span {
            color: #666666;
            margin-bottom: 9px;
          }

          .mapImage {
            & > img {
              width: 100%;
              height: 80px;
              object-fit: cover;
              cursor: pointer;
            }
          }

          .mapImage.imageView {
            position: fixed;
            width: 100%;
            height: 100%;
          }

          & > div {
            display: flex;
            align-items: center;
            margin-bottom: 10px;

            & > span:nth-child(2) {
              margin-left: 9px;
              margin-right: 18px;
            }
          }

          & > div:last-child {
            margin: 0;
          }
        }

        .damagePointsContent__share {
          display: flex;
          align-items: center;
          justify-content: center;

          & > div:nth-child(1) > div {
            background: #5086FF;
          }

          & > div {
            display: flex;
            flex-direction: column;
            align-items: center;

            & > div {
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 13px 13px 13px 13px;
              border: 1px solid #5086FF;
              cursor: pointer;
              user-select: none;
            }

            & > span {
              margin-top: 10px;
              font-size: 14px;
              font-weight: 400;
              color: #333333;
            }
          }

          & > div:nth-child(2) {
            margin-left: 45px;
          }
        }
      }
    }

    /deep/ .leaflet-iconshadow-pane .leaflet-marker-icon {
      margin-left: -42px !important;
      margin-top: -42px !important;
    }

    /deep/ .cirShadow {
      position: relative;
      border-radius: 50%;
      width: 84px;
      height: 84px;
      background: #5086ff;
      box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, 0.16);
      opacity: 0.1;

      .cirOneInner {
        position: absolute;
        z-index: 1010;
        border-radius: 50%;
        left: 18px;
        top: 18px;
        width: 48px;
        height: 48px;
        box-shadow: 0px 0px 6px 1px rgba(0, 0, 0);
        background: rgba(5, 19, 145, 0.3);
        // opacity: 0.16;
        .cirTwoInner {
          position: absolute;
          z-index: 1011;
          border-radius: 50%;
          left: 16px;
          top: 16px;
          width: 16px;
          height: 16px;
          box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, 0.16);
          opacity: 1;
          border: 2px solid #ffffff;
        }
      }
    }
  }




}

.moniAlertMap.dark {
  .mapClickPop1 {
    background: #242631;

    .mapClickPopTitle {
      & > div {
        color: #fff;

        & > i {
          color: #fff;
        }
      }

      & > i {
        color: #fff;
      }
    }

    .tianqi {
      & > div:last-child {
        & > div:first-child {
          color: #fff;
        }
      }
    }

    .jinggao {
      background: #1c2746;
      border: 1px solid rgba(80, 134, 255, 0.4);
      color: #afb1b6;
    }

    .tianqiyujing {
      .data {
        .tqyjBody {
          color: #ffffff;
          background: #181a24;
        }
      }
    }
  }
}

.moniAlertMapDig {
  /deep/ .el-input__inner {
    font-family: "PingFang SC";
  }

  /deep/ .el-dialog {
    width: 893px;
    max-height: 95vh;
    margin-top: 3vh !important;
    margin-bottom: 0 !important;
    display: flex;
    flex-direction: column;
    border-radius: 6px;

    .el-dialog__header {
      padding: 15px 25px 0 25px;
      font-size: 20px;
      font-weight: bold;

      .el-dialog__close {
        font-size: 20px;
        font-weight: bold;
      }
    }

    .el-dialog__body {
      flex: 1 0 auto;
      padding: 0;
      display: flex;
      flex-direction: column;

      .el-form-item:last-child {
        // margin-bottom: 0;
      }

      .tipItem {
        margin-top: 5px;
        border-bottom: 1px solid #e8e8e8;
        padding: 0 25px;
        padding-bottom: 12px;
        color: #333;
      }

      .contentTitle {
        font-size: 16px;
        font-family: PingFang SC-Bold, PingFang SC;
        font-weight: bold;
        color: #333333;
        padding: 14px 0;
      }

      .jiaInput {
        padding: 8px 16px;
        background: #f5f5f5;
        border-radius: 0px 0px 0px 0px;
        opacity: 1;
        border: 1px solid #cecece;
      }

      .frequencyDiv {
        .el-form-item .el-form-item__content {
          display: flex;

          .flexDiv {
            display: flex;
            width: 100%;

            .el-form-item {
              width: 200px;
            }
          }

          .leftdiv {
            width: 80px;
            font-size: 14px;
            font-family: PingFang SC-Bold, PingFang SC;
            font-weight: bold;
            color: #333333;
          }

          .rightBigDiv {
            flex: 1 0 auto;
            display: flex;
            flex-direction: column;
            max-height: 150px;
            overflow: auto;

            & > div {
              display: flex;
              align-items: center;
              margin-bottom: 20px;

              .el-checkbox-button {
                // margin-left: 12px;
                border-radius: 6px 6px 6px 6px;

                .el-checkbox-button__inner {
                  border-radius: 6px 6px 6px 6px;
                  margin-right: 12px;
                }
              }

              .el-checkbox-button.is-checked {
                // margin-left: 12px;
                border-radius: 6px 6px 6px 6px;

                .el-checkbox-button__inner {
                  border-radius: 6px 6px 6px 6px;
                  border: 1px solid #3399ff;
                  background: #66b1ff;
                  color: #fff;
                }
              }
            }
          }
        }
      }
    }

    .el-dialog__footer {
      padding-top: 10px;

      .dialog-footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .dialogBtn {
          width: 80px;
          height: 30px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #707070;
          cursor: pointer;
          user-select: none;
          transition: all 0.2s linear;
        }

        .dialogBtn:hover {
          opacity: 0.7;
        }

        .dialogBtn.confirmBtn {
          border: #0071f8;
          // background: @linkActive;
          // border-color: @linkActive;
          // margin-right: 18px;
          // color: @normalBackground;
        }
      }
    }
  }

  .moniDigContent {
    padding: 0 24px;
    max-height: calc(95vh - 120px);
    overflow: auto;

    /deep/ .el-input.is-disabled .el-input__inner {
      font-size: 14px;
      font-family: PingFang SC-Bold, PingFang SC;
      font-weight: bold;
      color: #333333;
    }

    .addRule {
      margin-top: 10px;
      padding-left: 80px;
      display: flex;
      align-items: center;

      /deep/ .el-button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 120px;
      }
    }

    .rulediv {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-height: 150px;
      overflow: auto;
      // /deep/ .el-form-item:last-child {
      //   margin-bottom: 0;
      // }
      .xrulediv {
        display: flex;
        width: 100%;
        padding-left: 80px;
        // .firstDiv {
        //   width: 72px;
        // }
        /deep/ .el-form-item {
          // margin-bottom: 0;
          width: 120px;
          margin-right: 10px;
        }

        .small {
          display: flex;
          align-items: center;

          .ruleSet {
            width: 96px;
            text-align: center;
            font-size: 14px;
            font-family: PingFang SC-Bold, PingFang SC;
            font-weight: bold;
            color: #333333;
          }
        }
      }
    }
  }
}

.moniAlertMapDig.dark {
  /deep/ .el-dialog {
    background: #242631;

    .el-dialog__header {
      .el-dialog__title {
        color: #fff;
      }
    }

    .el-dialog__body {
      .el-input__inner {
        color: #8b8c91;
      }

      .el-checkbox__inner {
        background: #242631;
        border: 1px solid #cecece;
      }

      .jiaInput {
        color: #8b8c91;
        background: #181a24;
        border: 1px solid #393b4a;
      }

      .frequencyDiv {
        .el-form-item .el-form-item__content {
          .flexDiv {
            .el-form-item {
            }
          }

          .leftdiv {
          }

          .rightBigDiv {
            & > div {
              .el-checkbox-button {
                .el-checkbox-button__inner {
                  background: #242631;
                  border: 1px solid #5b87f7;
                  color: #5086ff;
                }
              }

              .el-checkbox-button.is-checked {
                .el-checkbox-button__inner {
                  border: 1px solid #5086ff;
                  background: #5086ff;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .tipItem {
        color: #fff;
      }

      .moniDigContent {
        .contentTitle {
          color: #fff;
        }

        .frequencyDiv {
          .leftdiv {
            color: #fff;
          }
        }

        .rulediv {
          .xrulediv {
            /deep/ .el-form-item {
            }

            .small {
              .ruleSet {
                color: #fff;
              }
            }
          }
        }
      }
    }

    .el-dialog__footer {
      .dialog-footer {
        .dialogBtn {
          color: #ffffff;
          border: 1px solid #707070;
          background: #4c4e5b;
        }

        .dialogBtn.confirmBtn {
          border: #5086ff;
          background: #5086ff;
          color: #ffffff;
        }
      }
    }
    .monitor-video {
      padding-top: 15px;
      > video {
        width: 100%;
      }
    }
  }
}
.moniAlertMapDig.video {
  /deep/ .el-dialog {
    margin-top: 8vh !important;
  }
}

/deep/ .mapClickPop1 {
  position: fixed;
  z-index: 9999;
  right: 200px;
  top: 70px;
  width: 328px;
  min-height: 533px;
  background: #ffffff;
  box-shadow: 0px 2px 3px 1px rgba(132, 132, 132, 0.16);
  border-radius: 6px 6px 6px 6px;
  opacity: 1;
  padding: 16px;

  /deep/ .rainChartToolTip {
    font-family: "PingFang SC";
  }

  .mapClickPopTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    font-size: 18px;
    font-family: PingFang SC-Bold, PingFang SC;
    font-weight: bold;
    color: #666666;

    & > i {
      cursor: pointer;
    }

    & > div {
      display: flex;
      align-items: center;

      i {
        color: #666666;
        font-size: 20px;
        margin-right: 8px;
      }

      & > div {
        font-size: 14px;
        font-family: PingFang SC-Bold, PingFang SC;
        font-weight: bold;
        color: #3399ff;
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }

  .tianqi {
    display: flex;
    justify-content: center;
    text-align: center;
    margin-top: 20px;

    & > div {
      display: flex;
      flex-direction: column;
      font-family: PingFang SC-Bold, PingFang SC;
      font-size: 14px;
      color: #666666;
    }

    & > div:first-child {
      margin-right: 9px;

      & > img {
        width: 47px;
      }
    }

    & > div:last-child {
      font-weight: 400;

      & > div:first-child {
        font-size: 32px;
        // font-weight: bold;
      }
    }
  }

  #jiangshuiliang {
    margin-top: 15px;
    height: 180px;
    width: 100%;

    .el-table .el-table__cell {
      padding-top: 10px;
      padding-bottom: 8px;
    }
  }

  .jinggao {
    display: flex;
    align-items: center;
    background: #f0f5ff;
    opacity: 1;
    border: 1px solid #6a91ff;
    padding: 6px 10px;
    font-size: 12px;
    font-family: DengXian-Bold, DengXian;
    font-weight: bold;
    color: #7c7f97;
    line-height: 20px;

    .leftIcon {
      width: 24px;
      height: 24px;
      color: #5086ff;
      border-radius: 50%;
      display: block;
      margin-right: 8px;
      text-align: center;
      line-height: 24px;

      i {
        font-size: 18px;
        font-weight: 900;
      }
    }

    .rightDiv {
      flex: 1;
    }
  }

  .tianqiyujing {
    max-height: 259px;
    overflow: auto;
    border-top: 1px #c8c8c8 solid;

    .nodata {
      margin-top: 45px;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #999;
      font-weight: normal;

      img {
        width: 80px;
      }

      font-size: 14px;
      font-weight: normal;
    }

    .data {
      margin-top: 10px;

      .tqyjTitle {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 0;

        .leftIcon {
          font-size: 14px;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          display: flex;
          align-items: center;

          img {
            width: 18px;
            margin-right: 7px;
          }
        }

        .rightTime {
          font-size: 12px;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          letter-spacing: 2px;
        }
      }

      .tqyjBody {
        background: #eff7ff;
        padding: 10px 8px;
        font-size: 12px;
      }
    }
  }

  .tianqiyujing::-webkit-scrollbar {
    // display: none;
    width: 2px;
    height: 4px;
    border-radius: 2px;
  }
}

// .mapClickPop {
//   /deep/ .el-dialog {
//     width: 328px;
//     min-height: 533px;
//     background: #ffffff;
//     box-shadow: 0px 2px 3px 1px rgba(132, 132, 132, 0.16);
//     border-radius: 6px 6px 6px 6px;
//     opacity: 1;
//     padding: 16px;
//     .el-dialog__header {
//       padding: 0;
//       display: flex;
//       align-items: center;
//       .mapClickPopTitle {
//         display: flex;
//         align-items: center;
//         flex-wrap: nowrap;
//         font-size: 18px;
//         font-family: PingFang SC-Bold, PingFang SC;
//         font-weight: bold;
//         color: #666666;
//         & > i {
//           color: #666666;
//           font-size: 20px;
//           margin-right: 8px;
//         }
//         & > div {
//           font-size: 14px;
//           font-family: PingFang SC-Bold, PingFang SC;
//           font-weight: bold;
//           color: #3399ff;
//           margin-left: 10px;
//           cursor: pointer;
//         }
//       }
//       .el-dialog__close {
//         font-size: 20px;
//         color: #333;
//         font-weight: bold;
//       }
//     }
//     .el-dialog__body {
//       padding: 20px 0 16px 0;
//       .tianqi {
//         text-align: center;
//         & > div:first-child {
//           font-size: 40px;
//           font-family: PingFang SC-Bold, PingFang SC;
//           font-weight: bold;
//           color: #666666;
//           & > i {
//             font-size: 40px;
//             margin-right: 8px;
//             color: #529bed;
//           }
//         }
//         & > div:last-child {
//           font-size: 14px;
//           font-family: PingFang SC-Regular, PingFang SC;
//           font-weight: 400;
//           color: #666666;
//         }
//       }
//       #jiangshuiliang {
//         margin-top: 15px;
//         height: 100px;
//         width: 100%;
//         .el-table .el-table__cell {
//           padding-top: 10px;
//           padding-bottom: 8px;
//         }
//       }
//       .jinggao {
//         display: flex;
//         align-items: center;
//         background: #f0f5ff;
//         opacity: 1;
//         border: 1px solid #6a91ff;
//         padding: 6px 10px;
//         font-size: 12px;
//         font-family: DengXian-Bold, DengXian;
//         font-weight: bold;
//         color: #7c7f97;
//         line-height: 20px;
//         .leftIcon {
//           width: 24px;
//           height: 24px;
//           color: #5086ff;
//           border-radius: 50%;
//           display: block;
//           margin-right: 8px;
//           text-align: center;
//           line-height: 24px;
//           i {
//             font-size: 24px;
//             font-weight: 900;
//           }
//         }
//         .rightDiv {
//           flex: 1;
//         }
//       }
//       .tianqiyujing {
//         // height: 220px;
//         // overflow: auto;
//         border-top: 1px #c8c8c8 solid;
//         & > div {
//           margin-top: 10px;
//           .tqyjTitle {
//             display: flex;
//             align-items: center;
//             padding: 4px 0;
//             .leftIcon {
//               font-size: 14px;
//               font-family: PingFang SC-Regular, PingFang SC;
//               font-weight: 400;
//               margin-right: 34px;
//               i {
//                 margin-right: 7px;
//               }
//             }
//             .rightTime {
//               font-size: 12px;
//               font-family: PingFang SC-Regular, PingFang SC;
//               font-weight: 400;
//               color: #666666;
//               letter-spacing: 2px;
//             }
//           }
//           .tqyjBody {
//             background: #eff7ff;
//             padding: 10px 8px;
//           }
//         }
//       }
//     }
//   }
// }
</style>
<style lang="less">
body > .mapImageView {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 999999;
  top: 0;
  background: rgba(0,0,0,.75);

  display: flex;
  align-items: center;
  justify-content: center;
  & > img {
    height: 95%;
  }
}
</style>
