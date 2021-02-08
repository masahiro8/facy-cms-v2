<template>
  <v-row class="scheule-header px-4">
    <v-col cols="3">
      <v-select
        v-model="sortKey"
        :items="sortKeyOptions"
        item-text="label"
        item-value="value"
        label="並べ替える項目を選択"
        filled
        dense
        return-object
        @change="$emit('sort-key', sortKey)"
      ></v-select>
    </v-col>
    <v-col cols="3">
      <v-select
        v-model="sortOrder"
        :items="sortOrderOptions"
        item-text="label"
        item-value="value"
        label="昇順/降順"
        filled
        dense
        return-object
        @change="$emit('sort-order', sortOrder)"
      >
      </v-select>
    </v-col>

    <v-col cols="3">
      <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :return-value.sync="dates"
        transition="scroll-y-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="dateRangeText"
            label="期間で絞り込み"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
            filled
            dense
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="dates"
          color="black"
          locale="ja"
          :day-format="(dates) => new Date(dates).getDate()"
          :first-day-of-week="1"
          no-title
          scrollable
          range
        >
          <v-spacer></v-spacer>
          <v-btn text color="black" @click="clearDateRange()">選択解除</v-btn>
          <v-btn text color="black" @click="menu = false">閉じる</v-btn>
          <v-btn text color="black" @click="setDateRange(dates)">確定</v-btn>
        </v-date-picker>
      </v-menu>
    </v-col>
  </v-row>
</template>
<script>
import * as _ from "lodash";
export default {
  data: () => {
    return {
      sortType: null,
      sortKey: null,
      sortOrder: "asc",
      menu: false,
      dates: null,
      sortKeyOptions: [
        { label: "日付", value: "date" },
        { label: "開始時間", value: "start_time" },
        { label: "終了時間", value: "end_time" },
        { label: "メールアドレス", value: "user_mail" },
        { label: "サポートid", value: "video_user_id" },
        { label: "カスタマーid", value: "video_cms_id" },
      ],
      sortOrderOptions: [
        { label: "昇順", value: "asc" },
        { label: "降順", value: "desc" },
      ],
    };
  },
  computed: {
    dateRangeText() {
      if (this.dates) {
        return _.sortBy(this.dates).join(" 〜 ");
      }
      return null;
    },
  },
  methods: {
    setDateRange(dates) {
      this.$refs.menu.save(dates);
      this.$emit("date-range", dates);
    },
    clearDateRange(dates) {
      this.dates = null;
      this.$refs.menu.save(this.dates);
      this.$emit("date-range", this.dates);
    },
  },
};
</script>

<style lang="scss">
/* カレンダーの土日の色設定 */
.v-date-picker-table.v-date-picker-table--date
  > table
  > tbody
  tr
  td:nth-child(6) {
  .v-btn {
    .v-btn__content {
      color: #3F51B5; //indigo
    }
  }
  .v-btn--active {
    .v-btn__content {
      color: #9FA8DA; //indigo lighten-3
    }
  }
}

.v-date-picker-table.v-date-picker-table--date
  > table
  > tbody
  tr
  td:nth-child(7) {
  .v-btn {
    .v-btn__content {
      color: #E91E63; //pink
    }
  }

  .v-btn--active {
    .v-btn__content {
      color: #F48FB1; //pink lighten-3
    }
  }
}
</style>