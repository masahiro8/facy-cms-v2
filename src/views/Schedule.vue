<template>
  <div class="schedule">
    <ScheduleHeader
      @date-range="changeDateRange"
      @sort-key="changeSortKey"
      @sort-order="changeSortOrder"
      @set-filter-keys="setFilterKeys"
    />
    <v-divider></v-divider>
    <ScheduleTable :reservations="sorted" @edit="edit" @update="update" />
  </div>
</template>
<script>
import * as _ from "lodash";
import { Reserves } from "@/api/api";
import ScheduleHeader from "@/components/ScheduleHeader.vue";
import ScheduleTable from "@/components/ScheduleTable.vue";
export default {
  name: "schedule",
  components: {
    ScheduleHeader,
    ScheduleTable,
  },
  data: () => {
    return {
      reserveData: null,
      dateRange: null,
      sortKey: "date",
      sortOrder: "desc",
      filterKeys: [],
    };
  },
  async mounted() {
    this.getReservationData();
  },
  methods: {
    async getReservationData() {
      const list = await Reserves().getReserves({
        year: null,
        month: null,
        day: null,
      });
      this.reserveData = list;
    },
    changeDateRange(value) {
      //valueの値は順番が決まっていない
      //絞り込み期間の日付を昇順で並べ替えておく
      this.dateRange = _.sortBy(value);
    },
    changeSortKey(value) {
      this.sortKey = value.value;
    },
    changeSortOrder(value) {
      this.sortOrder = value.value;
    },
    edit(value) {
      //編集画面が開いた時にデータ再取得
      this.getReservationData();
      console.log("edit", value);
    },
    update() {
      this.getReservationData();
    },
    setFilterKeys(value) {
      this.filterKeys = value;
    },
  },
  computed: {
    filteredByType() {
      // reserveDataをtype_idでフィルター
      if (this.filterKeys.length > 0) {
        return this.filterKeys.reduce((_arr, key) => {
          return _arr.concat(
            this.reserveData.filter((reserve) => reserve.type_id === key)
          );
        }, []); // ← reduceの初期値をarrayにする
      } else {
        return this.reserveData;
      }
    },
    limited() {
      if (this.dateRange && this.dateRange.length === 1) {
        //絞り込み期間の日付が一つしか指定がない場合
        //日付が一致するものだけ絞り込む
        const filtered = _.filter(this.filteredByType, [
          "date",
          this.dateRange[0],
        ]);
        return filtered;
      } else if (this.dateRange && this.dateRange.length > 1) {
        //絞り込み期間の日付に開始日と終了日がある場合
        const start = this.dateRange[0];
        const end = this.dateRange[1];
        const filtered = _.filter(this.filteredByType, function (o) {
          return o.date >= start && o.date <= end;
        });
        return filtered;
      }
      return this.filteredByType;
    },
    sorted() {
      if (this.sortKey && this.sortKey === "end_time" && this.sortOrder) {
        const sorted = _.orderBy(this.limited, this.sortKey, this.sortOrder);

        return sorted;
      } else if (this.sortKey && this.sortOrder) {
        const sorted = _.orderBy(
          _.orderBy(this.limited, "start_time", "asc"), //開始時間（昇順）で並び替え
          this.sortKey,
          this.sortOrder
        );

        return sorted;
      }
      return this.limited;
    },
  },
};
</script>