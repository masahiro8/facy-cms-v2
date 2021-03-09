<template>
  <v-container class="home">
    <v-row class="px-4">各画面へのリンク</v-row>
    <v-row class="mt-4 px-4">
      <v-btn class="mr-4 mt-4" to="/login">ログイン画面</v-btn>
      <v-btn class="mr-4 mt-4" to="/reset">パスワードリセット画面</v-btn>
      <v-btn class="mr-4 mt-4" to="/manage/schedule">スケジュール画面</v-btn>
      <v-btn class="mr-4 mt-4" to="/manage/managetable">予約可能日設定</v-btn>
      <v-btn class="mr-4 mt-4" to="/manage/types">枠一覧画面</v-btn>
      <v-btn class="mr-4 mt-4" to="/reservation">予約フォーム</v-btn>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "home",
};
</script>
