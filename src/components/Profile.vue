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
      item-text="label"
      item-value="value"
      persistent-hint
      return-object
    ></v-select>

    <v-btn color="error" class="mr-4 update-btn" @click="updateProfile()">
      更新
    </v-btn>
  </v-form>
</template>

<script>
// import userRoll from "../../public/json/config_user_roll.json";
// import axios from "axios";
import _, { forEach, reject, values } from "lodash";
import { Users } from "@/api/users";

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
    select: { label: "", value: "" },
    sample: "",
    items: [
      { label: "管理者", value: "admin" },
      { label: "マーケター", value: "marketer" },
      { label: "サポーター", value: "support" },
    ],
    uid: "",
  }),
  mounted() {
    Users()
      .getUsers()
      .then((users) => {
        console.log("users", users);
        const userItem = users.map((user) => {
          let userInfo = {};
          // TODO：レスポンスデータのrollが""のため一時的にstate、abbrにuser.emailを格納
          // userInfo.state = user.email;
          // userInfo.abbr = user.email;
          userInfo = user.uid;
          console.log(userInfo);
          return userInfo;
        });
        this.uid = userItem;
        // this.items = userItem;
        // this.select = userItem[0];
        console.log("userItem", userItem);
      })
      .catch((reject) => {
        console.log(reject);
      });
  },
  methods: {
    async updateProfile() {
      const params = {
        uid: "7SEVfwqIiafwVt2AGVv4q9uNLYE3",
        email: this.email,
        name: this.name,
        roll: this.select.value,
      };
      console.log("email", this.email);
      console.log("name", this.name);
      const result = await Users().updateUserProfile(params);

      alert("アップデートに成功しました");
      this.clearForm();
    },
    clearForm() {
      this.name = "";
      this.email = "";
      this.select = "";
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
