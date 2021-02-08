<template>
  <div class="schedule-table">
    <div class="schedule-table-inner">
      <div class="schedule-table__header">
        <div class="header__chat"></div>
        <div class="header__date">日付</div>
        <div class="header__start-time">開始</div>
        <div class="header__end-time">終了</div>
        <div class="header__user-mail">メールアドレス</div>
        <div class="header__video-user-id">サポートid</div>
        <div class="header__video-cms-id">カスタマーid</div>
        <div class="header__edit"></div>
      </div>
      <div class="schedule-table__content">
        <div
          class="reservation"
          v-for="reservation in reservations"
          :key="reservation.id"
        >
          <!-- <div>{{ reservation.id }}</div> -->
          <div class="reservation__chat">
            <v-btn icon>
              <v-icon>{{ mdiVideoChat }}</v-icon>
            </v-btn>
          </div>
          <div class="reservation__date">{{ reservation.date }}</div>
          <div class="reservation__start-time">
            {{ reservation.start_time }}
          </div>
          <div class="reservation__end-time">{{ reservation.end_time }}</div>
          <div class="reservation__user-mail">{{ reservation.user_mail }}</div>
          <div class="reservation__video-user-id">
            {{ reservation.video_user_id }}
          </div>
          <div class="reservation__video-cms-id">
            {{ reservation.video_cms_id }}
          </div>
          <div class="reservation__edit">
            <v-btn icon>
              <v-icon @click.stop="edit(reservation.id)">{{ mdiEdit }}</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
      <ScheduleEdit
        :editorOpen="editorOpen"
        :id="id"
        @update="update"
      ></ScheduleEdit>
    </div>
  </div>
</template>

<script>
import * as _ from "lodash";
import { mdiMessageVideo } from "@mdi/js";
import { mdiPencil } from "@mdi/js";
import ScheduleEdit from "./ScheduleEdit.vue";

export default {
  props: { reservations: Array },
  data: () => {
    return {
      mdiVideoChat: mdiMessageVideo,
      mdiEdit: mdiPencil,
      editorOpen: false,
      reservation: null,
      id: null,
    };
  },
  components: {
    ScheduleEdit,
  },
  methods: {
    edit(id) {
      this.editorOpen = !this.editorOpen;
      this.id = id;
      this.$emit("edit", id);
    },
    update() {
      this.$emit("update");
    },
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
$table-width: 1024px;
$chat-width: 54px;
$date-width: 160px;
$start-time-width: 76px;
$end-time-width: 76px;
$user-mail-width: 200px;
$video-user-id-width: 200px;
$video-cms-id-width: 200px;
$edit-width: 54px;

.schedule-table {
  overflow: scroll;
}

.schedule-table-inner {
  width: $table-width;
}

.schedule-table__header {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 12px;
  text-align: center;
  color: #696969;
  .header__chat {
    padding: 8px;
    width: $chat-width;
  }
  .header__date {
    padding: 8px;
    width: $date-width;
  }
  .header__start-time {
    padding: 8px;
    width: $start-time-width;
  }
  .header__end-time {
    padding: 8px;
    width: $end-time-width;
  }
  .header__user-mail {
    padding: 8px;
    width: $user-mail-width;
  }
  .header__video-user-id {
    padding: 8px;
    width: $video-user-id-width;
  }
  .header__video-cms-id {
    padding: 8px;
    width: $video-cms-id-width;
  }
  .header__edit {
    padding: 8px;
    width: $edit-width;
  }
}

.reservation {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 14px;
  text-align: center;
  .reservation__chat {
    padding: 8px;
    width: $chat-width;
  }
  .reservation__date {
    padding: 8px;
    width: $date-width;
  }
  .reservation__start-time {
    padding: 8px;
    width: $start-time-width;
  }
  .reservation__end-time {
    padding: 8px;
    width: $end-time-width;
  }
  .reservation__user-mail {
    padding: 8px;
    width: $user-mail-width;
  }
  .reservation__video-user-id {
    padding: 8px;
    width: $video-user-id-width;
  }
  .reservation__video-cms-id {
    padding: 8px;
    width: $video-cms-id-width;
  }
  .reservation__edit {
    padding: 8px;
    width: $edit-width;
  }
}
</style>
