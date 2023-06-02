// 地理图层组件
<template>
    <div class="ylsOkk">
        <div @click="showCheck = !showCheck" class="mapicon">
            <span :class="{ active: showCheck }">边界设置</span>
        </div>
        <div v-if="showCheck" class="mapcheck">
            <el-checkbox v-model="province" @change="provinceFun">省界</el-checkbox>
            <el-checkbox v-model="country" @change="countryFun">市界</el-checkbox>
            <!-- <el-checkbox v-model="town" @change="townFun">县界</el-checkbox> -->
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import * as L from "leaflet";
import geobuf from "geobuf";
import Pbf from "pbf";
import hnUrl from '@/assets/geojson/hn.png';
import hnCityUrl from '@/assets/geojson/hn_city.png';
import * as turf from "@turf/turf";

const props = defineProps(['map'])
const emits = defineEmits(['show'])
const showCheck = ref(false);
const province = ref(true);
const country = ref(true);
const town = ref(false);
let provinceLayer = new L.LayerGroup(); //点图层
let countryLayer = new L.LayerGroup(); //线图层
let townLayer = new L.LayerGroup(); //矩形图层

function provinceFun() {
    //区县边界
    if (props.map) {
        if (province.value) {
            provinceLayer.addTo(props.map);
        } else {
            props.map.removeLayer(provinceLayer);
        }
    }
}
function countryFun() {
    if (props.map) {
        if (country.value) {
            countryLayer.addTo(props.map);
        } else {
            props.map.removeLayer(countryLayer);
        }
    }
}
function townFun() {

}
function initSelect() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", hnUrl, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function () {
        L.geoJson(geobuf.decode(new Pbf(xhr.response)), {
            style() {
                return {
                    color: "#010101",
                    fill: false,
                    fillOpacity: 0,
                    weight: 3,
                };
            },
            pane: "hn-border",
        }).addTo(provinceLayer);
    };
    xhr.send();
    provinceFun()
    let xhr2 = new XMLHttpRequest();
    xhr2.open("GET", hnCityUrl, true);
    xhr2.responseType = "arraybuffer";
    xhr2.onload = function () {
        L.geoJson(geobuf.decode(new Pbf(xhr2.response)), {
            style() {
                return {
                    color: "#5F6368",
                    fill: false,
                    fillOpacity: 0,
                    weight: 2,
                };
            },
            pane: "hn-city-border",
        }).addTo(countryLayer);
        countryFun();
    };
    xhr2.send();
}
function initLayer() {
    provinceLayer.addTo(props.map); //点图层
    countryLayer.addTo(props.map); //线图层
    townLayer.addTo(props.map); //矩形图层
    props.map.createPane("hn-border").style.zIndex = "9999";
    props.map.createPane("hn-city-border").style.zIndex = "9998";
    props.map.createPane("hn-town-border").style.zIndex = "9997";
    initSelect()
}

onMounted(() => {
    if (props.map) {
        initLayer();
    }
});
watch(
    () => props.map,
    (old, val) => {
        if (props.map) {
            initLayer();
        }
    }
);
watch(showCheck, (newVal) => {
    if (newVal) {
        emits('show')
    }
})
function closeCheck() {
    showCheck.value = false
}
defineExpose({
    closeCheck
})
</script>
<style lang="scss">
.ylsOkk {
    .el-checkbox {
        height: 22px;
        width: 100%;

        .el-checkbox__label {
            padding-left: 6px;
            // color: #fff;
            // text-shadow: 2px 3px 1px #fff;
            font-family: PingFangSC-Regular;
            font-size: 12px;
        }
    }
}
</style>
<style lang="scss" scoped>
.ylsOkk {
    // width: 80px;
    padding: 4px 8px;
    // background: rgba(153, 153, 153, 0.6);
    border-radius: 4px;
    position: absolute;
    top: 21px;
    left: 100px;
    z-index: 1000;

    .mapicon {
        background: rgba(255, 255, 255, 0.8);
        padding: 5px;
        // width: 30px;
        // height: 30px;
        border-radius: 5px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.16);
        cursor: pointer;

        .icon {
            width: 30px;
            height: 30px;
        }
    }

    .mapcheck {
        margin-top: 10px;
        padding: 5px;
        border-radius: 5px;
        width: 70px;
        // background: rgba(153, 153, 153, 0.6);
        background: #f7f7f7;
        border: 1px solid #666;
    }
}
</style>