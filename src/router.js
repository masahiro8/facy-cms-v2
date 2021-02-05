import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Login from "./components/Login.vue";
import ResetPassword from "./components/ResetPassword.vue";
import Schedule from "./views/Schedule.vue";
import Reservation from "./views/Reservation.vue";
import ManageTable from "./views/ManageTable.vue";
import ManageAccount from "./components/ManageAccount.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    { path: "/reset", name: "reset", component: ResetPassword },
    {
      path: "/schedule",
      name: "schedule",
      component: Schedule
    },
    {
      path: "/reservation",
      name: "reservation",
      component: Reservation
    },
    {
      path: "/managetable",
      name: "ManageTable",
      component: ManageTable
    },
    {
      path: "/manageaccount",
      name: "ManageAcount",
      component: ManageAccount
    }
  ]
});
