<template>
  <div class="manage-table">
    <div class="manage-table-title">個別</div>
    <div class="manage-table-inner">
      <div class="manage-table__content">
        <div class="manage-table__calendar-control">
          <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
            Prev
            <!-- <v-icon>mdi-chevron-left</v-icon> -->
          </v-btn>
          --
          <!-- <v-spacer></v-spacer> -->
          <v-btn icon class="ma-2" @click="$refs.calendar.next()">
            Next
            <!-- <v-icon>mdi-chevron-right</v-icon> -->
          </v-btn>
        </div>
        <div class="manage-table__calendar">
          <v-calendar
            locale="ja-jp"
            :day-format="(timestamp) => new Date(timestamp.date).getDate()"
            :month-format="
              (timestamp) => new Date(timestamp.date).getMonth() + 1 + ' /'
            "
            ref="calendar"
            v-model="value"
            :weekdays="weekday"
            :type="type"
            :events="events"
            :event-overlap-mode="mode"
            :event-overlap-threshold="30"
            :event-color="getEventColor"
            @change="getEvents"
          ></v-calendar>
        </div>

        <div class="timetable" v-for="(day, index) in dateData" :key="index">
          <div class="table__edit">
            <v-btn icon @click="openDrawer(day, index)">
              <v-icon>{{ edit }}</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
      <!-- 編集 drawer -->
      <Drawer :toggle="drawerToggle" @close="closeDrawer">
        <ManageTableDetails
          :dayName="editDayName"
          :dayDataProp="editDayData"
          @show-edit-status="showEditStatus"
        />
      </Drawer>
    </div>
  </div>
</template>
<script>
import * as _ from "lodash";
import Drawer from "./Drawer.vue";
import ManageTableDetails from "./ManageTableDetails.vue";
import { mdiPencil } from "@mdi/js";
import { mdiClockTimeFourOutline } from "@mdi/js";
import funcManageTable from "../funcManageTable.js";
import { START_END_TIME_RANGE, DURATIONS } from "../const.js";
import { DAY_OF_WEEK } from "../api/statics.js";

// import manageTimetableHeader from "../components/manageTimetableHeader.vue";

export default {
  name: "timetableweek",
  components: {
    Drawer,
    ManageTableDetails,
  },
  props: {
    configData: Object,
  },
  data() {
    return {
      type: "month",
      types: ["month", "week", "day", "4day"],
      mode: "stack",
      modes: ["stack", "column"],
      weekday: [0, 1, 2, 3, 4, 5, 6],
      weekdays: [
        { text: "Sun - Sat", value: [0, 1, 2, 3, 4, 5, 6] },
        { text: "Mon - Sun", value: [1, 2, 3, 4, 5, 6, 0] },
        { text: "Mon - Fri", value: [1, 2, 3, 4, 5] },
        { text: "Mon, Wed, Fri", value: [1, 3, 5] },
      ],
      value: "",
      events: [],
      colors: [
        "blue",
        "indigo",
        "deep-purple",
        "cyan",
        "green",
        "orange",
        "grey darken-1",
      ],
      names: [
        "Meeting",
        "Holiday",
        "PTO",
        "Travel",
        "Event",
        "Birthday",
        "Conference",
        "Party",
      ],

      funcManageTable: funcManageTable,
      dateData: {},
      edit: mdiPencil,
      clock: mdiClockTimeFourOutline,
      selectTimeRange: START_END_TIME_RANGE, // 開始、終了時刻選択option
      selectTimeDuration: DURATIONS, // 時間枠の長さoption
      drawerToggle: false,
      editDayName: "", // 編集する曜日テキスト
      editDayData: {}, // 編集する日データ
      editStatus: this.initEditStatus(),
    };
  },
  mounted() {
    this.dateData = this.configData;
  },
  watch: {
    // data()で入ってこないのでwatch
    configData: {
      immediate: true,
      handler: function (newVal) {
        this.dateData = newVal;
      },
    },
  },
  methods: {
    initEditStatus() {
      // 各日の編集状態init
      const days = _.map(DAY_OF_WEEK, (day) => day.id);
      let obj = {};
      days.forEach((day) => {
        obj[day] = false;
      });
      return obj;
    },
    onChange(index) {
      // 編集ステータス変更
      this.showEditStatus(index);
    },
    onTimeChange(index) {
      // 時間系の変更あれば変更日の時間枠を再生成
      console.log("onTimeCHange", index);
      this.dateData[index].detail = this.funcManageTable.rebuildTimeTable(
        this.dateData[index]
      );
      // 編集ステータス変更
      console.log("editStatus", this.editStatus[index]);
      this.showEditStatus(index);
    },
    showEditStatus(index) {
      // 編集中status
      this.editStatus[index] = true;
    },
    openDrawer(dayData, index) {
      this.editDayName = index;
      this.editDayData = dayData;
      this.drawerToggle = true;
      // "date": {
      //   "2020": {
      //     "1": {
      //       "1": {
      //         "active": true,
      //         "detail": [
      //           {
      //             "timeid": 1,
      //             "active": true,
      //             "start": "10:00",
      //             "end": "10:30"
      //           },
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