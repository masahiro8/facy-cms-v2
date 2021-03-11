import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import ResetPassword from "./views/ResetPassword.vue";
import Schedule from "./views/Schedule.vue";
import Reservation from "./views/Reservation.vue";
import ManageTable from "./views/ManageTable.vue";
import ManageAccount from "./components/ManageAccount.vue";
import UpdateProfile from "./components/UpdateProfile.vue";

Vue.use(Router);

// manage/* ルートガード
// mahouLoginAt から24時間経過したらログアウト
// mahouKeepLogin == 1 の場合、24時間を超えてもログアウトしない
function guardManageRoutes(to, from, next) {
  let isAuthenticated = false;
  const loginStatus = localStorage.getItem("mahouKeepLogin"); // 1 or undef
  const loginAt = localStorage.getItem("mahouLoginAt"); // 時間 or undef
  const nowMinus24Hrs = new Date().getTime() - 60 * 60 * 24 * 1000;
  if (loginStatus == 1 || loginAt > nowMinus24Hrs) {
    isAuthenticated = true;
  } else {
    isAuthenticated = false;
  }
  if (isAuthenticated) {
    next(); // そのまま進む
  } else {
    next("/"); // リダイレクト
  }
}

export default new Router({
  mode: "history",
  routes: [
    //ここからpublic
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/reservation",
      name: "reservation",
      component: Reservation
    },
    //ここからcms
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/manage/reset",
      name: "reset",
      beforeEnter: guardManageRoutes,
      component: ResetPassword
    },
    {
      path: "/manage/schedule",
      name: "schedule",
      beforeEnter: guardManageRoutes,
      component: Schedule
    },
    {
      path: "/manage/managetable",
      name: "ManageTable",
      beforeEnter: guardManageRoutes,
      component: ManageTable
    },
    {
      path: "/manage/manageaccount",
      name: "ManageAcount",
      beforeEnter: guardManageRoutes,
      component: ManageAccount
    },
    {
      path: "/manage/updateprofile",
      name: "UpdateProfile",
      beforeEnter: guardManageRoutes,
      component: UpdateProfile,
      props: true
    }
  ]
});
