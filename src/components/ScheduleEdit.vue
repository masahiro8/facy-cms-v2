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
        <v-btn depressed @click.stop="update" :disabled="disableUpdate"
          >更新</v-btn
        >
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
          <v-list-item-title>時間枠</v-list-item-title>
          <v-select
            v-model="typeId"
            :items="typeIds"
            item-text="name"
            item-value="id"
            filled
            dense
            :loading="loadingTypeid"
            return-object
          ></v-select>
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
            :loading="loadingTimeOptions"
            :disabled="disableTimeRangeOptions"
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
import { Reserves, Typeids } from "@/api/api";
import funcManageTable from "../funcManageTable.js";

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
    typeId: null,
    typeIds: [], // 時間枠の選択肢
    typeIdsReset: [], // すべての時間枠リスト（予約不可枠を含む）
    funcManageTable: funcManageTable,
    reservableByDate: {},
    notAvailableMessage: "空き時間帯なし",
    disableTimeRangeOptions: false,
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
      // select初期値を空にする
      this.resetSelectOptions();

      this.edit = !this.edit; //editorの開閉をトグる

      // 時間枠リスト取得
      this.getTypeIds();

      //予約情報の一覧を取得
      const list = await Reserves().getReserves({
        year: null,
        month: null,
        day: null,
      });
      this.reservations = list;

      //該当するidの予約を取得
      this.reservation = _.find(this.reservations, ["id", this.id]);

      // 予約日の空き時間枠、時間帯を取得
      this.reservableByDate = await this.getReservableByDate(
        this.reservation.date
      );
      // 時間枠を更新
      this.initTypeids(this.reservation.type_id);

      // 現予約枠の時間帯をset
      setTimeout(this.initTimeRangeOptions, 300);

      //初期値をセット
      this.email = this.reservation.user_mail;
      this.date = this.reservation.date;
    },

    typeId: {
      // on 時間枠変更
      handler: function (newVal, oldVal) {
        // drawer open時(oldVal == null)は発火させない
        if (newVal && oldVal) {
          this.updateTimeRangeOptions(newVal.id);
        }
      },
    },
  },
  methods: {
    async setDate(date) {
      // on 日付変更
      this.$refs.menu.save(date);
      this.resetSelectOptions();
      this.reservableByDate = await this.getReservableByDate(date);
      this.typeId = this.typeIds[0];
      this.updateTimeRangeOptions(this.typeId);
    },

    //
    async initTimeRangeOptions() {
      // 枠の時間帯を読み込んでoptionにset
      if (this.reservableByDate) {
        // 現予約枠に空き時間帯あれば読み込み
        const reservedHasOpenTimeRange = this.reservableByDate[
          this.reservation.type_id
        ];
        if (reservedHasOpenTimeRange) {
          this.timeRangeOptions = await this.getActiveTables(
            this.reservableByDate[this.reservation.type_id].detail
          );
        }
        // 現予約の時間帯を追加
        this.timeRangeOptions.push(this.timeRangeFormat(this.reservation));
        // select表示用文字列追加
        this.addSelectRangeToOptions();
      }
      // start時間順に並び替え
      this.timeRangeOptions = this.sortTimesByStartTime(this.timeRangeOptions);

      // 現予約時間を初期値としてset
      this.timeRange = _.find(this.timeRangeOptions, [
        "start",
        this.reservation.start_time,
      ]);
    },

    async updateTimeRangeOptions(typeid) {
      this.timeRangeOptions = [];
      this.disableTimeRangeOptions = false;

      // 選択した時間枠の空き時間帯の有無で条件分岐
      if (this.reservableByDate[typeid]) {
        // 空き時間帯ある場合 → 時間枠get
        this.timeRangeOptions = await this.getActiveTables(
          this.reservableByDate[typeid].detail
        );
        // select表示用文字列追加
        this.addSelectRangeToOptions();
      } else {
        // 空き時間帯がない場合
        if (typeid === this.reservation.type_id) {
          // 現予約枠を再選択した場合は現予約時間帯を表示
          this.timeRangeOptions.push(this.timeRangeFormat(this.reservation));
          this.addSelectRangeToOptions();
        } else {
          // 変更した枠に空き時間帯がない場合
          this.timeRangeOptions = [{ range: [this.notAvailableMessage] }];
          this.disableTimeRangeOptions = true;
        }
      }
      // 一番上の値を初期値としてset
      this.timeRange = this.timeRangeOptions[0];
    },

    async update() {
      const params = {
        id: this.id,
        email: this.email,
        reserve_date: this.date,
        start_time: this.timeRange.start,
        end_time: this.timeRange.end,
        type_id: this.typeId.id,
      };

      const result = await Reserves().updateReserve(params);

      console.log("更新情報", result);
      this.$emit("update");
      this.edit = !this.edit;
    },

    getActiveTables(detail) {
      // active: true な時間枠だけ返す
      return detail.filter((table) => table.active);
    },

    timeRangeFormat(detail) {
      // 選択中の時間枠をselect用フォーマットに変換
      return {
        active: true,
        end: detail.end_time,
        start: detail.start_time,
        range: "",
      };
    },

    async getTypeIds() {
      // 枠データ取得（予約不可枠含む）
      const _typeIds = await Typeids().get();
      this.typeIdsReset = this.funcManageTable.sortTypesByName(_typeIds);
    },

    async getReservableByDate(_date) {
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

    resetSelectOptions() {
      // 選択optionを初期化
      this.timeRangeOptions = [];
      this.timeRange = "";
      this.typeId = null;
      this.typeIds = this.typeIdsReset;
    },

    initTypeids(_typeid) {
      // 全予約枠を選択リストにコピー
      this.typeIds = this.typeIdsReset;

      // 現予約枠を初期値としてset
      const _id = parseInt(_typeid);
      const reservedType = this.typeIdsReset.find((_type) => {
        return _type.id == _id;
      });
      this.typeId = reservedType;
    },

    sortTimesByStartTime(times) {
      times.sort((a, b) => {
        if (a.start < b.start) {
          return -1;
        } else {
          return 1;
        }
      });
      return times;
    },

    addSelectRangeToOptions() {
      // 時間帯selectに表示用文字列を追加
      _.forEach(this.timeRangeOptions, function (value) {
        value.range = `${value.start} 〜 ${value.end}`;
      });
    },
  },
  computed: {
    loadingTypeid() {
      return this.typeId ? false : true;
    },
    loadingTimeOptions() {
      return this.timeRangeOptions.length === 0 ? true : false;
    },
    disableUpdate() {
      // 更新ボタンバリデーション
      if (!this.date || !this.typeId || !this.timeRange) {
        return true;
      }
      if (this.disableTimeRangeOptions) {
        return true;
      }
      // 現予約内容から変更されたか
      if (
        this.date != this.reservation.date ||
        this.typeId.id != this.reservation.type_id ||
        this.timeRange.start != this.reservation.start_time
      ) {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>