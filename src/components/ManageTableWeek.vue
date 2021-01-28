<template>
  <div class="manage-table">
    <v-btn to="">保存</v-btn>
    <div class="manage-table-title">曜日</div>
    <div class="manage-table-inner">
      <div class="manage-table__header">
        <div class="header__day"></div>
        <div class="header__active"></div>
        <div class="header__check"></div>
        <div class="header__start-time">開始時刻</div>
        <div class="header__end-time">終了時刻</div>
        <div class="header__time">時間</div>
        <div class="header__edit"></div>
      </div>
      <div class="manage-table__content">
        <div class="timetable" v-for="(day, index) in weekData" :key="index">
          <div class="table__day">{{ func.getJpDayShort(index) }}</div>
          <div class="table__active">
            <v-btn icon>
              <v-icon>{{ clock }}</v-icon>
            </v-btn>
          </div>
          <div class="table__check">
            <v-checkbox v-model="day.active"></v-checkbox>
          </div>
          <div class="table__start-time">
            <v-select
              :items="selectTimeRange"
              v-model="day.start_time"
              filled
              dense
            ></v-select>
          </div>
          <div class="table__end-time">
            <v-select
              :items="selectTimeRange"
              v-model="day.end_time"
              filled
              dense
            ></v-select>
          </div>
          <div class="table__time">
            <v-select
              :items="selectTimeDuration"
              item-text="`${day.time}分`"
              v-model="day.time"
              filled
              dense
            >
              <template v-slot:item="data">
                <span>{{ data.item }}分</span>
              </template>
            </v-select>
          </div>
          <div class="table__edit">
            <v-btn icon @click="openDrawer(day, index)">
              <v-icon>{{ edit }}</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
      <!-- 編集 drawer -->
      <Drawer :toggle="drawerToggle" @close="closeDrawer">
        <ManageTableWeekDetails
          :dayName="editDayName"
          :dayDataProp="editDayData"
        />
      </Drawer>
    </div>
  </div>
</template>
<script>
import * as _ from "lodash";
import CONFIG_SCHEDULE from "../../public/json/config_schedule.json";
import Drawer from "./Drawer.vue";
import ManageTableWeekDetails from "./ManageTableWeekDetails.vue";
import { mdiPencil } from "@mdi/js";
import { mdiClockTimeFourOutline } from "@mdi/js";
import func from "../func.js";
import { START_END_TIME_RANGE, DURATIONS } from "../const.js";

// import manageTimetableHeader from "../components/manageTimetableHeader.vue";

export default {
  name: "timetableweek",
  components: {
    Drawer,
    ManageTableWeekDetails,
  },
  data() {
    return {
      func: func,
      weekData: CONFIG_SCHEDULE.day_of_week,
      edit: mdiPencil,
      clock: mdiClockTimeFourOutline,
      selectTimeRange: START_END_TIME_RANGE, // 開始、終了時刻選択option
      selectTimeDuration: DURATIONS, // 時間枠の長さoption
      drawerToggle: false,
      editDayName: "", // 編集する曜日テキスト
      editDayData: {}, // 編集する日データ
    };
  },
  methods: {
    openDrawer(dayData, index) {
      this.editDayName = index;
      this.editDayData = dayData;
      this.drawerToggle = true;
    },
    closeDrawer() {
      this.drawerToggle = false;
    },
  },
  computed: {},
};
</script> 

<style lang="scss" scoped>
$table-width: 1024px;
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
  .header__day {
    padding: 8px;
    width: $day-width;
  }
  .header__active {
    padding: 8px;
    width: $active-width;
  }
  .header__check {
    padding: 8px;
    width: $check-width;
  }
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
  .header__edit {
    padding: 8px;
    width: $edit-width;
  }
}

.timetable {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 14px;
  text-align: center;
  .table__day {
    padding: 8px;
    width: $day-width;
  }
  .table__active {
    padding: 8px;
    width: $active-width;
  }
  .table__check {
    padding: 8px;
    width: $check-width;
  }
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
  .table__edit {
    padding: 8px;
    width: $edit-width;
  }
}
</style>