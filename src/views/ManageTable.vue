<template>
  <div class="schedule">
    <v-btn to="">保存</v-btn>
    <ManageTableWeek :configData="configData.day_of_week" />
    <ManageTableDate :configData="configData" />
  </div>
</template>

<script>
// import * as _ from "lodash";
// import manageTimetableHeader from "../components/manageTimetableHeader.vue";
import ManageTableWeek from "../components/ManageTableWeek.vue";
import ManageTableDate from "../components/ManageTableDate.vue";
import CONFIG_SCHEDULE from "../../public/json/config_schedule.json";

export default {
  name: "managetable",
  components: {
    // manageTimetableHeader,
    ManageTableWeek,
    ManageTableDate,
  },
  data() {
    return {
      configData: CONFIG_SCHEDULE,
    };
  },
};
</script>

<style lang="scss">
.manage-table {
  width: 800px;

  padding: 24px 0;
}

.manage-table-title {
  font-size: 20px;
  color: grey;
}
</style>