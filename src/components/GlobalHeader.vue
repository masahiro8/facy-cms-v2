<template>
  <v-app-bar class="global-header white" flat app>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>{{ AccountCircle }}</v-icon>
    </v-btn>
    <v-navigation-drawer v-model="drawer" absolute left temporary>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title"> Menu </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" link>
          <v-list-item-content>
            <v-list-item-title
              ><router-link :to="item.path">{{
                item.title
              }}</router-link></v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title
              ><a @click="logout">ログアウト</a>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app-bar>
</template>
<script>
import { mdiAccountCircle } from "@mdi/js";
import { UserAuth } from "../api/api";
import { Toaster } from "../components/Toast.vue";

export default {
  data: () => ({
    AccountCircle: mdiAccountCircle,
    drawer: false,
    items: [
      { path: "/login", title: "ログイン画面" },
      { path: "/reset", title: "パスワードリセット画面" },
      { path: "/manage/schedule", title: "スケジュール画面" },
      { path: "/manage/managetable", title: "予約可能日設定" },
      { path: "/manage/types", title: "時間枠管理" },
      { path: "/reservation", title: "予約フォーム" },
    ],
  }),
  methods: {
    async logout() {
      const user = await UserAuth().getLoggedinUserProfile();
      if (!user) {
        Toaster.show({ timeout: 1500, text: "ログインしていません" });
        return;
      }
      const result = await UserAuth().logout();
      if (result.error) {
        console.log("ログアウトできませんでした");
      } else {
        // ログインステータスremove
        localStorage.removeItem("mahouKeepLogin");
        localStorage.removeItem("mahouLoginAt");

        Toaster.show({ timeout: 1500, text: "ログアウトしました。" });
        this.$router.push("/").catch((err) => {
          console.log(err);
        });
        console.log("log out", result);
      }
    },
  },
};
</script>

<style lang="scss">
.v-navigation-drawer {
  height: 100vh !important; // windowの高さ適用
  .v-list-item__title {
    a {
      color: #696969;
      text-decoration: none;
    }
  }
}
.v-overlay {
  height: 100vh;
}
</style>