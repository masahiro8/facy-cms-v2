import { DAY_OF_WEEK } from "./api/statics.js";
import * as _ from "lodash";

// 選択中のstart-end時間list
const timeRange = (dayData) => {
  const start = convertToInt(dayData.start_time);
  const end = convertToInt(dayData.end_time);
  return _.map(_.range(start, end), function (_time) {
    return _time + ":00";
  });
};

// 一枠の長さで分割した枠の開始時間list
const startTimes = (dayData) => {
  const duration = dayData.time;
  const ratio = parseInt(60 / +duration, 0);
  let _d = [];
  timeRange(dayData).forEach((_time) => {
    const timesToAdd = _.map(_.range(1, ratio), function (i) {
      return _time.replace("00", duration * i);
    });
    _d.push(_time);
    _d.push(...timesToAdd);
  });
  return _d;
};

// 開始時間と枠の長さから終了時間を計算
const getEndTime = (_startTime, dayData) => {
  const match = _startTime.match(/(\d{1,2}):(\d{2})/);
  const hour = +match[1];
  const minute = +match[2];
  const calcMinute = minute + +dayData.time;
  if (calcMinute >= 60) {
    return `${hour + 1}:00`;
  } else {
    return `${hour}:${calcMinute}`;
  }
};

// 10:00 → 10
const convertToInt = (_time) => {
  return _time ? +_time.replace(":00", "") : "";
};

const formatDateJp = (date) => {
  const _d = new Date(date);
  const year = _d.getFullYear();
  const month = _d.getMonth() + 1;
  const day = _d.getDate();
  return year + "年" + month + "月" + day + "日";
};

const funcManageTable = {
  // 曜日と日付
  getJpDay(key) {
    if (key.includes("day")) {
      return key ? DAY_OF_WEEK[key.toUpperCase()].label : "";
    } else {
      return formatDateJp(new Date(key));
    }
  },

  // 曜日一文字
  getJpDayShort(key) {
    return key ? DAY_OF_WEEK[key.toUpperCase()].shortLabel : "";
  },

  // YYYY-MM-DD を分割
  getYMD(_date) {
    return _date.match(/(\d{4})-(\d{2})-(\d{2})/).slice(1);
  },

  // timetabe再生成
  rebuildTimeTable(dayData) {
    const arr = startTimes(dayData).map((_time, index) => {
      return {
        timeid: index + 1,
        start: _time,
        end: getEndTime(_time, dayData),
        active: true
      };
    });
    // console.log("rebuildTimeTable", arr);
    return arr;
  }
  
};

export default funcManageTable;
