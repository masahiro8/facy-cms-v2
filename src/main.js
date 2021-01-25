// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";

// for vutify
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

// for VeeValidate
import VeeValidate, { Validator } from "vee-validate";
// 日本語ファイルを読み込み
import ja from "vee-validate/dist/locale/ja";

import axios from "axios"; //追記
import VueAxios from "vue-axios"; //追記

Vue.use(Vuetify);
Vue.use(VeeValidate);
Vue.use(VueAxios, axios); //追記

// vee-validateの日本語
Validator.localize("ja", ja);
Vue.use(VeeValidate, { locale: ja });

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  components: { App },
  template: "<App/>",
  vuetify: new Vuetify()
});
