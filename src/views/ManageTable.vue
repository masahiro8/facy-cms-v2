<template>
  <div class="schedule">
    <!-- {{ configData.day_of_week }} -->
    <ManageTableWeek :configData="configData.day_of_week" />
    <!-- <ManageTableWeek :configData="configData" /> -->
  </div>
</template>

<script>
import * as _ from "lodash";
// import manageTimetableHeader from "../components/manageTimetableHeader.vue";
import ManageTableWeek from "../components/ManageTableWeek.vue";
import CONFIG_SCHEDULE from "../../public/json/config_schedule.json";

export default {
  name: "managetable",
  components: {
    // manageTimetableHeader,
    ManageTableWeek,
  },
  data() {
    return {
      configData: CONFIG_SCHEDULE,
    };
  },
  mounted() {
    // this.configData = CONFIG_SCHEDULE;
  },
};
</script>