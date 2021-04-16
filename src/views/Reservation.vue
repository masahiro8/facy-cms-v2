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
          v-model="typeId"
          :rules="typeIdRules"
          :items="typeIds"
          item-text="name"
          item-value="id"
          label="時間枠"
          return-object
        ></v-select>

        <v-select
          class="mt-4"
          v-model="timeRange"
          :rules="timeRules"
          :items="timeRangeOptions"
          item-text="range"
          item-value="timeid"
          :label="timeRangeLabel"
          :disabled="disableTimeRange"
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
              v-model="typeId"
              :items="typeIds"
              item-text="name"
              item-value="id"
              label="時間枠"
              return-object
              disabled
            ></v-select>

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
  </v-sheet>
</template>

<script>
import { Reserves, Typeids } from "@/api/api";
import funcManageTable from "../funcManageTable.js";

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
    typeId: null,
    typeIdRules: [(v) => !!v || "時間枠を選択してください"],
    typeIds: [], // 時間枠の選択肢
    typeIdsReset: [], // apiからの初期値
    funcManageTable: funcManageTable,
    timeRangeByDate: {},
    typeIdsHasTimeReservable: {},
    testA: {},
    disableTimeRange: false,
    timeRangeLabel: "時間帯",
  }),
  async mounted() {
    // 枠データ取得
    const _typeids = await this.getTypeids();
    this.typeIds = _typeids;
    this.typeIdsReset = _typeids;
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
  watch: {
    typeId: {
      // 枠の変更で時間帯option変更
      immediate: true,
      handler: function (newVal) {
        if (newVal) {
          this.getTimeRangeByTypeid(newVal.id).then((result) => {
            // 空き時間がある
            if (result) {
              this.resetTimeRangeSelect();
              this.timeRangeOptions = this.getActiveTables(result.detail);
              // select用の文字列追加
              this.timeRangeOptions.forEach((element) => {
                element.range = `${element.start} 〜 ${element.end}`;
              });
            } else {
              // 空き時間がない
              this.disableTimeRangeSelect();
            }
          });
        }
      },
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

    async getTypeids() {
      // 枠データ取得、nameでsortしてset
      const _typeIds = await Typeids().get();
      return this.funcManageTable.sortTypesByName(_typeIds);
    },

    async setDateRange(date) {
      this.$refs.menu.save(date);
      //日付が変更されたら時間帯、枠の選択肢をリセットしてから取得する
      this.resetSelectOptions();
      this.timeRangeByDate = await this.getTimeRangeByDate(this.date);
      // this.updateTypeids();
    },

    async getTimeRangeByDate(_date) {
      // 選択日の予約可能な時間帯をapiから取得
      if (_date) {
        const dateStr = _date.split("-");
        const yearStr = dateStr[0];
        const monthStr = dateStr[1];
        const dayStr = dateStr[2];

        return await Reserves().getReservableTime({
          year: yearStr,
          month: monthStr,
          day: dayStr,
        });
      }
    },

    async getTimeRangeByTypeid(typeidId) {
      if (typeidId) {
        return await this.timeRangeByDate[typeidId];
      }
    },

    resetSelectOptions() {
      // 選択optionを初期化
      this.timeRangeOptions = [];
      this.timeRange = "";
      this.typeId = null;
      this.typeIds = this.typeIdsReset;
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

    resetTimeRangeSelect() {
      this.disableTimeRange = false;
      this.timeRangeLabel = "時間帯";
      this.timeRules = [(v) => !!v || "時間帯を選択してください"];
    },
    disableTimeRangeSelect() {
      this.disableTimeRange = true;
      this.timeRangeLabel = "空き時間がありません";
      this.timeRules = [""];
    },
  },
};
</script>