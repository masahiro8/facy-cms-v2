<template>
  <v-sheet class="d-flex align-center" height="100%">
    <v-sheet class="mx-auto" width="300">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="name"
          :rules="nameRules"
          label="名前"
          required
        ></v-text-field>

        <v-text-field
          class="mt-4"
          v-model="email"
          :rules="emailRules"
          label="メールアドレス"
          required
        ></v-text-field>

        <!-- TODO:過去の日付を選択できないようにする -->
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
              class="mt-4"
              v-model="dateText"
              :rules="dateRules"
              label="日付を選択"
              readonly
              v-bind="attrs"
              v-on="on"
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
            <v-btn text color="black" @click="setDateRange(date)">確定</v-btn>
          </v-date-picker>
        </v-menu>

        <v-select
          class="mt-4"
          v-model="timeRange"
          :rules="timeRules"
          :items="timeRangeOptions"
          item-text="range"
          item-value="timeid"
          label="時間帯"
          return-object
        ></v-select>

        <v-select
          class="mt-4"
          v-model="typeId"
          :rules="typeIdRules"
          :items="typeIds"
          item-text="name"
          item-value="id"
          label="時間枠"
          return-object
        ></v-select>

        <v-btn
          class="mt-4 white--text"
          :disabled="!valid"
          color="pink darken-1"
          block
          large
          depressed
          @click.stop="validate"
        >
          確認
        </v-btn>
      </v-form>
    </v-sheet>

    <v-dialog v-model="dialog" fullscreen hide-overlay>
      <v-card class="d-flex align-center" height="100%">
        <v-sheet class="mx-auto" width="300">
          <v-card-title class="headline"> 予約内容の確認 </v-card-title>
          <v-card-text>以下の内容で予約を送信しますか？</v-card-text>

          <v-card-text>
            <v-text-field v-model="name" label="名前" disabled></v-text-field>

            <v-text-field
              class="mt-4"
              v-model="email"
              label="メールアドレス"
              disabled
            ></v-text-field>

            <v-text-field
              class="mt-4"
              v-model="dateText"
              label="日付"
              disabled
            ></v-text-field>

            <v-select
              class="mt-4"
              v-model="timeRange"
              :items="timeRangeOptions"
              item-text="range"
              item-value="timeid"
              return-object
              label="時間帯"
              disabled
            ></v-select>

            <v-select
              class="mt-4"
              v-model="typeId"
              :items="typeIds"
              item-text="name"
              item-value="id"
              label="時間枠"
              return-object
              disabled
            ></v-select>
          </v-card-text>

          <!-- TODO: 確認画面はコンポーネント分けた方が良いかも -->
          <v-card-actions>
            <v-btn
              class="white--text"
              color="pink darken-1"
              block
              large
              depressed
              @click="setNewReservation"
            >
              予約する
            </v-btn>
          </v-card-actions>
          <v-card-actions>
            <v-btn block large text @click="dialog = false"> 戻る </v-btn>
          </v-card-actions>

          <!-- 送信完了メッセージ -->
          <v-dialog v-model="message" persistent max-width="300">
            <v-card class="pa-4">
              <v-card-title>予約を送信しました</v-card-title>
              <v-card-actions>
                <v-btn color="pink darken-1" text @click="toHome"
                  >ホームへ</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-sheet>
      </v-card>
    </v-dialog>
    <!-- 空き時間なしメッセージ -->
    <v-dialog v-model="notReservable" persistent max-width="500">
      <v-card class="pa-4">
        <v-card-title class="text-center"
          >この日には予約可能な時間枠がありません</v-card-title
        >
        <v-card-actions>
          <v-btn block large text @click="notReservable = false"> 戻る </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>
<script>
import * as _ from "lodash";
import { ConfigReserve, Reserves, Typeids } from "@/api/api";

export default {
  data: () => ({
    dialog: false,
    valid: true,
    name: "",
    nameRules: [(v) => !!v || "名前の入力は必須です"],
    email: "",
    emailRules: [
      (v) => !!v || "メールアドレスの入力は必須です",
      (v) => /.+@.+\..+/.test(v) || "有効なメールアドレスを入力してください",
    ],
    menu: false,
    date: null,
    dateRules: [(v) => !!v || "日付を選択してください"],
    timeRange: "",
    timeRangeOptions: [],
    timeRules: [(v) => !!v || "時間帯を選択してください"],
    message: false,
    notReservable: false,
    typeId: null,
    typeIdRules: [(v) => !!v || "時間枠を選択してください"],
    typeIds: [],
  }),
  async mounted() {
    // 枠データ取得
    this.typeIds = await Typeids().get();
    this.typeIds.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    });
  },
  computed: {
    dateText() {
      if (this.date) {
        const dateStr = this.date.split("-");
        const yearStr = dateStr[0];
        const monthStr = dateStr[1];
        const dayStr = dateStr[2];
        return `${yearStr}年 ${monthStr}月 ${dayStr}日`;
      }
      return null;
    },
  },
  methods: {
    validate() {
      this.$refs.form.validate();
      this.$nextTick(function () {
        if (this.valid) {
          this.dialog = true;
        }
      });
    },
    setDateRange(date) {
      this.$refs.menu.save(date);
      //日付が変更されたら時間帯の選択肢をリセットしてから取得する
      this.timeRangeOptions = [];
      this.timeRange = "";
      this.getTimeRangeOptions(this.date);
    },
    async getTimeRangeOptions(value) {
      if (value) {
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

        // 予約可能な時間帯を取得
        const timeRangeByDate = await Reserves().getReservableTime({
          year: yearStr,
          month: monthStr,
          day: dayStr,
        });

        let timeRangeByDayOfWeek = await ConfigReserve().getDayOfWeek(
          dayOfWeek
        );

        //日付指定でタイムテーブルがない場合は曜日指定のタイムテーブルを取得する
        if (timeRangeByDate) {
          const activeTables = this.getActiveTables(timeRangeByDate.detail);
          this.timeRangeOptions = activeTables;
          // 空き時間帯がない場合は通知
          if (activeTables.length == 0) {
            this.notReservable = true;
          }
        } else {
          this.timeRangeOptions = this.getActiveTables(
            timeRangeByDayOfWeek.detail
          );
        }

        _.forEach(this.timeRangeOptions, function (value) {
          value.range = `${value.start} 〜 ${value.end}`;
        });
      }
    },
    async setNewReservation() {
      const params = {
        email: this.email,
        reserve_date: this.date,
        start_time: this.timeRange.start,
        end_time: this.timeRange.end,
        type_id: this.typeId.id,
      };
      const result = await Reserves().setNewReserve(params);
      console.log("result", result);
      this.message = true;
    },
    toHome() {
      this.message = false;
      this.dialog = false;
      this.$router.push("/");
    },
    getActiveTables(detail) {
      // active: true な時間枠だけ返す
      return detail.filter((table) => table.active);
    },
  },
};
</script>