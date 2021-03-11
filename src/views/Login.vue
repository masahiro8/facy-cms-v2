<template>
  <div class="login">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        class="cols-4"
        v-model="email"
        :rules="emailRules"
        label="メールアドレス"
        required
      ></v-text-field>

      <v-text-field
        class="cols-4"
        v-model="password"
        :rules="passwordRules"
        type="password"
        label="パスワード"
        required
      ></v-text-field>
    </v-form>

    <div class="keeplogin-container">
      <v-checkbox
        v-model="loginStatus"
        :label="`ログインしたままにする`"
      ></v-checkbox>
    </div>

    <div class="button-container">
      <v-btn color="error" class="button mr-4" @click="login()">
        ログイン
      </v-btn>
    </div>
    <div class="link-reset-container">
      <router-link class="link-reset" to="/reset"
        >パスワードを再設定する</router-link
      >
    </div>
  </div>
</template>

<script>
import { UserAuth } from "@/api/userAuth.js";
import { Toaster } from "../components/Toast.vue";

export default {
  data: () => ({
    valid: false,
    email: "",
    emailRules: [
      (v) => !!v || "メールアドレスの入力は必須です",
      (v) => /.+@.+/.test(v) || "有効なメールアドレスを入力してください",
    ],
    password: "",
    passwordRules: [
      (v) => !!v || "パスワードの入力は必須です",
      (v) => 8 <= v.length || "８文字以上の有効なパスワードを入力してください",
    ],
    loginStatus: false,
  }),
  mounted() {
    const _loginStatus = localStorage.getItem("mahouKeepLogin"); // 1 or undef
    this.loginStatus = _loginStatus === 1 ? true : false;
  },
  methods: {
    async login() {
      const params = {
        email: this.email,
        password: this.password,
      };
      const result = await UserAuth().login(params);
      if (result.error) {
        alert("パスワードもしくはメールアドレスが間違っています。");
        this.clearForm();
      } else {
        // ログインステータス 再set
        localStorage.removeItem("mahouLoginAt");
        localStorage.removeItem("mahouKeepLogin");
        localStorage.setItem("mahouLoginAt", new Date().getTime());
        if (this.loginStatus) {
          localStorage.setItem("mahouKeepLogin", 1);
        }

        Toaster.show({ timeout: 1500, text: "ログインしました。" });
        this.$router.push("/");
      }
    },
    clearForm() {
      this.email = "";
      this.password = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  padding: 20px;
  width: 300px;
  margin: 200px auto;

  .button-container {
    text-align: center;
    margin-top: 50px;
    .button {
      background-color: red;
      color: white;
      width: 100%;
    }
  }

  .link-reset-container {
    text-align: center;
    margin-top: 30px;

    .link-reset {
      text-decoration: none;
      color: black;
    }
  }

  .keeplogin-container {
    margin-top: 20px;
  }
}
</style>
