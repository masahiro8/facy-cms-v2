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
    <div class="button-container">
      <v-btn color="error" class="button mr-4">　ログイン　</v-btn>
    </div>
  </div>
</template>

<script>
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
  }),
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
}
</style>
