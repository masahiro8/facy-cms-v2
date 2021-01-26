<template>
  <v-navigation-drawer
    class="scheculed-edit"
    v-model="edit"
    absolute
    right
    temporary
  >
    <v-list nav dense>
      <v-list-item>
        <v-btn icon @click.stop="edit = !edit">
          <v-icon>{{ mdiClose }}</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn depressed>更新</v-btn>
      </v-list-item>

      <v-list-item>
        <v-list-item-title>名前</v-list-item-title>
      </v-list-item>

      <v-list-item>
        <v-list-item-title>メールアドレス</v-list-item-title>
      </v-list-item>

      <v-list-item>
        <v-list-item-title>日付</v-list-item-title>
      </v-list-item>

      <v-list-item>
        <v-list-item-title>時間</v-list-item-title>
      </v-list-item>

      <v-list-item>
        <v-list-item-title>サポートid</v-list-item-title>
      </v-list-item>

      <v-list-item>
        <v-list-item-title>カスタマーid</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import { mdiClose } from "@mdi/js";

export default {
  data: () => ({
    mdiClose: mdiClose,
    edit: false,
  }),
  props: { editorOpen: { type: Boolean, default: false } },
  mounted() {},
  watch: {
    group() {
      console.log("group", this.group);
      this.edit = false;
    },
    editorOpen() {
      this.edit = !this.edit; //editorの開閉をトグる
    },
  },
};
</script>