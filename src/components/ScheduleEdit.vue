<template>
  <v-navigation-drawer
    class="scheculed-edit"
    v-model="edit"
    width="340"
    fixed
    right
    temporary
  >
    <v-list nav dense v-if="reservation">
      <v-list-item>
        <v-btn icon @click.stop="edit = !edit">
          <v-icon>{{ mdiClose }}</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn depressed @click.stop="update">更新</v-btn>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>名前</v-list-item-title>
          <!-- TODO: user_nameが追加されたらそれを表示する -->
          <v-list-item-subtitle></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>メールアドレス</v-list-item-title>
          <v-text-field
            v-model="email"
            label="メールアドレス"
            filled
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>日付</v-list-item-title>
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scroll-y-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="日付を選択"
                readonly
                v-bind="attrs"
                v-on="on"
                filled
                dense
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              color="black"
              locale="ja"
              :day-format="(date) => new Date(date).getDate()"
              :first-day-of-week="1"
              no-title
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn text color="black" @click="menu = false">閉じる</v-btn>
              <v-btn text color="black" @click="setDate(date)">確定</v-btn>
            </v-date-picker>
          </v-menu>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>時間</v-list-item-title>
          <v-select
            v-model="timeRange"
            :items="timeRangeOptions"
            item-text="range"
            item-value="timeid"
            filled
            dense
            return-object
          ></v-select>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>サポートid</v-list-item-title>
          <v-list-item-subtitle>{{
            reservation.video_user_id
          }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>カスタマーid</v-list-item-title>
          <v-list-item-subtitle>{{
            reservation.video_cms_id
          }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import * as _ from "lodash";
import { mdiClose } from "@mdi/js";
import { ConfigReserve, Reserves } from "@/api/api";

export default {
  data: () => ({
    mdiClose: mdiClose,
    edit: false,
    menu: false,
    reservations: null,
    reservation: null,
    email: "",
    date: null,
    timeId: "",
    timeRange: "",
    timeRangeOptions: [],
  }),
  props: {
    editorOpen: { type: Boolean, default: false },
    id: { type: String },
  },
  watch: {
    group() {
      this.edit = false;
    },
    //編集画面を開いた時
    async editorOpen() {
      this.edit = !this.edit; //editorの開閉をトグる

      //予約情報の一覧を取得
      const list = await Reserves().getReserves({
        year: null,
        month: null,
        day: null,
      });
      this.reservations = list;

      //該当するidの予約を取得
      this.reservation = _.find(this.reservations, ["id", this.id]);

      console.log("予約情報", this.id, this.reservation);

      //初期値をセット
      this.email = this.reservation.user_mail;
      this.date = this.reservation.date;
      this.getTimeRangeOptions(this.date);
    },
    date() {
      //日付に変更があったら時間帯のオプションを再取得
      this.getTimeRangeOptions(this.date);
    },
  },
  methods: {
    setDate(date) {
      this.$refs.menu.save(date);
      // this.$emit("date", date);
    },
    async getTimeRangeOptions(value) {
      const dateStr = value.split("-");
      const yearStr = dateStr[0];
      const monthStr = dateStr[1];
      const dayStr = dateStr[2];

      const jsMonth = monthStr - 1; //月が0始まりなので1引いておく

      //日付から曜日を取得
      const daysOfWeekStr = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const date = new Date(yearStr, jsMonth, dayStr);
      const dayOfWeek = daysOfWeekStr[date.getDay()];

      const timeRangeByDate = await ConfigReserve().getDate({
        year: yearStr,
        month: monthStr,
        day: dayStr,
      });

      let timeRangeByDayOfWeek = await ConfigReserve().getDayOfWeek(dayOfWeek);

      //日付指定でタイムテーブルがない場合は曜日指定のタイムテーブルを取得する
      if (timeRangeByDate) {
        this.timeRangeOptions = timeRangeByDate.detail;
      } else {
        this.timeRangeOptions = timeRangeByDayOfWeek.detail;
      }

      _.forEach(this.timeRangeOptions, function (value) {
        value.range = `${value.start} 〜 ${value.end}`;
      });

      this.timeRange = _.find(this.timeRangeOptions, [
        "start",
        this.reservation.start_time,
      ]);

      console.log(
        "時間オプション確認",
        this.timeRangeOptions,
        this.reservation.start_time,
        this.timeRange
      );
    },
    async update() {
      const params = {
        id: this.id,
        email: this.email,
        reserve_date: this.date,
        start_time: this.timeRange.start,
        end_time: this.timeRange.end,
      };

      const result = await Reserves().updateReserve(params);

      console.log("更新情報", result);
      this.$emit("update");
      this.edit = !this.edit;
    },
  },
};
</script>