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
      :hint="`${select.state}, ${select.abbr}`"
      :items="items"
      :rules="[(v) => !!v || '権限を選択してください']"
      label="権限"
      required
      item-text="state"
      item-value="abbr"
      persistent-hint
      return-object
    ></v-select>

    <v-btn color="error" class="mr-4 update-btn" @click="updateProfile">
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
    select: { state: "", abbr: "" },
    sample: "",
    items: [],
  }),
  mounted() {
    Users()
      .getUsers()
      .then((users) => {
        const userItem = users.map((user) => {
          let userInfo = {};
          // TODO：レスポンスデータのrollが""のため一時的にstate、abbrにuser.emailを格納
          userInfo.state = user.email;
          userInfo.abbr = user.email;
          return userInfo;
        });
        this.items = userItem;
        this.select = userItem[0];
      })
      .catch((reject) => {
        console.log(reject);
      });

    // console.log(updateUserProfile);
    // console.log(Users);
    // fetch("./api/users.js")
    //   .then((response) => {
    //     console.log(response);
    //     // Do Something
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
    // this.axios
    //   .get("json/config_user_roll.json")
    //   .then((response) => {
    //     console.log(response.data.ADMIN.label.ja);
    //     console.log(response.data);
    //     this.item.state = response.data.ADMIN.label.ja;
    //     this.item.abbr = response.data.ADMIN.id;
    //     this.item.abbr.push(response.data.ADMIN.id);
    //     console.log("this.item.state", this.item.state);
    //     console.log("this.item.abbr", this.item.abbr);
    //   })
    //   .catch((e) => {
    //     console.log("error called");
    //   });
    // let items = [];
    // this.axios
    //   .get("json/users.json")
    //   .then((response) => {
    //     // console.log(response.data.users[1]);
    //     const rollItem = _.forEach(response.data.users, (value, key) => {
    //       console.log("value", value);
    //       // console.log("key", key);
    //       console.log("*", response.data.users);
    //       // items.push({ [key]: _.assign(value) });
    //       items.push({ [key]: _.assign(value) });
    //     });
    //   })
    //   .catch((e) => {
    //     console.log("error called");
    //   });
    // console.log(items);
    // let categories = [];
    // console.log("categories", categories);
    // this.item = [];
    // this.axios
    //   .get("json/users.json")
    //   .then((response) => {
    //     const rollItem = _.forEach(response.data, (value, key) => {
    //       console.log("value", value);
    //       // console.log("key", key);
    //       console.log("*", response.data.users);
    //       // this.item.push(value);
    //       // categories.psuh({ [key]: _.assign(value) });
    //       this.item.psuh(response.data.users);
    //       // console.log(categories);
    //       var obj = {};
    //       obj[key] = _.assign(value, response.data[key]);
    //       console.log("value2", value);
    //       this.item.push({ [key]: _.assign(value, response.data[key]) });
    //     });
    //     rollItem;
  },
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
