<template>
  <v-form ref="form" v-model="valid" lazy-validation class="profile">
    <v-text-field
      v-model="name"
      :rules="nameRules"
      label="名前"
      required
    ></v-text-field>

    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="メールアドレス"
      required
    ></v-text-field>

    <v-select
      v-model="select"
      :items="items"
      :rules="[(v) => !!v || '権限を選択してください']"
      label="権限"
      required
    ></v-select>

    <v-btn color="error" class="mr-4 update-btn" @click="updateProfile">
      更新
    </v-btn>
  </v-form>
</template>
  

<script>
import userRoll from "../../public/json/config_user_roll.json";

export default {
  data: () => ({
    valid: true,
    name: "",
    nameRules: [
      (v) => !!v || "名前の入力は必須です",
      (v) => !!v || "名前を入力してください",
    ],
    email: "",
    emailRules: [
      (v) => !!v || "メールアドレスの入力は必須です",
      (v) => /.+@.+\..+/.test(v) || "有効なメールアドレスを入力してください",
    ],
    select: null,
    items: [
      userRoll.ADMIN.label.ja,
      userRoll.MARKETER.label.ja,
      userRoll.SUPPORT.label.ja,
    ],
  }),

  methods: {
    updateProfile() {
      alert("アップデートに成功しました");
    },
  },
};
</script>

<style lang="scss" scoped>
.profile {
  padding: 20px;
  width: 300px;
  margin: 200px auto;

  .update-btn {
    width: 100%;
  }
}
</style>
