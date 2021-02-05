<template>
  <div>
    <v-container>
      <v-row align="center">
        <!-- <v-col align-self="center"><div>オンライン相談</div></v-col> -->
        <!-- <v-col align-self="center"><div>MAHOU MAKE CMS</div></v-col> -->
      </v-row>
      <div>
        <div>各画面へのリンク</div>
        <v-btn to="/login">ログイン画面</v-btn>
        <v-btn to="/reset">パスワードリセット画面</v-btn>
        <v-btn to="/schedule">スケジュール画面</v-btn>
        <v-btn to="/managetable">予約可能日設定</v-btn>
        <v-btn to="/manageaccount">アカウント管理画面</v-btn>
      </div>
    </v-container>
  </div>
</template>
<script>
export default {
  name: "home",
  components: {},
};
</script>
<style lang="scss" scoped>
</style>