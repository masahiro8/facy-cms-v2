<template>
  <div class="manage-table">
    <div class="manage-table-inner">
      <v-btn to="">更新</v-btn>
      <div class="manage-table__title">
        <v-checkbox
          v-model="dayData.active"
          :label="`${funcManageTable.getJpDay(dayName)}`"
        ></v-checkbox>
      </div>
      <div class="manage-table__header">
        <div class="header__start-time">開始時刻</div>
        <div class="header__end-time">終了時刻</div>
        <div class="header__time">時間</div>
      </div>
      <div class="manage-table__content">
        <div class="timetable">
          <div class="table__start-time">
            <v-select
              :items="selectTimeRange"
              v-model="dayData.start_time"
              @change="onTimeChange"
              filled
              dense
            ></v-select>
          </div>
          <div class="table__end-time">
            <v-select
              :items="selectTimeRange"
              v-model="dayData.end_time"
              @change="onTimeChange"
              filled
              dense
            ></v-select>
          </div>
          <div class="table__time">
            <v-select
              :items="selectTimeDuration"
              item-text="`${dayData.time}分`"
              v-model="dayData.time"
              @change="onTimeChange"
              filled
              dense
            >
              <template v-slot:item="data">
                <span>{{ data.item }}分</span>
              </template>
            </v-select>
          </div>
        </div>
      </div>
    </div>
    <v-divider></v-divider>
    <!-- {{ dayData.detail }} -->
    <div class="manage-table-inner">
      <div class="manage-table__header">
        <div class="header__detail">個別の時間指定</div>
      </div>
      <div class="manage-table__content">
        <span v-for="time in dayData.detail" :key="time.timeid">
          <v-checkbox
            v-model="time.active"
            :label="`${time.start} - ${time.end}`"
          ></v-checkbox>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
// import * as _ from "lodash";
// import CONFIG_SCHEDULE from "../../public/json/config_schedule.json";
import funcManageTable from "../funcManageTable.js";
import { START_END_TIME_RANGE, DURATIONS } from "../const.js";

// import manageTimetableHeader from "../components/manageTimetableHeader.vue";

export default {
  name: "ManageTableWeekDetails",
  components: {
    // manageTimetableHeader,
  },
  props: { dayName: String, dayDataProp: Object },
  data: function () {
    return {
      funcManageTable: funcManageTable,
      dayData: {},
      selectTimeRange: START_END_TIME_RANGE, // 開始、終了時刻選択option
      selectTimeDuration: DURATIONS, // 時間枠の長さoption
    };
  },
  mounted() {
    this.dayData = this.dayDataProp;
  },
  methods: {
    onTimeChange() {
      // 時間系の変更あれば時間枠を再生成
      this.dayData.detail = this.funcManageTable.rebuildTimeTable(this.dayData);
    },
  },
  watch: {
    // data()で入ってこないのでwatch
    dayDataProp: {
      immediate: true,
      handler: function (newVal) {
        this.dayData = newVal;
      },
    },
  },
};
</script> 

<style lang="scss" scoped>
$table-width: 460px;
$day-width: 40px;
$active-width: 40px;
$check-width: 40px;
$start-time-width: 128px;
$end-time-width: 128px;
$time-width: 128px;
$edit-width: 40px;

.manage-table {
  overflow: scroll;
}

.manage-table-inner {
  width: $table-width;
}

.manage-table__header {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 12px;
  text-align: center;
  color: #696969;
  .header__start-time {
    padding: 8px;
    width: $start-time-width;
  }
  .header__end-time {
    padding: 8px;
    width: $end-time-width;
  }
  .header__time {
    padding: 8px;
    width: $time-width;
  }
}

.timetable {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 14px;
  text-align: center;
  .table__start-time {
    padding: 8px;
    width: $start-time-width;
  }
  .table__end-time {
    padding: 8px;
    width: $end-time-width;
  }
  .table__time {
    padding: 8px;
    width: $time-width;
  }
}
</style>