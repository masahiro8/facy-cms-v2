<template>
  <div class="manage-detail-table">
    <div class="manage-detail-table-inner">
      <v-btn @click="update()" :disabled="btnDisalbed">更新</v-btn>
      <div class="manage-type-add">
        <v-text-field
          class="name-input"
          v-model="typeData.name"
          :counter="20"
          label="枠の名前"
          required
        ></v-text-field>
        <v-text-field
          class="name-input"
          v-model="typeData.description"
          :counter="20"
          label="説明"
          required
        ></v-text-field>
      </div>
      {{ typeData }}
    </div>
  </div>
</template>

<script>
import { Typeids } from "../api/api";

export default {
  name: "ManageTypeIdDetail",
  props: { editIdProp: Object },
  data() {
    return {
      typeData: {},
    };
  },
  watch: {
    // data()で入ってこないのでwatch
    editIdProp: {
      immediate: true,
      handler: function (newVal) {
        this.typeData = newVal;
      },
    },
  },
  methods: {
    // 追加、更新
    async update() {
      // idがあれば更新
      if (this.typeData.id) {
        const param = {
          id: this.typeData.id,
          name: this.typeData.name,
          description: this.typeData.description,
        };
        const result = await Typeids().update(param);
        console.log("update", result);
      } else {
        // idなければ新規追加
        const param = {
          name: this.typeData.name,
          description: this.typeData.description,
        };
        const result = await Typeids().create(param);
        console.log("create", result);
      }
      // データ再取得
      this.$emit("get-typeids");
      this.$emit("close-drawer");
    },
  },
  computed: {
    btnDisalbed() {
      // バリデーション
      if (this.typeData.name) {
        return (
          this.typeData.name.length < 1 ||
          this.typeData.name.length > 20 ||
          this.typeData.description.length < 1 ||
          this.typeData.description.length > 20
        );
      } else {
        return true;
      }
    },
  },
};
</script> 

<style lang="scss" scoped>
$table-width: 460px;

.manage-detail-table-inner {
  width: $table-width;
  padding: 24px;
}
</style>