<template>
  <div id="app">
    <v-app>
      <!-- <Login /> -->
      <!-- <ResetPassword /> -->
      <Profile />
    </v-app>
  </div>
</template>

<script>
// import Login from "./components/Login";
// import ResetPassword from "./components/ResetPassword";
import Profile from "./components/Profile";

export default {
  name: "App",
  components: {
    // Login,
    // ResetPassword,
    Profile,
  },
};
</script>

<style>
</style>
