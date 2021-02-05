<template>
  <v-form ref="form" v-model="valid" lazy-validation class="profile">
    <v-text-field v-model="name" :rules="nameRules" label="名前" required></v-text-field>

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
    // window.addEventListener("load", (event) => {
    //   console.log("page is fully loaded");
    // });

    Users()
      .getUsers()
      .then((users) => {
        console.log("users", users);
        const userItem = users.map((user) => {
          let userInfo = {};
          userInfo.id = user.uid;
          // userInfo.name = "こんにちは";
          return userInfo;
        });
        this.uid = userItem;
        console.log("userItem", userItem);
      })
      .catch((reject) => {
        console.log(reject);
      });
  },
  methods: {
    // window: (onload = () => {
    //   this.name = "名前を入れる";
    // }),
    async updateProfile() {
      const params = {
        // uid: this.uid[0], //　ここはログインしている人のuidを取れるようにする必要がある
        uid: "7JzX7urSEpYSBka5GoOkFxCAlXD2",
        email: this.email,
        name: this.name,
        roll: this.select.value,
      };
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
  beforeCreate() {
    window.addEventListener("load", (event) => {
      console.log("page is fully loaded");
    });
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
